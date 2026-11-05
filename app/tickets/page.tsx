'use client'

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'

import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  Moon,
  ShieldCheck,
  Sparkles,
  Ticket,
} from 'lucide-react'

import { Navbar } from '@/components/navbar'
import { raatRequest } from '@/lib/raat-browser'
import type { EventSettings } from '@/lib/raat-types'

const MAX_PHOTO_SIZE = 5 * 1024 * 1024

const field =
  'mt-3 min-h-14 w-full rounded-xl border border-white/15 bg-[#080A07] px-4 py-3 text-base text-white outline-none transition duration-200 placeholder:text-white/25 hover:border-white/30 focus:border-[#CEFF50] focus:ring-4 focus:ring-[#CEFF50]/10 disabled:opacity-50'

const label =
  'block text-[11px] font-bold uppercase tracking-[.12em] text-white/60'

const yesNo = [
  { value: 'yes', text: 'Yes' },
  { value: 'no', text: 'No' },
]

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
  const [selected, setSelected] = useState('')
  const reducedMotion = useReducedMotion()

  return (
    <fieldset className="min-w-0">
      <legend className={label}>{title}</legend>

      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((option) => {
          const active = selected === option.value

          return (
            <motion.label
              key={option.value}
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              className="relative cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={active}
                onChange={() => setSelected(option.value)}
                required
                className="peer sr-only"
              />

              <span
                className={`
                  relative flex min-h-12 items-center justify-center
                  gap-2 rounded-xl border px-5 py-3 text-sm font-bold
                  transition duration-200
                  peer-focus-visible:outline peer-focus-visible:outline-2
                  peer-focus-visible:outline-offset-4
                  peer-focus-visible:outline-[#CEFF50]
                  peer-disabled:cursor-not-allowed peer-disabled:opacity-50
                  ${
                    active
                      ? 'border-[#CEFF50] bg-[#CEFF50] text-[#080A07] shadow-[0_0_24px_rgba(206,255,80,.15)]'
                      : 'border-white/15 bg-[#080A07] text-white/60 hover:border-[#CEFF50]/50 hover:text-white'
                  }
                `}
              >
                <span>{option.text}</span>

                {active && (
                  <motion.span
                    aria-hidden="true"
                    initial={reducedMotion ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check size={15} strokeWidth={3} />
                  </motion.span>
                )}
              </span>
            </motion.label>
          )
        })}
      </div>
    </fieldset>
  )
}

function NightStayNotice() {
  return (
    <div className="rounded-xl border border-[#CEFF50]/20 bg-[#CEFF50]/5 p-4">
      <div className="flex items-start gap-3">
        <Moon
          size={19}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[#CEFF50]"
        />

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#CEFF50]">
            Night stay is charged separately
          </p>

          <p className="mt-2 text-xs leading-6 text-white/55">
            Overnight accommodation is not included in the event pass.
            Contact STATIC for availability and charges. Selecting Yes
            does not confirm accommodation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TicketsPage() {
  const reducedMotion = useReducedMotion()
  const submissionLock = useRef(false)

  const [settings, setSettings] = useState<EventSettings | null>(null)
  const [error, setError] = useState('')
  const [photoError, setPhotoError] = useState('')

  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)

  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

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
          : 'Unable to load event details.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  useEffect(() => {
    if (!photo) {
      setPreview('')
      return
    }

    const url = URL.createObjectURL(photo)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [photo])

  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    // Cancelling the picker leaves an existing selection intact.
    if (!file) return

    setPhoto(null)
    setPhotoError('')

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError('Choose a JPEG, PNG or WebP photo.')
      event.target.value = ''
      return
    }

    if (file.size === 0 || file.size > MAX_PHOTO_SIZE) {
      setPhotoError('Your photo must be nonempty and under 5 MB.')
      event.target.value = ''
      return
    }

    setPhoto(file)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submissionLock.current) return

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
    form.append('photos', photo)

    submissionLock.current = true
    setBusy(true)

    try {
      await raatRequest('register', {
        method: 'POST',
        body: form,
      })

      setDone(true)
      setPhoto(null)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Submission failed. Please try again.'
      )
    } finally {
      submissionLock.current = false
      setBusy(false)
    }
  }

  const registrationLabel = loading
    ? 'Loading event'
    : !settings
      ? 'Event details unavailable'
      : settings.booking_open
        ? 'Guest registration open'
        : 'Guest registration closed'

  const submitLabel = busy
    ? 'Sending your details…'
    : loading
      ? 'Loading event…'
      : !settings
        ? 'Event unavailable'
        : !settings.booking_open
          ? 'Registrations closed'
          : 'Send my details'

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-[#080A07] text-[#F5F6EE] selection:bg-[#CEFF50] selection:text-black">
      <Navbar />

      <style>{`
        .static-registration-grid {
          background-image:
            linear-gradient(rgba(206,255,80,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(206,255,80,.035) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, black, transparent);
          -webkit-mask-image: linear-gradient(to bottom, black, transparent);
        }

        .static-submit-shine {
          transform: translateX(-160%) skewX(-20deg);
        }

        .static-submit:hover:not(:disabled) .static-submit-shine {
          transform: translateX(220%) skewX(-20deg);
          transition: transform .8s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .static-submit-shine {
            display: none;
          }
        }
      `}</style>

      {/* Background effects */}
      <div
        aria-hidden="true"
        className="static-registration-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[850px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 -z-10 h-[450px] w-[450px] rounded-full bg-[#CEFF50]/[.07] blur-[110px]"
      />

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
        {/* Heading */}
        <motion.header
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-5">
            <p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.22em] text-[#CEFF50] sm:text-xs">
              <Sparkles size={16} aria-hidden="true" />
              STATIC PRESENTS / YOUR INVITATION
            </p>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.03] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white/60">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  settings?.booking_open
                    ? 'bg-[#CEFF50]'
                    : 'bg-white/35'
                }`}
              />
              {registrationLabel}
            </span>
          </div>

          <h1 className="mt-7 break-words text-[clamp(3.4rem,8vw,7rem)] font-black uppercase leading-[.95] tracking-[-.065em]">
            {settings?.title || 'Raat Baaki'}
            <span className="text-[#CEFF50]">✳</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
            Your festive fit. Your favorite people. One more evening
            worth remembering.
          </p>

          {settings && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/65">
              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  size={15}
                  aria-hidden="true"
                  className="text-[#CEFF50]"
                />
                {settings.event_date} · {settings.event_time}
              </span>

              <span className="inline-flex items-center gap-2">
                <MapPin
                  size={15}
                  aria-hidden="true"
                  className="text-[#CEFF50]"
                />
                {settings.venue}
              </span>
            </div>
          )}
        </motion.header>

        {/* Settings error */}
        {!settings && error && (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-400/30 bg-red-950/30 p-5 text-sm text-red-100"
          >
            <p>{error}</p>

            <button
              type="button"
              disabled={loading}
              onClick={loadSettings}
              className="mt-3 font-bold underline underline-offset-4 disabled:opacity-50"
            >
              {loading ? 'Retrying…' : 'Retry loading event'}
            </button>
          </div>
        )}

        {done ? (
          <motion.section
            initial={
              reducedMotion ? false : { opacity: 0, y: 25, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55 }}
            aria-live="polite"
            className="mt-12 rounded-2xl border border-[#CEFF50]/30 bg-[#11160F] p-7 sm:p-12"
          >
            <motion.div
              initial={reducedMotion ? false : { scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#CEFF50] text-[#080A07]"
            >
              <CheckCircle2 size={32} aria-hidden="true" />
            </motion.div>

            <p className="text-xs font-black uppercase tracking-[.2em] text-[#CEFF50]">
              DETAILS RECEIVED
            </p>

            <h2 className="mt-5 text-3xl font-black uppercase tracking-tight sm:text-5xl">
              You did your part.
              <br />
              We’ll take it from here.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-8 text-white/60">
              Your details and photo have been sent to the STATIC team.
              The organizer will manage payment and share your entry
              code directly. This confirmation is not an entry pass.
            </p>

            <div className="mt-8 max-w-xl">
              <NightStayNotice />
            </div>
          </motion.section>
        ) : (
          <div className="mt-12 grid items-start gap-7 lg:grid-cols-[.7fr_1.3fr]">
            {/* Pass information */}
            <motion.aside
              initial={reducedMotion ? false : { opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="overflow-hidden rounded-2xl border border-white/15 bg-[#11160F] lg:sticky lg:top-28"
            >
              <div className="relative overflow-hidden p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#CEFF50]/15"
                />

                <div className="relative flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#CEFF50]">
                    ONE NIGHT / ONE PASS
                  </p>

                  <Ticket
                    size={23}
                    aria-hidden="true"
                    className="text-[#CEFF50]"
                  />
                </div>

                <h2 className="mt-7 text-3xl font-black uppercase tracking-tight">
                  {settings?.ticket_name || 'Poolside Pass'}
                </h2>

                <p className="mt-5 text-5xl font-black tracking-tight text-[#CEFF50]">
                  {settings
                    ? settings.price > 0
                      ? `₹${settings.price.toLocaleString('en-IN')}`
                      : 'Price TBA'
                    : '…'}
                </p>

                <p className="mt-6 whitespace-pre-line text-sm leading-8 text-white/55">
                  {settings?.description}
                </p>
              </div>

              <div className="border-t border-dashed border-white/20 p-6 sm:p-8">
                <NightStayNotice />

                <div className="mt-7 space-y-5">
                  {[
                    ['01', 'Fill in your details'],
                    ['02', 'The team reviews your registration'],
                    ['03', 'Arrange payment and receive your code'],
                  ].map(([number, text]) => (
                    <div key={number} className="flex items-start gap-3">
                      <span className="mt-0.5 text-[10px] font-black text-[#CEFF50]">
                        {number}
                      </span>
                      <p className="text-xs leading-6 text-white/55">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>

            {/* Guest form */}
            <motion.form
              onSubmit={submit}
              aria-busy={busy}
              initial={reducedMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="rounded-2xl border border-white/15 bg-[#11160F] p-6 sm:p-9"
            >
              <fieldset disabled={busy} className="min-w-0">
                <legend className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
                  Make it your night.
                </legend>

                <p className="mt-3 text-xs leading-6 text-white/45">
                  A few details so the team can manage your registration.
                  No account needed.
                </p>

                <div className="mt-8 grid gap-x-5 gap-y-7 sm:grid-cols-2">
                  <label className={label}>
                    Full name
                    <input
                      className={field}
                      required
                      name="full_name"
                      minLength={2}
                      maxLength={100}
                      placeholder="Your full name"
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
                      autoCapitalize="none"
                      spellCheck={false}
                    />
                  </label>

                  <div className="border-t border-white/10 pt-7 sm:col-span-2">
                    <p className="mb-6 text-[10px] font-black uppercase tracking-[.2em] text-[#CEFF50]">
                      YOUR EVENING / YOUR PREFERENCES
                    </p>

                    <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">
                      <ChoiceButtons
                        title="Drink preference"
                        name="drink"
                        options={[
                          { value: 'alcoholic', text: 'Alcoholic' },
                          {
                            value: 'non-alcoholic',
                            text: 'Non-alcoholic',
                          },
                        ]}
                      />

                      <ChoiceButtons
                        title="Do you smoke?"
                        name="smoking"
                        options={yesNo}
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
                        options={yesNo}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#080A07]/70 p-5 sm:col-span-2">
                    <ChoiceButtons
                      title="Can you stay overnight?"
                      name="night_stay"
                      options={yesNo}
                    />

                    <p className="mt-4 text-xs leading-6 text-white/45">
                      Night-stay charges are not included in the pass
                      and must be paid separately. Selecting Yes does
                      not reserve accommodation.
                    </p>
                  </div>

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

                  {/* One photo upload */}
                  <div className="sm:col-span-2">
                    <p id="photo-label" className={label}>
                      Your best photo
                    </p>

                    <label
                      htmlFor="guest-photo"
                      className={`relative mt-3 flex min-h-44 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed p-5 transition duration-200 focus-within:ring-4 focus-within:ring-[#CEFF50]/10 ${
                        photoError
                          ? 'border-red-400/60 bg-red-950/10'
                          : 'border-white/20 bg-[#080A07] hover:border-[#CEFF50]/60 hover:bg-[#CEFF50]/[.03] focus-within:border-[#CEFF50]'
                      }`}
                    >
                      <input
                        id="guest-photo"
                        className="peer sr-only"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        required
                        aria-labelledby="photo-label"
                        aria-invalid={Boolean(photoError)}
                        aria-describedby="photo-help photo-error"
                        onChange={selectPhoto}
                      />

                      {preview && photo ? (
                        <div className="flex w-full flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                          <img
                            src={preview}
                            alt="Your selected guest photo"
                            className="h-24 w-24 shrink-0 rounded-xl object-cover"
                          />

                          <div className="min-w-0">
                            <p className="flex items-center justify-center gap-2 text-xs font-bold text-[#CEFF50] sm:justify-start">
                              <CheckCircle2 size={16} aria-hidden="true" />
                              Photo selected
                            </p>

                            <p className="mt-2 break-all text-sm text-white/70">
                              {photo.name}
                            </p>

                            <p className="mt-2 text-xs text-white/40">
                              Tap to choose a different photo
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#CEFF50]/25 bg-[#CEFF50]/5 text-[#CEFF50]">
                            <ImagePlus size={22} aria-hidden="true" />
                          </div>

                          <p className="text-sm font-bold text-white/80">
                            Tap to select your photo
                          </p>

                          <p className="mt-2 text-xs text-white/40">
                            Choose one clear photo
                          </p>
                        </div>
                      )}
                    </label>

                    <p
                      id="photo-help"
                      className="mt-3 text-xs leading-6 text-white/40"
                    >
                      One photo · JPEG, PNG or WebP · maximum 5 MB.
                      Private to the STATIC team.
                    </p>

                    <p
                      id="photo-error"
                      role={photoError ? 'alert' : undefined}
                      className="mt-2 text-xs text-red-300"
                    >
                      {photoError}
                    </p>
                  </div>
                </div>

                {/* Consent */}
                <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[.02] p-4 text-xs leading-6 text-white/55">
                  <input
                    className="mt-1 h-4 w-4 shrink-0 accent-[#CEFF50]"
                    required
                    type="checkbox"
                    name="consent"
                    value="yes"
                  />
                  <span>
                    I agree to share these details and my photo privately
                    with STATIC for guest and entry management. Being
                    open to an approach does not replace consent at the
                    event.
                  </span>
                </label>

                {settings && error && (
                  <p
                    role="alert"
                    className="mt-5 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm leading-6 text-red-100"
                  >
                    {error}
                  </p>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileTap={
                    reducedMotion || busy ? undefined : { scale: 0.985 }
                  }
                  disabled={
                    busy ||
                    loading ||
                    !settings?.booking_open ||
                    !photo ||
                    Boolean(photoError)
                  }
                  className="static-submit group relative mt-7 flex min-h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#CEFF50] px-6 py-4 text-sm font-black uppercase tracking-[.1em] text-[#080A07] transition duration-200 hover:shadow-[0_0_35px_rgba(206,255,80,.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CEFF50] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  <span
                    aria-hidden="true"
                    className="static-submit-shine pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                  />

                  {busy ? (
                    <Loader2
                      size={19}
                      aria-hidden="true"
                      className="relative animate-spin motion-reduce:animate-none"
                    />
                  ) : (
                    <Ticket
                      size={19}
                      aria-hidden="true"
                      className="relative"
                    />
                  )}

                  <span className="relative" aria-live="polite">
                    {submitLabel}
                  </span>

                  {!busy && (
                    <ArrowUpRight
                      size={20}
                      aria-hidden="true"
                      className="relative shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    />
                  )}
                </motion.button>

                <p className="mt-5 flex items-center justify-center gap-2 text-center text-[10px] leading-5 text-white/35">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Your details are shared privately with the STATIC team.
                </p>
              </fieldset>
            </motion.form>
          </div>
        )}

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] font-bold uppercase tracking-[.14em] text-white/30">
          <span>STATIC / MUSIC. CULTURE. EXPERIENCES.</span>
          <span>© {new Date().getFullYear()} STATIC</span>
        </footer>
      </div>
    </main>
  )
}