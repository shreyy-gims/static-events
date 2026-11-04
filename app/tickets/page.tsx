'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Navbar } from '@/components/navbar'
import { raatRequest } from '@/lib/raat-browser'
import type { EventSettings } from '@/lib/raat-types'

const MAX_PHOTO_SIZE = 5 * 1024 * 1024

const field =
  'mt-2 min-h-12 w-full border border-white/20 bg-[#11150F] px-4 py-3 text-base text-white outline-none focus:border-[#CEFF50]'

const label =
  'block text-xs font-bold uppercase tracking-wider text-white/65'

const button =
  'min-h-12 bg-[#CEFF50] px-6 py-4 text-sm font-black uppercase tracking-wider text-[#080A07] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40'

type Choice = {
  value: string
  text: string
}

function ChoiceButtons({
  title,
  name,
  options,
}: {
  title: string
  name: string
  options: Choice[]
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={label}>{title}</legend>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              required
              className="peer sr-only"
            />

            <span
              className="
                flex min-h-12 items-center justify-center border
                border-white/20 bg-[#080A07] px-4 py-3
                text-sm font-bold text-white/65 transition
                hover:border-[#CEFF50]/60 hover:text-white
                peer-checked:border-[#CEFF50]
                peer-checked:bg-[#CEFF50]
                peer-checked:text-[#080A07]
                peer-focus-visible:outline
                peer-focus-visible:outline-2
                peer-focus-visible:outline-offset-4
                peer-focus-visible:outline-[#CEFF50]
              "
            >
              {option.text}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default function TicketsPage() {
  const [settings, setSettings] = useState<EventSettings | null>(null)
  const [error, setError] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadSettings() {
    setLoading(true)
    setError('')

    try {
      const result = await raatRequest('settings')
      setSettings(result.settings)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load event details'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (busy) return

    setError('')

    if (!settings?.booking_open) {
      setError('Guest registrations are currently closed.')
      return
    }

    if (!photo || photoError) {
      setError('Please select one valid photo.')
      return
    }

    if (photo.size === 0 || photo.size > MAX_PHOTO_SIZE) {
      setError('Your photo must be nonempty and under 5 MB.')
      return
    }

    const form = new FormData(event.currentTarget)

    // Keep the existing API field name; send one file.
    form.append('photos', photo)

    setBusy(true)

    try {
      await raatRequest('register', {
        method: 'POST',
        body: form,
      })

      setDone(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Submission failed. Please try again.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080A07] text-[#F5F6EE] selection:bg-[#CEFF50] selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8">
        <p className="text-xs font-black uppercase tracking-[.22em] text-[#CEFF50]">
          STATIC PRESENTS / GUEST REGISTRATION
        </p>

        <h1 className="mt-5 text-5xl font-black uppercase leading-none tracking-[-.06em] sm:text-7xl">
          {settings?.title || 'Raat Baaki'}
        </h1>

        <p className="mt-5 text-sm leading-7 text-white/55">
          {settings
            ? `${settings.event_date} · ${settings.event_time} · ${settings.venue}`
            : 'Loading event details…'}
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 border border-red-400/50 bg-red-950/40 p-4 text-sm text-red-100"
          >
            {error}

            {!settings && (
              <button
                type="button"
                className="ml-4 underline"
                onClick={loadSettings}
              >
                Retry
              </button>
            )}
          </div>
        )}

        {done ? (
          <section
            aria-live="polite"
            className="mt-10 border border-[#CEFF50]/40 bg-[#11160F] p-7 sm:p-10"
          >
            <p className="text-xs font-black uppercase tracking-widest text-[#CEFF50]">
              DETAILS RECEIVED
            </p>

            <h2 className="mt-5 text-3xl font-black uppercase tracking-tight">
              Your details have been received.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">
              Your details and photo have been sent to the STATIC team.
              The organizer will manage payment and share your entry code
              directly. This confirmation is not an entry pass.
            </p>
          </section>
        ) : (
          <div className="mt-10 grid items-start gap-7 lg:grid-cols-[.7fr_1.3fr]">
            <aside className="border border-white/15 bg-[#11160F] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-widest text-[#CEFF50]">
                ONE NIGHT / ONE PASS
              </p>

              <h2 className="mt-5 text-3xl font-black uppercase tracking-tight">
                {settings?.ticket_name || 'Poolside Pass'}
              </h2>

              <p className="mt-5 text-4xl font-black text-[#CEFF50]">
                {settings
                  ? settings.price > 0
                    ? `₹${settings.price.toLocaleString('en-IN')}`
                    : 'Price TBA'
                  : '…'}
              </p>

              <p className="mt-6 whitespace-pre-line text-sm leading-7 text-white/60">
                {settings?.description}
              </p>

              <p className="mt-7 border-t border-white/15 pt-5 text-sm leading-7 text-white/50">
                Fill in your details below. Payment and entry codes are
                handled directly by the STATIC team.
              </p>
            </aside>

            <form
              onSubmit={submit}
              className="border border-white/15 bg-[#11160F] p-6 sm:p-8"
            >
              <fieldset disabled={busy} className="min-w-0">
                <legend className="text-2xl font-black uppercase tracking-tight">
                  Your details
                </legend>

                <div className="mt-7 grid gap-7 sm:grid-cols-2">
                  <label className={label}>
                    Full name
                    <input
                      className={field}
                      required
                      name="full_name"
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                    />
                  </label>

                  <label className={label}>
                    Phone number
                    <input
                      className={field}
                      required
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      autoComplete="tel-national"
                    />
                  </label>

                  <label className={`${label} sm:col-span-2`}>
                    Instagram username
                    <input
                      className={field}
                      required
                      name="instagram"
                      maxLength={31}
                      placeholder="@yourusername"
                      pattern="@?[a-zA-Z0-9._]{1,30}"
                    />
                  </label>

                  <ChoiceButtons
                    title="Drink preference"
                    name="drink"
                    options={[
                      { value: 'alcoholic', text: 'Alcoholic' },
                      { value: 'non-alcoholic', text: 'Non-alcoholic' },
                    ]}
                  />

                  <ChoiceButtons
                    title="Do you smoke?"
                    name="smoking"
                    options={[
                      { value: 'yes', text: 'Yes' },
                      { value: 'no', text: 'No' },
                    ]}
                  />

                  <ChoiceButtons
                    title="Single or mingle?"
                    name="relationship"
                    options={[
                      { value: 'single', text: 'Single' },
                      { value: 'mingle', text: 'Mingle' },
                      {
                        value: 'prefer-not-to-say',
                        text: 'Prefer not to say',
                      },
                    ]}
                  />

                  <ChoiceButtons
                    title="Open to being approached?"
                    name="approachable"
                    options={[
                      { value: 'yes', text: 'Yes' },
                      { value: 'no', text: 'No' },
                    ]}
                  />

                  <label className={`${label} sm:col-span-2`}>
                    How did you hear about us?
                    <input
                      className={field}
                      required
                      name="referral"
                      maxLength={300}
                      placeholder="Instagram, a friend, ambassador name…"
                    />
                  </label>

                  <div className="sm:col-span-2">
                    <label className={label} htmlFor="guest-photo">
                      Your best photo
                    </label>

                    <input
                      id="guest-photo"
                      className={`${field} text-sm`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      required
                      aria-invalid={Boolean(photoError)}
                      aria-describedby="photo-help photo-error"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null

                        setPhoto(null)
                        setPhotoError('')

                        if (!file) return

                        if (
                          !['image/jpeg', 'image/png', 'image/webp'].includes(
                            file.type
                          )
                        ) {
                          setPhotoError('Choose a JPEG, PNG or WebP photo.')
                          event.target.value = ''
                          return
                        }

                        if (
                          file.size === 0 ||
                          file.size > MAX_PHOTO_SIZE
                        ) {
                          setPhotoError(
                            'Your photo must be nonempty and under 5 MB.'
                          )
                          event.target.value = ''
                          return
                        }

                        setPhoto(file)
                      }}
                    />

                    <p
                      id="photo-help"
                      className="mt-3 text-xs leading-6 text-white/45"
                    >
                      One photo · JPEG, PNG or WebP · maximum 5 MB.
                      Private to the STATIC team.
                    </p>

                    {photo && (
                      <p className="mt-2 break-all text-xs text-[#CEFF50]">
                        Selected: {photo.name}
                      </p>
                    )}

                    <p
                      id="photo-error"
                      role={photoError ? 'alert' : undefined}
                      className="mt-2 text-xs text-red-300"
                    >
                      {photoError}
                    </p>
                  </div>
                </div>

                <label className="mt-7 flex items-start gap-3 text-xs leading-6 text-white/60">
                  <input
                    className="mt-1.5 accent-[#CEFF50]"
                    required
                    type="checkbox"
                    name="consent"
                    value="yes"
                  />
                  I agree to share these details and my photo privately with
                  STATIC for guest and entry management. Being open to an
                  approach does not replace consent at the event.
                </label>

                <button
                  type="submit"
                  className={`${button} mt-7 w-full`}
                  disabled={
                    busy ||
                    loading ||
                    !settings?.booking_open ||
                    !photo ||
                    Boolean(photoError)
                  }
                >
                  {busy
                    ? 'Sending…'
                    : loading
                      ? 'Loading…'
                      : !settings?.booking_open
                        ? 'Registrations closed'
                        : 'Send my details ↗'}
                </button>
              </fieldset>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}