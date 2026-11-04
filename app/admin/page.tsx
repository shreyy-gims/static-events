'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import Link from 'next/link'

import { raatRequest } from '@/lib/raat-browser'
import type { EventSettings, Guest } from '@/lib/raat-types'

type Operation = 'generate' | 'paid' | 'unpaid' | 'revoke'

type GuestFilter =
  | 'all'
  | 'paid'
  | 'unpaid'
  | 'entered'
  | 'not-entered'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function Scanner({
  onScan,
}: {
  onScan: (code: string) => Promise<void>
}) {
  const callback = useRef(onScan)
  const [error, setError] = useState('')

  useEffect(() => {
    callback.current = onScan
  }, [onScan])

  useEffect(() => {
    let disposed = false
    let locked = false
    let stop: (() => Promise<void>) | undefined

    void import('html5-qrcode')
      .then(({ Html5QrcodeScanner }) => {
        if (disposed) return

        const scanner = new Html5QrcodeScanner(
          'raat-scanner',
          {
            fps: 8,
            qrbox: {
              width: 230,
              height: 230,
            },
          },
          false
        )

        stop = () => scanner.clear()

        scanner.render(
          (text) => {
            if (locked || disposed) return

            locked = true

            void callback.current(text).catch(() => {
              if (!disposed) {
                setError('Unable to process this scan.')
              }
            })
          },
          () => {}
        )
      })
      .catch(() => {
        if (!disposed) {
          setError(
            'Camera scanner unavailable. Enter the guest code below.'
          )
        }
      })

    return () => {
      disposed = true
      void stop?.().catch(() => {})
    }
  }, [])

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <div id="raat-scanner" />
    </div>
  )
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [settings, setSettings] = useState<EventSettings | null>(null)

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<GuestFilter>('all')

  const [selected, setSelected] = useState<Guest | null>(null)
  const [scanner, setScanner] = useState(false)
  const [code, setCode] = useState('')

  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  // Prevent overlapping scanner/manual actions before React updates state.
  const actionLock = useRef(false)

  const load = useCallback(async () => {
    const result = await raatRequest('admin')

    setGuests(result.guests)
    setAuthorized(true)

    const event = await raatRequest('settings')

    setSettings(event.settings)
  }, [])

  useEffect(() => {
    let active = true

    async function initialize() {
      try {
        await load()
      } catch (error) {
        if (active) {
          setError(errorMessage(error, 'Unable to load the admin panel.'))
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void initialize()

    return () => {
      active = false
    }
  }, [load])

  useEffect(() => {
    if (!selected) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelected(null)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [selected])

  function beginAction() {
    if (actionLock.current) return false

    actionLock.current = true
    setBusy(true)
    setError('')
    setMessage('')

    return true
  }

  function finishAction() {
    actionLock.current = false
    setBusy(false)
  }

  async function logout() {
    if (!beginAction()) return

    setScanner(false)

    try {
      const response = await fetch('/api/admin/session', {
        method: 'DELETE',
        credentials: 'same-origin',
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Unable to sign out. Please try again.')
      }

      window.location.replace('/admin-login')
    } catch (error) {
      setError(errorMessage(error, 'Unable to sign out.'))
      finishAction()
    }
  }

  async function refreshGuests() {
    if (!beginAction()) return

    try {
      await load()
      setSelected(null)
      setMessage('Guest list refreshed.')
    } catch (error) {
      setError(errorMessage(error, 'Unable to refresh guests.'))
    } finally {
      finishAction()
    }
  }

  async function review(id: string, operation: Operation) {
    if (actionLock.current) return

    if (
      operation === 'paid' &&
      !window.confirm('Confirm you have received this guest’s payment?')
    ) {
      return
    }

    if (
      operation === 'revoke' &&
      !window.confirm('Revoke this guest’s current entry code?')
    ) {
      return
    }

    if (!beginAction()) return

    try {
      await raatRequest('manage', {
        method: 'POST',
        body: JSON.stringify({ id, operation }),
      })

      setSelected(null)
      setMessage('Guest record updated.')

      try {
        await load()
      } catch {
        setError(
          'The guest was updated, but the list could not refresh. Click Refresh guests.'
        )
      }
    } catch (error) {
      setError(errorMessage(error, 'Update failed.'))
    } finally {
      finishAction()
    }
  }

  async function scan(value: string) {
    if (!value.trim() || !beginAction()) return

    setScanner(false)

    try {
      const raw = value.trim()

      const normalizedCode = /^rb-/i.test(raw)
        ? raw.toUpperCase()
        : raw

      const result = await raatRequest('scan', {
        method: 'POST',
        body: JSON.stringify({
          code: normalizedCode,
        }),
      })

      setMessage(
        result.accepted
          ? `ENTRY ACCEPTED — ${result.name}`
          : `ENTRY DENIED — ${result.reason}${
              result.name ? ` (${result.name})` : ''
            }`
      )

      setCode('')
      setSelected(null)

      try {
        await load()
      } catch {
        setError(
          'The entry result above is saved, but the guest list could not refresh.'
        )
      }
    } catch (error) {
      setError(errorMessage(error, 'Scan failed.'))
    } finally {
      finishAction()
    }
  }

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void scan(code)
  }

  async function save() {
    if (!settings || !beginAction()) return

    try {
      await raatRequest('settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      })

      setMessage(
        'Ticket settings saved. Existing application amounts remain unchanged.'
      )
    } catch (error) {
      setError(errorMessage(error, 'Unable to save ticket settings.'))
    } finally {
      finishAction()
    }
  }

  async function copyGuestCode(guest: Guest) {
    if (!guest.entry_code) return

    setError('')
    setMessage('')

    try {
      await navigator.clipboard.writeText(
        `${guest.full_name} — ${guest.entry_code}`
      )

      setMessage('Name and entry code copied.')
    } catch {
      setError(
        'Could not copy. Select and copy the entry code manually.'
      )
    }
  }

  const visible = guests.filter((guest) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'paid' && guest.paid) ||
      (filter === 'unpaid' && !guest.paid) ||
      (filter === 'entered' && Boolean(guest.checked_in_at)) ||
      (filter === 'not-entered' && !guest.checked_in_at)

    const query = search.trim().toLowerCase()

    const matchesSearch =
      `${guest.full_name} ${guest.phone} ${guest.instagram} ${
        guest.entry_code || ''
      }`
        .toLowerCase()
        .includes(query)

    return matchesStatus && matchesSearch
  })

  const statistics = [
    { label: 'Applications', value: guests.length },
    {
      label: 'Unpaid',
      value: guests.filter((guest) => !guest.paid).length,
    },
    {
      label: 'Paid',
      value: guests.filter((guest) => guest.paid).length,
    },
    {
      label: 'Entered',
      value: guests.filter((guest) => guest.checked_in_at).length,
    },
  ]

  return (
    <main className="raat-page">
      <div className="raat-wrap">
        <div className="raat-row">
          <Link href="/">← STATIC</Link>

          {authorized && (
            <button
              type="button"
              className="raat-button secondary"
              disabled={busy}
              onClick={logout}
            >
              Sign out
            </button>
          )}
        </div>

        <p className="raat-kicker">PRIVATE / EVENT OPERATIONS</p>
        <h1>Guest desk</h1>

        {error && (
          <p className="raat-alert" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="raat-notice" role="status">
            {message}
          </p>
        )}

        {loading ? (
          <p>Loading admin panel…</p>
        ) : !authorized ? (
          <div className="raat-row">
            <Link href="/admin-login" className="raat-button">
              Admin login ↗
            </Link>

            <button
              type="button"
              className="raat-button secondary"
              disabled={busy}
              onClick={refreshGuests}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="raat-stats">
              {statistics.map((item) => (
                <div className="raat-card" key={item.label}>
                  <span className="raat-muted">{item.label}</span>
                  <h2>{item.value}</h2>
                </div>
              ))}
            </div>

            {settings && (
              <details className="raat-card">
                <summary>Manage the single ticket</summary>

                <div className="raat-form raat-grid">
                  {(
                    [
                      'title',
                      'ticket_name',
                      'venue',
                      'event_date',
                      'event_time',
                      'description',
                    ] as const
                  ).map((key) => (
                    <label key={key}>
                      {key.replaceAll('_', ' ')}

                      <input
                        value={settings[key]}
                        disabled={busy}
                        onChange={(event) =>
                          setSettings({
                            ...settings,
                            [key]: event.target.value,
                          })
                        }
                      />
                    </label>
                  ))}

                  <label>
                    Price (₹)
                    <input
                      type="number"
                      min={0}
                      max={100000}
                      step={1}
                      disabled={busy}
                      value={settings.price}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          price: Number(event.target.value),
                        })
                      }
                    />
                  </label>

                  <label className="raat-check">
                    <input
                      type="checkbox"
                      disabled={busy}
                      checked={settings.booking_open}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          booking_open: event.target.checked,
                        })
                      }
                    />
                    Registrations open
                  </label>

                  <button
                    type="button"
                    disabled={busy}
                    className="raat-button"
                    onClick={save}
                  >
                    Save ticket
                  </button>
                </div>
              </details>
            )}

            <section className="raat-card">
              <h2>Entry scanner</h2>

              <p className="raat-muted">
                Scan the guest QR or enter their code. Payment must be
                marked paid before entry. Every successful check-in is
                saved immediately. Camera scanning requires HTTPS or
                localhost.
              </p>

              <div className="raat-row">
                <button
                  type="button"
                  disabled={busy}
                  className="raat-button"
                  onClick={() => setScanner((open) => !open)}
                >
                  {scanner ? 'Close camera' : 'Scan QR'}
                </button>

                <button
                  type="button"
                  className="raat-button secondary"
                  disabled={busy}
                  onClick={refreshGuests}
                >
                  Refresh guests
                </button>
              </div>

              {scanner && <Scanner onScan={scan} />}

              <form
                className="raat-row raat-form"
                onSubmit={submitCode}
              >
                <label>
                  Entry code or QR text
                  <input
                    required
                    disabled={busy}
                    placeholder="RB-… or STATIC-RAAT:…"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                  />
                </label>

                <button
                  type="submit"
                  className="raat-button secondary"
                  disabled={busy || !code.trim()}
                >
                  Check in
                </button>
              </form>
            </section>

            <div className="raat-form raat-row">
              <label>
                Search guests
                <input
                  placeholder="Name, phone, Instagram or entry code"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <label>
                Status
                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value as GuestFilter)
                  }
                >
                  <option value="all">All guests</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="entered">Entered</option>
                  <option value="not-entered">Not entered</option>
                </select>
              </label>
            </div>

            <div className="raat-guest-grid">
              {visible.map((guest) => (
                <article className="raat-card" key={guest.id}>
                  {guest.photo_urls?.[0] && (
                    <img
                      className="raat-avatar"
                      src={guest.photo_urls[0]}
                      alt={`${guest.full_name} guest photo`}
                      loading="lazy"
                    />
                  )}

                  <p className="raat-badge">
                    {guest.checked_in_at ? 'ENTERED' : 'NOT ENTERED'}
                    {' · '}
                    {guest.paid ? 'PAID' : 'UNPAID'}
                  </p>

                  <h2>{guest.full_name}</h2>

                  <p>
                    {guest.phone} · {guest.instagram}
                  </p>

                  <p className="raat-kicker">
                    {guest.entry_code || 'CODE NOT GENERATED'}
                  </p>

                  <p className="raat-muted">
                    ₹{guest.amount} ·{' '}
                    {new Date(guest.created_at).toLocaleDateString(
                      'en-IN'
                    )}
                  </p>

                  <button
                    type="button"
                    className="raat-button secondary"
                    disabled={busy}
                    onClick={() => setSelected(guest)}
                  >
                    Open guest ID ↗
                  </button>
                </article>
              ))}
            </div>

            {!visible.length && <p>No matching registrations.</p>}

            {selected && (
              <div
                className="raat-modal"
                onClick={() => setSelected(null)}
              >
                <section
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="guest-id-title"
                  className="raat-card"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => {
                    if (event.key !== 'Tab') return

                    const elements =
                      event.currentTarget.querySelectorAll<HTMLElement>(
                        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
                      )

                    const first = elements[0]
                    const last = elements[elements.length - 1]

                    if (!first || !last) return

                    if (
                      event.shiftKey &&
                      document.activeElement === first
                    ) {
                      event.preventDefault()
                      last.focus()
                    } else if (
                      !event.shiftKey &&
                      document.activeElement === last
                    ) {
                      event.preventDefault()
                      first.focus()
                    }
                  }}
                >
                  <button
                    type="button"
                    autoFocus
                    className="raat-button secondary"
                    onClick={() => setSelected(null)}
                  >
                    Close guest ID
                  </button>

                  <p className="raat-kicker">
                    PRIVATE STATIC GUEST ID
                  </p>

                  <h2 id="guest-id-title">{selected.full_name}</h2>

                  <div className="raat-photos">
                    {selected.photo_urls?.map((url, index) => (
                      <img
                        key={url}
                        src={url}
                        alt={`Guest photo ${index + 1}`}
                      />
                    ))}
                  </div>

                  <dl className="raat-details">
                    {[
                      ['Phone', selected.phone],
                      ['Instagram', selected.instagram],
                      ['Drink', selected.drink],
                      ['Smoking', selected.smoking],
                      ['Single / mingle', selected.relationship],
                      ['Open to approach', selected.approachable],
                      ['Heard about us', selected.referral],
                      ['Payment', selected.paid ? 'PAID' : 'UNPAID'],
                      [
                        'Entry code',
                        selected.entry_code || 'Not generated',
                      ],
                      ['Amount', `₹${selected.amount}`],
                      [
                        'Entry',
                        selected.checked_in_at
                          ? `ENTERED — ${new Date(
                              selected.checked_in_at
                            ).toLocaleString('en-IN')}`
                          : 'NOT ENTERED',
                      ],
                      ['Application ID', selected.id],
                    ].map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>

                  {selected.qr_image && (
                    <img
                      src={selected.qr_image}
                      width={220}
                      height={220}
                      alt="Guest entry QR"
                    />
                  )}

                  {selected.entry_code && (
                    <div className="raat-row">
                      <button
                        type="button"
                        className="raat-button secondary"
                        onClick={() => copyGuestCode(selected)}
                      >
                        Copy name & code
                      </button>

                      {selected.qr_image && (
                        <a
                          className="raat-button secondary"
                          download={`STATIC-${selected.entry_code}.png`}
                          href={selected.qr_image}
                        >
                          Download QR
                        </a>
                      )}
                    </div>
                  )}

                  {selected.checked_in_at && (
                    <p className="raat-muted">
                      This guest has entered. Their record is locked.
                    </p>
                  )}

                  <div className="raat-row">
                    <button
                      type="button"
                      className="raat-button"
                      disabled={
                        busy ||
                        Boolean(selected.checked_in_at) ||
                        Boolean(selected.entry_code)
                      }
                      onClick={() => review(selected.id, 'generate')}
                    >
                      {selected.entry_code
                        ? 'Code generated'
                        : 'Generate entry code'}
                    </button>

                    <button
                      type="button"
                      className="raat-button secondary"
                      disabled={
                        busy || Boolean(selected.checked_in_at)
                      }
                      onClick={() =>
                        review(
                          selected.id,
                          selected.paid ? 'unpaid' : 'paid'
                        )
                      }
                    >
                      {selected.paid ? 'Mark unpaid' : 'Mark paid'}
                    </button>

                    <button
                      type="button"
                      className="raat-button secondary"
                      disabled={
                        busy ||
                        Boolean(selected.checked_in_at) ||
                        !selected.entry_code
                      }
                      onClick={() => review(selected.id, 'revoke')}
                    >
                      Revoke code
                    </button>
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}