'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Ban,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  LayoutGrid,
  Loader2,
  LockKeyhole,
  LogOut,
  Moon,
  QrCode,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Ticket,
  Users,
  X,
} from 'lucide-react'

import { raatRequest } from '@/lib/raat-browser'
import { AdminGroupOffers } from '@/components/admin-group-offers'
import type { EventSettings, Guest } from '@/lib/raat-types'
import { AdminWheelOdds } from '@/components/admin-wheel-odds'

type Operation = 'generate' | 'paid' | 'unpaid' | 'revoke'
type Tab = 'guests' | 'entry' | 'settings' | 'offers'
type GuestFilter = 'all' | 'paid' | 'unpaid' | 'entered' | 'not-entered'
type StayFilter = 'all' | 'yes' | 'no' | 'unanswered'

type Notice = {
  text: string
  tone: 'success' | 'error' | 'info'
}

const inputClass =
  'min-h-12 w-full rounded-xl border border-white/15 bg-[#080A07] px-4 py-3 text-base text-white outline-none transition placeholder:text-white/25 focus:border-[#CEFF50] focus:ring-4 focus:ring-[#CEFF50]/10 disabled:opacity-50'

const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#CEFF50] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#080A07] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CEFF50] disabled:cursor-not-allowed disabled:opacity-40'

const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.03] px-4 py-3 text-xs font-bold text-white/75 transition hover:border-[#CEFF50]/50 hover:text-[#CEFF50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CEFF50] disabled:cursor-not-allowed disabled:opacity-40'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function dateLabel(value: string | null, includeTime = false) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return includeTime
    ? date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      })
}

function stayLabel(value: Guest['night_stay']) {
  if (value === 'yes') return 'Yes — charged separately'
  if (value === 'no') return 'No'
  return 'Not answered'
}

function preferenceLabel(value: string) {
  const labels: Record<string, string> = {
    yes: 'Yes',
    no: 'No',
    alcoholic: 'Alcoholic',
    'non-alcoholic': 'Non-alcoholic',
    single: 'Single',
    mingle: 'Mingle',
    'prefer-not-to-say': 'Prefer not to say',
  }

  return labels[value] || value || 'Not answered'
}

function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'lime' | 'amber' | 'red' | 'neutral'
}) {
  const styles = {
    lime: 'border-[#CEFF50]/25 bg-[#CEFF50]/10 text-[#CEFF50]',
    amber: 'border-amber-300/20 bg-amber-300/10 text-amber-200',
    red: 'border-red-300/20 bg-red-300/10 text-red-200',
    neutral: 'border-white/15 bg-white/5 text-white/55',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${styles[tone]}`}
    >
      {children}
    </span>
  )
}

function NoticeBox({ notice }: { notice: Notice }) {
  const styles = {
    success: 'border-[#CEFF50]/25 bg-[#CEFF50]/[.07] text-[#E4FFAD]',
    error: 'border-red-400/25 bg-red-950/25 text-red-100',
    info: 'border-white/15 bg-white/5 text-white/75',
  }

  return (
    <div
      role={notice.tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl border p-4 text-sm leading-6 ${styles[notice.tone]}`}
    >
      {notice.text}
    </div>
  )
}

function Scanner({
  onScan,
}: {
  onScan: (code: string) => Promise<void>
}) {
  const id = `static-scanner-${useId().replace(/:/g, '')}`
  const callback = useRef(onScan)
  const [error, setError] = useState('')

  useEffect(() => {
    callback.current = onScan
  }, [onScan])

  useEffect(() => {
    let disposed = false
    let locked = false
    let clear: (() => Promise<void>) | undefined

    void import('html5-qrcode')
      .then(({ Html5QrcodeScanner }) => {
        if (disposed) return

        const scanner = new Html5QrcodeScanner(
          id,
          { fps: 8, qrbox: { width: 230, height: 230 } },
          false
        )

        clear = () => scanner.clear()

        scanner.render(
          (text) => {
            if (locked || disposed) return
            locked = true

            void callback.current(text).catch(() => {
              if (!disposed) {
                locked = false
                setError('Unable to process the scan. Try again.')
              }
            })
          },
          () => {}
        )
      })
      .catch(() => {
        if (!disposed) {
          setError('Camera unavailable. Enter the guest code below.')
        }
      })

    return () => {
      disposed = true
      void clear?.().catch(() => {})
    }
  }, [id])

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-white/15 bg-[#080A07] p-3">
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-200">
          {error}
        </p>
      )}
      <div id={id} />
    </div>
  )
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [settings, setSettings] = useState<EventSettings | null>(null)

  const [tab, setTab] = useState<Tab>('guests')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<GuestFilter>('all')
  const [stayFilter, setStayFilter] = useState<StayFilter>('all')

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scanner, setScanner] = useState(false)
  const [code, setCode] = useState('')

  const [notice, setNotice] = useState<Notice | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [needsRefresh, setNeedsRefresh] = useState(false)

  const actionLock = useRef(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const selected = guests.find((guest) => guest.id === selectedId) || null

  const loadGuests = useCallback(async () => {
    const result = await raatRequest('admin')
    setGuests(result.guests)
    setAuthorized(true)
    setNeedsRefresh(false)
  }, [])

  const loadSettings = useCallback(async () => {
    const result = await raatRequest('settings')
    setSettings(result.settings)
  }, [])

  useEffect(() => {
    let active = true

    async function initialize() {
      try {
        await loadGuests()

        try {
          await loadSettings()
        } catch {
          if (active) {
            setNotice({
              tone: 'error',
              text: 'Guests loaded, but event settings could not load. Retry from the Settings tab.',
            })
          }
        }
      } catch (error) {
        if (active) {
          setNotice({
            tone: 'error',
            text: errorMessage(error, 'Unable to load the admin panel.'),
          })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void initialize()

    return () => {
      active = false
    }
  }, [loadGuests, loadSettings])

  // Native dialog provides focus trapping, Escape and focus restoration.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!selectedId || !dialog) return

    if (!dialog.open) dialog.showModal()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [selectedId])

  useEffect(() => {
    if (tab !== 'entry') setScanner(false)
  }, [tab])

  function beginAction() {
    if (actionLock.current) return false

    actionLock.current = true
    setBusy(true)
    setNotice(null)
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

      if (!response.ok) throw new Error('Unable to sign out. Try again.')

      window.location.replace('/admin-login')
    } catch (error) {
      setNotice({
        tone: 'error',
        text: errorMessage(error, 'Unable to sign out.'),
      })
      finishAction()
    }
  }

  async function refreshGuests() {
    if (!beginAction()) return

    try {
      await loadGuests()
      setNotice({ tone: 'success', text: 'Guest list refreshed.' })
    } catch (error) {
      setNotice({
        tone: 'error',
        text: errorMessage(error, 'Unable to refresh guests.'),
      })
    } finally {
      finishAction()
    }
  }

  async function retrySettings() {
    if (!beginAction()) return

    try {
      await loadSettings()
    } catch (error) {
      setNotice({
        tone: 'error',
        text: errorMessage(error, 'Unable to load settings.'),
      })
    } finally {
      finishAction()
    }
  }

  async function review(id: string, operation: Operation) {
    if (actionLock.current || needsRefresh) return

    const confirmation: Partial<Record<Operation, string>> = {
      paid: 'Confirm you have received this guest’s payment?',
      unpaid: 'Change this guest’s payment status to unpaid?',
      revoke: 'Revoke this guest’s entry code and QR?',
    }

    if (confirmation[operation] && !window.confirm(confirmation[operation])) {
      return
    }

    if (!beginAction()) return

    try {
      await raatRequest('manage', {
        method: 'POST',
        body: JSON.stringify({ id, operation }),
      })

      setNeedsRefresh(true)

      try {
        await loadGuests()
        setNotice({ tone: 'success', text: 'Guest record updated.' })
      } catch {
        setNotice({
          tone: 'error',
          text: 'The change was saved, but the list could not refresh. Refresh guests before making another change.',
        })
      }
    } catch (error) {
      setNotice({
        tone: 'error',
        text: errorMessage(error, 'Unable to update this guest.'),
      })
    } finally {
      finishAction()
    }
  }

  async function scan(value: string) {
    if (!value.trim() || !beginAction()) return
    setScanner(false)

    try {
      const raw = value.trim()
      const normalizedCode = /^rb-/i.test(raw) ? raw.toUpperCase() : raw

      const result = await raatRequest('scan', {
        method: 'POST',
        body: JSON.stringify({ code: normalizedCode }),
      })

      const resultText = result.accepted
        ? `ENTRY ACCEPTED — ${result.name}`
        : `ENTRY DENIED — ${result.reason}${
            result.name ? ` (${result.name})` : ''
          }`

      setCode('')
      setNotice({
        tone: result.accepted ? 'success' : 'error',
        text: resultText,
      })

      try {
        await loadGuests()
      } catch {
        setNeedsRefresh(true)
        setNotice({
          tone: result.accepted ? 'success' : 'error',
          text: `${resultText}. Guest list refresh failed; refresh it manually.`,
        })
      }
    } catch (error) {
      setNotice({
        tone: 'error',
        text: errorMessage(error, 'Unable to process this code.'),
      })
    } finally {
      finishAction()
    }
  }

  function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void scan(code)
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!settings || !beginAction()) return

    try {
      await raatRequest('settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      })

      setNotice({
        tone: 'success',
        text: 'Event settings saved. Existing guest pass amounts remain unchanged.',
      })
    } catch (error) {
      setNotice({
        tone: 'error',
        text: errorMessage(error, 'Unable to save settings.'),
      })
    } finally {
      finishAction()
    }
  }

  async function copyGuestCode(guest: Guest) {
    if (!guest.entry_code) return

    try {
      await navigator.clipboard.writeText(
        `${guest.full_name} — ${guest.entry_code}`
      )
      setNotice({ tone: 'success', text: 'Guest name and code copied.' })
    } catch {
      setNotice({
        tone: 'error',
        text: 'Copy unavailable. Select and copy the code manually.',
      })
    }
  }

  const visible = guests.filter((guest) => {
    const matchesStatus =
      filter === 'all' ||
      (filter === 'paid' && guest.paid) ||
      (filter === 'unpaid' && !guest.paid) ||
      (filter === 'entered' && Boolean(guest.checked_in_at)) ||
      (filter === 'not-entered' && !guest.checked_in_at)

    const matchesStay =
      stayFilter === 'all' ||
      (stayFilter === 'yes' && guest.night_stay === 'yes') ||
      (stayFilter === 'no' && guest.night_stay === 'no') ||
      (stayFilter === 'unanswered' && !guest.night_stay)

    const matchesSearch =
      `${guest.full_name} ${guest.phone} ${guest.instagram} ${
        guest.entry_code || ''
      }`
        .toLowerCase()
        .includes(search.trim().toLowerCase())

    return matchesStatus && matchesStay && matchesSearch
  })

  const statistics = [
    { label: 'Registrations', value: guests.length, icon: Users },
    {
      label: 'Marked paid',
      value: guests.filter((guest) => guest.paid).length,
      icon: CheckCircle2,
    },
    {
      label: 'Unpaid',
      value: guests.filter((guest) => !guest.paid).length,
      icon: Ticket,
    },
    {
      label: 'Entered',
      value: guests.filter((guest) => guest.checked_in_at).length,
      icon: ShieldCheck,
    },
    {
      label: 'Night-stay interest',
      value: guests.filter((guest) => guest.night_stay === 'yes').length,
      icon: Moon,
    },
  ]

  const tabs = [
    { id: 'guests' as const, label: 'Guests', icon: LayoutGrid },
    { id: 'entry' as const, label: 'Entry desk', icon: QrCode },
    { id: 'settings' as const, label: 'Event settings', icon: Settings2 },
    {
  id: 'offers' as const,
  label: 'Group offers',
  icon: Users,
},
  ]

  const selectedDetails = selected
    ? [
        ['Phone', selected.phone],
        ['Instagram', selected.instagram],
        ['Drink preference', preferenceLabel(selected.drink)],
        ['Smoking', preferenceLabel(selected.smoking)],
        ['Single / mingle', preferenceLabel(selected.relationship)],
        ['Open to approach', preferenceLabel(selected.approachable)],
        ['Night stay', stayLabel(selected.night_stay)],
        ['Heard about us', selected.referral],
        ['Pass amount', `₹${selected.amount.toLocaleString('en-IN')}`],
        ['Registered', dateLabel(selected.created_at, true)],
        ['Entry time', dateLabel(selected.checked_in_at, true)],
        ['Registration ID', selected.id],
      ]
    : []

  return (
    <main className="static-admin min-h-screen bg-[#080A07] text-[#F5F6EE] selection:bg-[#CEFF50] selection:text-black">
      <style>{`
        .static-admin button,
        .static-admin a,
        .static-admin input,
        .static-admin select,
        .static-admin textarea {
          -webkit-tap-highlight-color: transparent;
        }

        .static-admin .admin-appear {
          animation: adminAppear .35s ease both;
        }

        .static-admin #html5-qrcode-anchor-scan-type-change {
          color: #CEFF50 !important;
        }

        .static-admin [id^="static-scanner-"] {
          border: none !important;
          color: #F5F6EE;
        }

        .static-admin [id^="static-scanner-"] button {
          border: 1px solid #ffffff35;
          border-radius: 10px;
          padding: 10px 14px;
          margin: 8px;
          color: #CEFF50;
          background: #11160F;
        }

        .static-admin [id^="static-scanner-"] video {
          border-radius: 12px;
        }

        @keyframes adminAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .static-admin .admin-appear { animation: none; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/10 bg-[#0D110B]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Back to STATIC website"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white/60 transition hover:text-[#CEFF50]"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <Link
                href="/"
                className="text-2xl font-black tracking-[-.07em]"
              >
                STATIC<span className="text-[#CEFF50]">✳</span>
              </Link>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[.2em] text-white/35">
                EVENT OPERATIONS
              </p>
            </div>
          </div>

          {authorized && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={secondaryButton}
                disabled={busy}
                onClick={refreshGuests}
              >
                <RefreshCw
                  size={15}
                  className={busy ? 'animate-spin motion-reduce:animate-none' : ''}
                />
                <span className="hidden sm:inline">Refresh guests</span>
              </button>

              <button
                type="button"
                className={secondaryButton}
                disabled={busy}
                onClick={logout}
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-9 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[.22em] text-[#CEFF50]">
              PRIVATE ADMIN DASHBOARD
            </p>
            <h1 className="text-4xl font-black tracking-[-.055em] sm:text-6xl">
              Guest desk<span className="text-[#CEFF50]">.</span>
            </h1>
            <p className="mt-3 text-sm text-white/45">
              Manage registrations, payments, entry codes and night-stay interest.
            </p>
          </div>

          {settings && authorized && (
            <Badge tone={settings.booking_open ? 'lime' : 'neutral'}>
              {settings.booking_open ? 'Registrations open' : 'Registrations closed'}
            </Badge>
          )}
        </div>

        {notice && (
          <div className="mb-6">
            <NoticeBox notice={notice} />
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-white/50">
            <Loader2 size={22} className="animate-spin motion-reduce:animate-none" />
            Loading guest desk…
          </div>
        ) : !authorized ? (
          <section className="rounded-2xl border border-white/15 bg-[#11160F] p-8">
            <LockKeyhole size={30} className="mb-5 text-[#CEFF50]" />
            <h2 className="text-2xl font-black">Admin access required</h2>
            <p className="mt-3 text-sm text-white/50">
              Sign in to access guest details.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin-login" className={primaryButton}>
                Admin login <ArrowUpRight size={16} />
              </Link>
              <button
                type="button"
                className={secondaryButton}
                disabled={busy}
                onClick={refreshGuests}
              >
                Retry
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              {statistics.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-[#11160F] p-5"
                  >
                    <div className="mb-5 flex items-center justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
                        {item.label}
                      </p>
                      <Icon size={17} className="shrink-0 text-[#CEFF50]/75" />
                    </div>
                    <p className="text-3xl font-black tracking-tight sm:text-4xl">
                      {item.value}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Tabs */}
            <nav
              aria-label="Admin sections"
              className="my-7 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-[#0D110B] p-2"
            >
              {tabs.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={tab === item.id}
                    onClick={() => setTab(item.id)}
                    className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition ${
                      tab === item.id
                        ? 'bg-[#CEFF50] text-[#080A07]'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </nav>

            {/* Guests */}
            {tab === 'guests' && (
              <section className="admin-appear">
                <div className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-[#11160F] p-4 md:grid-cols-[1fr_180px_200px]">
                  <label className="relative">
                    <span className="sr-only">Search guests</span>
                    <Search
                      size={18}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-4 text-white/30"
                    />
                    <input
                      className={`${inputClass} pl-11`}
                      placeholder="Name, phone, Instagram or code"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                  </label>

                  <label>
                    <span className="sr-only">Payment or entry status</span>
                    <select
                      className={inputClass}
                      value={filter}
                      onChange={(event) =>
                        setFilter(event.target.value as GuestFilter)
                      }
                    >
                      <option value="all">All statuses</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="entered">Entered</option>
                      <option value="not-entered">Not entered</option>
                    </select>
                  </label>

                  <label>
                    <span className="sr-only">Night-stay preference</span>
                    <select
                      className={inputClass}
                      value={stayFilter}
                      onChange={(event) =>
                        setStayFilter(event.target.value as StayFilter)
                      }
                    >
                      <option value="all">All night-stay answers</option>
                      <option value="yes">Night stay: Yes</option>
                      <option value="no">Night stay: No</option>
                      <option value="unanswered">Night stay: Not answered</option>
                    </select>
                  </label>
                </div>

                <div className="mb-5 flex flex-wrap justify-between gap-3 text-xs text-white/40">
                  <p>Showing {visible.length} of {guests.length} registrations</p>
                  <p>Night-stay charges are separate from the pass.</p>
                </div>

                {visible.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visible.map((guest) => (
                      <article
                        key={guest.id}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-[#11160F] transition hover:border-[#CEFF50]/30"
                      >
                        <div className="flex items-start gap-4 p-5">
                          {guest.photo_urls?.[0] ? (
                            <img
                              src={guest.photo_urls[0]}
                              alt={`${guest.full_name} guest photo`}
                              loading="lazy"
                              className="h-20 w-20 shrink-0 rounded-xl bg-[#080A07] object-cover"
                            />
                          ) : (
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#CEFF50]/10 text-2xl font-black text-[#CEFF50]">
                              {guest.full_name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h2 className="break-words text-lg font-black tracking-tight">
                              {guest.full_name}
                            </h2>
                            <p className="mt-1 break-all text-xs text-white/45">
                              {guest.instagram}
                            </p>
                            <p className="mt-2 text-xs text-white/65">
                              {guest.phone}
                            </p>
                          </div>
                        </div>

                        <div className="px-5">
                          <div className="flex flex-wrap gap-2">
                            <Badge tone={guest.paid ? 'lime' : 'amber'}>
                              {guest.paid ? 'Paid' : 'Unpaid'}
                            </Badge>
                            <Badge tone={guest.checked_in_at ? 'lime' : 'neutral'}>
                              {guest.checked_in_at ? 'Entered' : 'Not entered'}
                            </Badge>
                            {guest.status === 'rejected' && (
                              <Badge tone="red">Code revoked</Badge>
                            )}
                          </div>

                          <div className="mt-4 rounded-xl border border-white/10 bg-[#080A07] px-4 py-3">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-white/30">
                              Entry code
                            </p>
                            <p className="mt-1 break-all font-mono text-sm font-bold text-[#CEFF50]">
                              {guest.entry_code || 'Not generated'}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
                            <Moon size={14} className="text-[#CEFF50]/70" />
                            Night stay:{' '}
                            {guest.night_stay === 'yes'
                              ? 'Yes'
                              : guest.night_stay === 'no'
                                ? 'No'
                                : 'Not answered'}
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
                          <span className="text-xs text-white/40">
                            ₹{guest.amount.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              setScanner(false)
                              setNotice(null)
                              setSelectedId(guest.id)
                            }}
                            className="inline-flex min-h-10 items-center gap-2 text-xs font-black text-[#CEFF50] transition hover:text-white disabled:opacity-40"
                          >
                            Open guest ID <ChevronRight size={16} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center">
                    <Users size={32} className="mx-auto mb-5 text-white/25" />
                    <h2 className="text-xl font-bold">No matching guests</h2>
                    <p className="mt-3 text-sm text-white/40">
                      Try a different search or reset the filters.
                    </p>
                    <button
                      type="button"
                      className={`${secondaryButton} mt-6`}
                      onClick={() => {
                        setSearch('')
                        setFilter('all')
                        setStayFilter('all')
                      }}
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Entry */}
            {tab === 'entry' && (
              <section className="admin-appear grid items-start gap-5 lg:grid-cols-[1fr_.65fr]">
                <div className="rounded-2xl border border-white/10 bg-[#11160F] p-6 sm:p-8">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#CEFF50]/10 text-[#CEFF50]">
                      <QrCode size={25} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">
                        Entry scanner
                      </h2>
                      <p className="mt-1 text-xs text-white/40">
                        Scan a QR or enter the guest’s code.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={busy}
                    className={primaryButton}
                    onClick={() => setScanner((open) => !open)}
                  >
                    {scanner ? <X size={17} /> : <Camera size={17} />}
                    {scanner ? 'Close camera' : 'Open camera scanner'}
                  </button>

                  {scanner && <Scanner onScan={scan} />}

                  <form
                    onSubmit={submitCode}
                    className="mt-8 border-t border-white/10 pt-7"
                  >
                    <label
                      htmlFor="entry-code"
                      className="mb-3 block text-[10px] font-black uppercase tracking-wider text-white/50"
                    >
                      Manual entry code or QR text
                    </label>
                    <input
                      id="entry-code"
                      required
                      disabled={busy}
                      className={inputClass}
                      value={code}
                      placeholder="RB-… or STATIC-RAAT:…"
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(event) => setCode(event.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={busy || !code.trim()}
                      className={`${primaryButton} mt-4 w-full`}
                    >
                      {busy ? (
                        <Loader2 size={17} className="animate-spin motion-reduce:animate-none" />
                      ) : (
                        <Check size={17} />
                      )}
                      Verify & mark entered
                    </button>
                  </form>
                </div>

                <aside className="rounded-2xl border border-white/10 bg-[#11160F] p-6 sm:p-8">
                  <ShieldCheck size={27} className="mb-6 text-[#CEFF50]" />
                  <h3 className="text-xl font-black">At the door</h3>

                  <ol className="mt-6 space-y-5 text-sm leading-7 text-white/50">
                    <li>1. Verify the guest’s name against their entry code.</li>
                    <li>2. Payment must be marked paid before entry.</li>
                    <li>3. Scan the QR or submit their readable code.</li>
                    <li>4. Admit only when the result says ENTRY ACCEPTED.</li>
                  </ol>

                  <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-white/35">
                    The scanner closes after each scan. Reopen it for the
                    next guest. Camera access requires HTTPS or localhost.
                  </p>

                  <div className="mt-6 rounded-xl border border-[#CEFF50]/20 bg-[#CEFF50]/5 p-4 text-xs leading-6 text-white/55">
                    Night-stay interest is not an accommodation booking.
                    Night-stay charges are not included in the pass.
                  </div>
                </aside>
              </section>
            )}

            {/* Group offers */}
            {tab === 'offers' && (
  <section className="admin-appear space-y-6">
    <AdminWheelOdds />
    <AdminGroupOffers />
  </section>
)}

            {/* Settings */}
            {tab === 'settings' && (
              <section className="admin-appear max-w-4xl rounded-2xl border border-white/10 bg-[#11160F] p-6 sm:p-8">
                <h2 className="text-2xl font-black tracking-tight">
                  Event & pass settings
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/45">
                  Manage the single pass shown on the guest registration page.
                </p>

                {!settings ? (
                  <button
                    type="button"
                    className={`${secondaryButton} mt-6`}
                    disabled={busy}
                    onClick={retrySettings}
                  >
                    Retry loading settings
                  </button>
                ) : (
                  <form onSubmit={saveSettings} className="mt-8">
                    <fieldset disabled={busy}>
                      <div className="grid gap-5 sm:grid-cols-2">
                        {[
                          { key: 'title' as const, label: 'Event title', max: 80 },
                          { key: 'ticket_name' as const, label: 'Pass name', max: 80 },
                          { key: 'venue' as const, label: 'Venue', max: 160 },
                          { key: 'event_date' as const, label: 'Event date', max: 80 },
                          { key: 'event_time' as const, label: 'Event timing', max: 80 },
                        ].map((item) => (
                          <label key={item.key} className="block">
                            <span className="mb-3 block text-xs font-bold text-white/55">
                              {item.label}
                            </span>
                            <input
                              required
                              maxLength={item.max}
                              className={inputClass}
                              value={settings[item.key]}
                              onChange={(event) =>
                                setSettings({
                                  ...settings,
                                  [item.key]: event.target.value,
                                })
                              }
                            />
                          </label>
                        ))}

                        <label className="block">
                          <span className="mb-3 block text-xs font-bold text-white/55">
                            Pass price (₹)
                          </span>
                          <input
                            required
                            type="number"
                            min={0}
                            max={100000}
                            step={1}
                            className={inputClass}
                            value={settings.price}
                            onChange={(event) =>
                              setSettings({
                                ...settings,
                                price: Number(event.target.value),
                              })
                            }
                          />
                        </label>

                        <label className="block sm:col-span-2">
                          <span className="mb-3 block text-xs font-bold text-white/55">
                            Description
                          </span>
                          <textarea
                            required
                            rows={5}
                            maxLength={2000}
                            className={`${inputClass} resize-y`}
                            value={settings.description}
                            onChange={(event) =>
                              setSettings({
                                ...settings,
                                description: event.target.value,
                              })
                            }
                          />
                        </label>
                      </div>

                      <label className="mt-6 flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-white/15 bg-[#080A07] p-5">
                        <span>
                          <span className="block text-sm font-bold">
                            Accept guest registrations
                          </span>
                          <span className="mt-1 block text-xs text-white/40">
                            Save changes to apply this setting.
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          className="h-5 w-5 shrink-0 accent-[#CEFF50]"
                          checked={settings.booking_open}
                          onChange={(event) =>
                            setSettings({
                              ...settings,
                              booking_open: event.target.checked,
                            })
                          }
                        />
                      </label>

                      <div className="mt-7 flex flex-wrap items-center gap-5">
                        <button type="submit" disabled={busy} className={primaryButton}>
                          {busy ? (
                            <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
                          ) : (
                            <Check size={16} />
                          )}
                          Save changes
                        </button>
                        <p className="max-w-md text-xs leading-6 text-white/35">
                          Price changes affect new registrations. Existing
                          guest pass amounts remain unchanged.
                        </p>
                      </div>
                    </fieldset>
                  </form>
                )}
              </section>
            )}
          </>
        )}

        <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-wider text-white/25">
          <span>STATIC / Private event operations</span>
          <span>Guest details are restricted to authorized admins</span>
        </footer>
      </div>

      {/* Native guest ID dialog */}
      {selected && (
        <dialog
          ref={dialogRef}
          onCancel={() => setSelectedId(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null)
          }}
          className="m-auto max-h-[90svh] w-[calc(100%-24px)] max-w-4xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0D110B] p-0 text-[#F5F6EE] shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0D110B]/95 px-5 py-4 backdrop-blur-xl">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#CEFF50]">
                PRIVATE GUEST ID
              </p>
              <h2 className="mt-1 text-lg font-black">{selected.full_name}</h2>
            </div>

            <button
              type="button"
              autoFocus
              aria-label="Close guest ID"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 text-white/60 transition hover:text-white"
              onClick={() => setSelectedId(null)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 sm:p-7">
            {notice && (
              <div className="mb-5">
                <NoticeBox notice={notice} />
              </div>
            )}

            <div className="grid items-start gap-7 md:grid-cols-[.75fr_1.25fr]">
              <div>
                {selected.photo_urls?.length ? (
                  <div className="space-y-3">
                    {selected.photo_urls.map((url, index) => (
                      <img
                        key={url}
                        src={url}
                        alt={`${selected.full_name}, guest photo ${index + 1}`}
                        className="max-h-[380px] w-full rounded-xl border border-white/10 bg-black object-contain"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-xl bg-[#CEFF50]/5">
                    <Users size={45} className="text-[#CEFF50]/30" />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone={selected.paid ? 'lime' : 'amber'}>
                    {selected.paid ? 'Paid' : 'Unpaid'}
                  </Badge>
                  <Badge tone={selected.checked_in_at ? 'lime' : 'neutral'}>
                    {selected.checked_in_at ? 'Entered' : 'Not entered'}
                  </Badge>
                  {selected.status === 'rejected' && (
                    <Badge tone="red">Code revoked</Badge>
                  )}
                </div>

                <div className="mt-5 rounded-xl border border-[#CEFF50]/20 bg-[#CEFF50]/5 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#CEFF50]">
                    <Moon size={16} />
                    Night stay
                  </div>
                  <p className="mt-2 text-sm">{stayLabel(selected.night_stay)}</p>
                  <p className="mt-3 text-xs leading-6 text-white/40">
                    Accommodation is not included in the pass.
                    A Yes answer indicates interest, not a confirmed booking.
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <dl className="divide-y divide-white/10">
                  {selectedDetails.map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-[110px_1fr] gap-4 py-3 text-xs leading-6 sm:grid-cols-[145px_1fr]"
                    >
                      <dt className="text-white/40">{key}</dt>
                      <dd className="min-w-0 break-words text-white/80 [overflow-wrap:anywhere]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Entry code and QR */}
            <section className="mt-7 rounded-xl border border-white/10 bg-[#080A07] p-5">
              <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/35">
                    PERSONAL ENTRY CODE
                  </p>
                  <p className="mt-3 break-all font-mono text-xl font-black text-[#CEFF50] sm:text-2xl">
                    {selected.entry_code || 'Not generated'}
                  </p>
                  <p className="mt-3 text-xs leading-6 text-white/40">
                    Payment must be marked paid before entry.
                    Generating a code does not mark payment as received.
                  </p>

                  {selected.entry_code && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={secondaryButton}
                        onClick={() => copyGuestCode(selected)}
                      >
                        <Copy size={14} /> Copy name & code
                      </button>

                      {selected.qr_image && (
                        <a
                          className={secondaryButton}
                          download={`STATIC-${selected.entry_code}.png`}
                          href={selected.qr_image}
                        >
                          <Download size={14} /> Download QR
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {selected.qr_image && (
                  <img
                    src={selected.qr_image}
                    alt="Guest entry QR"
                    width={160}
                    height={160}
                    className="rounded-xl bg-white p-2"
                  />
                )}
              </div>
            </section>

            {selected.checked_in_at && (
              <p className="mt-5 flex items-center gap-2 text-xs leading-6 text-white/50">
                <LockKeyhole size={15} />
                This guest has entered. Their record is locked.
              </p>
            )}

            {needsRefresh && (
              <button
                type="button"
                disabled={busy}
                onClick={refreshGuests}
                className={`${secondaryButton} mt-5`}
              >
                <RefreshCw size={15} /> Refresh guest details
              </button>
            )}

            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6">
              <button
                type="button"
                className={primaryButton}
                disabled={
                  busy ||
                  needsRefresh ||
                  Boolean(selected.checked_in_at) ||
                  Boolean(selected.entry_code)
                }
                onClick={() => review(selected.id, 'generate')}
              >
                <QrCode size={16} />
                {selected.entry_code ? 'Code generated' : 'Generate entry code'}
              </button>

              <button
                type="button"
                className={secondaryButton}
                disabled={busy || needsRefresh || Boolean(selected.checked_in_at)}
                onClick={() =>
                  review(selected.id, selected.paid ? 'unpaid' : 'paid')
                }
              >
                <CheckCircle2 size={16} />
                {selected.paid ? 'Mark unpaid' : 'Mark paid'}
              </button>

              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs font-bold text-red-200 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-35"
                disabled={
                  busy ||
                  needsRefresh ||
                  Boolean(selected.checked_in_at) ||
                  !selected.entry_code
                }
                onClick={() => review(selected.id, 'revoke')}
              >
                <Ban size={16} /> Revoke code
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  )
}