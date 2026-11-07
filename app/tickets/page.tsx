'use client'

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  Moon,
  Sparkles,
  Ticket,
  Trees,
  Waves,
} from 'lucide-react'

import { Navbar } from '@/components/navbar'
import { raatRequest } from '@/lib/raat-browser'
import type { EventSettings } from '@/lib/raat-types'

const PASS_PRICE = 1200
const MAX_PHOTO_SIZE = 5 * 1024 * 1024

const field =
  'mt-2 min-h-14 w-full rounded-2xl border border-white/15 bg-[#080A07] px-4 py-3 text-base text-white outline-none placeholder:text-white/30 focus:border-[#CEFF50] focus:ring-4 focus:ring-[#CEFF50]/10 disabled:opacity-50'

const label = 'block text-sm font-medium text-white/80'

const yesNo = [
  { value: 'yes', text: 'Yes' },
  { value: 'no', text: 'No' },
]

type Choice = {
  value: string
  text: string
}

type ChoiceName =
  | 'drink'
  | 'smoking'
  | 'relationship'
  | 'approachable'
  | 'night_stay'

type Choices = Record<ChoiceName, string>

const initialChoices: Choices = {
  drink: '',
  smoking: '',
  relationship: '',
  approachable: '',
  night_stay: '',
}

const stepLabels = ['Your details', 'Preferences', 'Photo & finish']

function ChoiceButtons({
  title,
  name,
  options,
  value,
  onChange,
}: {
  title: string
  name: ChoiceName
  options: Choice[]
  value: string
  onChange: (name: ChoiceName, value: string) => void
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={label}>{title}</legend>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option, index) => {
          const selected = value === option.value

          return (
            <label
              key={option.value}
              className={
                options.length === 3 && index === 2
                  ? 'relative col-span-2 cursor-pointer'
                  : 'relative cursor-pointer'
              }
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(name, option.value)}
                required
                className="peer sr-only"
              />

              <span
                className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-center text-sm font-semibold transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#CEFF50] ${
                  selected
                    ? 'border-[#CEFF50] bg-[#CEFF50] text-[#080A07]'
                    : 'border-white/15 bg-[#080A07] text-white/70 hover:border-white/35'
                }`}
              >
                {option.text}
                {selected && <Check size={16} aria-hidden="true" />}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function NightStayNotice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4">
      <Moon
        size={19}
        className="mt-0.5 shrink-0 text-[#CEFF50]"
        aria-hidden="true"
      />

      <div>
        <p className="text-sm font-semibold text-white">
          Staying overnight?
        </p>
        <p className="mt-1 text-xs leading-6 text-white/55">
          Accommodation costs extra and depends on availability.
          Selecting Yes does not reserve a room.
        </p>
      </div>
    </div>
  )
}

export default function TicketsPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const formHeadingRef = useRef<HTMLHeadingElement>(null)
  const submissionLock = useRef(false)

  const [settings, setSettings] = useState<EventSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [step, setStep] = useState(0)

  const [error, setError] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [choices, setChoices] = useState<Choices>(initialChoices)

  async function loadSettings() {
    setLoading(true)
    setError('')

    try {
      const result = await raatRequest('settings')
      setSettings(result.settings)
    } catch (caught: unknown) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to load the event. Please try again.'
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

  function updateChoice(name: ChoiceName, value: string) {
    setChoices((previous) => ({
      ...previous,
      [name]: value,
    }))
    setError('')
  }

  function moveTo(nextStep: number) {
    setError('')
    setStep(nextStep)

    requestAnimationFrame(() => {
      formHeadingRef.current?.focus({ preventScroll: true })
      formHeadingRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
          .matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      })
    })
  }

  function validateStep(index: number) {
    const section =
      formRef.current?.querySelector<HTMLElement>(
        `[data-form-step="${index}"]`
      )

    if (!section) return false

    const inputs = section.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >('input, select, textarea')

    for (const input of inputs) {
      if (!input.checkValidity()) {
        input.reportValidity()
        return false
      }
    }

    return true
  }

  function selectPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    setPhoto(null)
    setPhotoError('')

    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    ) {
      setPhotoError('Choose a JPG, PNG or WebP photo.')
      event.target.value = ''
      return
    }

    if (file.size === 0 || file.size > MAX_PHOTO_SIZE) {
      setPhotoError('Choose a photo smaller than 5 MB.')
      event.target.value = ''
      return
    }

    setPhoto(file)
    setError('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submissionLock.current) return

    if (step < 2) {
      if (validateStep(step)) moveTo(step + 1)
      return
    }

    setError('')

    if (!settings?.booking_open) {
      setError('Guest registrations are currently closed.')
      return
    }

    // Check every step again before sending.
    for (let index = 0; index < 2; index += 1) {
      const section = formRef.current?.querySelector<HTMLElement>(
        `[data-form-step="${index}"]`
      )

      const inputs = section?.querySelectorAll<HTMLInputElement>('input')
      const invalid = inputs
        ? Array.from(inputs).find((input) => !input.checkValidity())
        : undefined

      if (invalid) {
        moveTo(index)

        requestAnimationFrame(() => {
          invalid.reportValidity()
        })

        return
      }
    }

    if (!validateStep(2)) return

    if (!photo || photoError) {
      setError('Please choose one valid photo before continuing.')
      return
    }

    if (photo.size === 0 || photo.size > MAX_PHOTO_SIZE) {
      setError('Your photo must be smaller than 5 MB.')
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

      window.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    } catch (caught: unknown) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Could not send your details. Please try again.'
      )
    } finally {
      submissionLock.current = false
      setBusy(false)
    }
  }

  const available = Boolean(settings?.booking_open)
  const disabled = busy || loading || !available

  return (
    <main className="min-h-svh overflow-x-hidden bg-[#080A07] text-[#F5F6EE] selection:bg-[#CEFF50] selection:text-black">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 pb-12 pt-28 sm:px-6 sm:pt-36">
        <header>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#CEFF50]">
            <Sparkles size={15} aria-hidden="true" />
            STATIC presents
          </p>

          <h1 className="mt-4 text-5xl font-black uppercase leading-none tracking-[-.06em] sm:text-7xl">
            {settings?.title || 'Raat Baaki'}
            <span className="text-[#CEFF50]">.</span>
          </h1>

          <p className="mt-4 max-w-lg text-base leading-7 text-white/60">
            Poolside scenes. Open-air lawn. Your favourite people.
            A night that feels anything but ordinary.
          </p>

          {settings && (
            <div className="mt-5 space-y-2 text-sm text-white/65 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:space-y-0">
              <p className="flex items-start gap-2">
                <CalendarDays
                  size={17}
                  className="mt-0.5 shrink-0 text-[#CEFF50]"
                  aria-hidden="true"
                />
                <span>
                  {settings.event_date} · {settings.event_time}
                </span>
              </p>

              <p className="flex items-start gap-2">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#CEFF50]"
                  aria-hidden="true"
                />
                <span>{settings.venue || 'Venue to be revealed'}</span>
              </p>
            </div>
          )}
        </header>

        {!settings && error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void loadSettings()}
              disabled={loading}
              className="mt-3 min-h-11 font-semibold underline underline-offset-4 disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Try again'}
            </button>
          </div>
        )}

        {done ? (
          <section
            aria-live="polite"
            className="mt-8 rounded-3xl border border-[#CEFF50]/25 bg-[#11160F] p-6 sm:p-10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#CEFF50] text-black">
              <CheckCircle2 size={28} aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight">
              You’re on our radar.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-7 text-white/65">
              Your registration has reached STATIC. The team will contact
              you to arrange the ₹1,200 pass payment and share your entry
              code after confirmation.
            </p>

            <p className="mt-3 text-sm font-medium text-[#CEFF50]">
              Registration alone is not an entry pass.
            </p>

            <div className="mt-6 max-w-lg">
              <NightStayNotice />
            </div>
          </section>
        ) : (
          <div className="mt-7 grid items-start gap-5 lg:grid-cols-[.85fr_1.15fr]">
            <aside className="rounded-3xl border border-white/10 bg-[#11160F] lg:sticky lg:top-28">
              <div className="p-5 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-[#CEFF50]/25 bg-[#CEFF50]/10 px-3 py-1.5 text-xs font-semibold text-[#CEFF50]">
                    Poolside + lawn
                  </span>
                  <Ticket
                    size={23}
                    className="text-[#CEFF50]"
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {settings?.ticket_name || 'Poolside Pass'}
                    </h2>
                    <p className="mt-1 text-sm text-white/45">
                      One person · Event entry
                    </p>
                  </div>

                  <p className="shrink-0 text-4xl font-black tracking-tight text-[#CEFF50]">
                    ₹{PASS_PRICE.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-[#080A07] p-4">
                    <Waves
                      size={23}
                      className="text-[#CEFF50]"
                      aria-hidden="true"
                    />
                    <h3 className="mt-3 text-sm font-semibold">
                      Poolside atmosphere
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-white/50">
                      Step out of the usual party setting.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#080A07] p-4">
                    <Trees
                      size={23}
                      className="text-[#CEFF50]"
                      aria-hidden="true"
                    />
                    <h3 className="mt-3 text-sm font-semibold">
                      Open-air lawn
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-white/50">
                      Space to hang out with your people.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[#CEFF50] p-4 text-[#080A07]">
                  <p className="text-base font-black">
                    Dress up. Show up. Make a memory.
                  </p>
                  <p className="mt-1 text-sm leading-6">
                    A fresh setting, festive energy and one crazy evening
                    with STATIC.
                  </p>
                </div>

                <p className="mt-4 text-xs leading-6 text-white/45">
                  Poolside access does not automatically include swimming.
                  Food, drinks and any other inclusions must be confirmed
                  with STATIC before payment.
                </p>

                <a
                  href="#registration"
                  className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 text-sm font-semibold transition hover:bg-white/5 lg:hidden"
                >
                  Fill my details
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>

              <div className="border-t border-white/10 p-5 sm:p-7">
                <NightStayNotice />

                <p className="mt-4 text-xs leading-6 text-white/45">
                  Fill the form → Hear from STATIC → Arrange payment →
                  Receive your entry code.
                </p>
              </div>
            </aside>

            <section
              id="registration"
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-[#11160F] p-5 sm:p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#CEFF50]">
                  Guest registration
                </p>

                <span
                  role="status"
                  className="text-xs text-white/50"
                >
                  {loading
                    ? 'Loading…'
                    : !settings
                      ? 'Unavailable'
                      : available
                        ? 'Open now'
                        : 'Closed'}
                </span>
              </div>

              <div
                className="mt-5 grid grid-cols-3 gap-2"
                aria-label={`Step ${step + 1} of 3`}
              >
                {stepLabels.map((text, index) => (
                  <div key={text}>
                    <div
                      className={`h-1.5 rounded-full ${
                        index <= step ? 'bg-[#CEFF50]' : 'bg-white/10'
                      }`}
                    />
                    <p
                      className={`mt-2 text-[11px] ${
                        index === step ? 'text-white' : 'text-white/40'
                      }`}
                      aria-current={index === step ? 'step' : undefined}
                    >
                      {index + 1}. {text}
                    </p>
                  </div>
                ))}
              </div>

              <h2
                ref={formHeadingRef}
                tabIndex={-1}
                className="mt-7 scroll-mt-28 text-2xl font-bold tracking-tight outline-none"
              >
                {step === 0
                  ? 'Let’s start with you.'
                  : step === 1
                    ? 'Make it your kind of night.'
                    : 'One photo. Then you’re done.'}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/50">
                {step === 0
                  ? 'No account needed. All fields below are required.'
                  : step === 1
                    ? 'Choose one answer for each question.'
                    : 'Add a clear photo and review the confirmations.'}
              </p>

              <form
                ref={formRef}
                onSubmit={submit}
                noValidate
                aria-busy={busy}
                className="mt-6"
              >
                <fieldset disabled={busy} className="min-w-0">
                  {/* Keep steps mounted so FormData retains every field. */}
                  <div
                    data-form-step="0"
                    hidden={step !== 0}
                    className="space-y-5"
                  >
                    <label className={label}>
                      Full name
                      <input
                        className={field}
                        name="full_name"
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                        placeholder="Your full name"
                      />
                    </label>

                    <label className={label}>
                      Mobile number
                      <input
                        className={field}
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        required
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        autoComplete="tel-national"
                        placeholder="10-digit mobile number"
                        title="Enter a valid 10-digit Indian mobile number."
                      />
                    </label>

                    <label className={label}>
                      Instagram username
                      <input
                        className={field}
                        name="instagram"
                        required
                        maxLength={31}
                        pattern="@?[a-zA-Z0-9._]{1,30}"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="@yourusername"
                        title="Enter your Instagram username, not a profile link."
                      />
                    </label>

                    <label className={label}>
                      How did you hear about us?
                      <input
                        className={field}
                        name="referral"
                        required
                        maxLength={300}
                        placeholder="Instagram, a friend or ambassador name"
                      />
                    </label>
                  </div>

                  <div
                    data-form-step="1"
                    hidden={step !== 1}
                    className="space-y-6"
                  >
                    <ChoiceButtons
                      title="Drink preference"
                      name="drink"
                      options={[
                        { value: 'alcoholic', text: 'Alcoholic' },
                        { value: 'non-alcoholic', text: 'Non-alcoholic' },
                      ]}
                      value={choices.drink}
                      onChange={updateChoice}
                    />

                    <p className="!mt-2 text-xs leading-5 text-white/45">
                      A preference only—not a promise of included drinks.
                      Availability and applicable age restrictions apply.
                    </p>

                    <ChoiceButtons
                      title="Do you smoke?"
                      name="smoking"
                      options={yesNo}
                      value={choices.smoking}
                      onChange={updateChoice}
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
                      value={choices.relationship}
                      onChange={updateChoice}
                    />

                    <ChoiceButtons
                      title="Open to being approached?"
                      name="approachable"
                      options={yesNo}
                      value={choices.approachable}
                      onChange={updateChoice}
                    />

                    <ChoiceButtons
                      title="Interested in staying overnight?"
                      name="night_stay"
                      options={yesNo}
                      value={choices.night_stay}
                      onChange={updateChoice}
                    />

                    <NightStayNotice />
                  </div>

                  <div
                    data-form-step="2"
                    hidden={step !== 2}
                    className="space-y-5"
                  >
                    <div>
                      <p id="photo-label" className={label}>
                        Your photo
                      </p>

                      <label
                        htmlFor="guest-photo"
                        className={`mt-3 flex min-h-40 cursor-pointer items-center justify-center rounded-2xl border border-dashed bg-[#080A07] p-5 focus-within:ring-4 focus-within:ring-[#CEFF50]/15 ${
                          photoError
                            ? 'border-red-400/60'
                            : 'border-white/25 hover:border-[#CEFF50]/60'
                        }`}
                      >
                        <input
                          id="guest-photo"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={selectPhoto}
                          className="sr-only"
                          required
                          aria-labelledby="photo-label"
                          aria-describedby="photo-help photo-error"
                          aria-invalid={Boolean(photoError)}
                        />

                        {preview && photo ? (
                          <div className="flex w-full items-center gap-4">
                            <img
                              src={preview}
                              alt="Selected guest photo"
                              className="h-20 w-20 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 text-sm font-semibold text-[#CEFF50]">
                                <CheckCircle2
                                  size={17}
                                  aria-hidden="true"
                                />
                                Photo ready
                              </p>
                              <p className="mt-1 truncate text-xs text-white/50">
                                {photo.name}
                              </p>
                              <p className="mt-2 text-xs text-white/65">
                                Tap to change
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <ImagePlus
                              size={28}
                              className="mx-auto text-[#CEFF50]"
                              aria-hidden="true"
                            />
                            <p className="mt-3 text-sm font-semibold">
                              Tap to choose a photo
                            </p>
                            <p className="mt-1 text-xs text-white/45">
                              Select from your gallery
                            </p>
                          </div>
                        )}
                      </label>

                      <p
                        id="photo-help"
                        className="mt-2 text-xs leading-6 text-white/45"
                      >
                        JPG, PNG or WebP · Up to 5 MB · Shared with STATIC
                        for guest management.
                      </p>

                      <p
                        id="photo-error"
                        role={photoError ? 'alert' : undefined}
                        className="mt-1 text-sm text-red-300"
                      >
                        {photoError}
                      </p>
                    </div>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 p-4 text-sm leading-6 text-white/65">
                      <input
                        required
                        type="checkbox"
                        name="rules_accepted"
                        value="yes"
                        className="mt-1 h-5 w-5 shrink-0 accent-[#CEFF50]"
                      />
                      <span>
                        I am at least 18 and have read the{' '}
                        <a
                          href="/rules"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#CEFF50] underline underline-offset-4"
                        >
                          event rules and booking conditions
                        </a>
                        . Registration does not confirm entry. Overnight
                        accommodation is charged separately.
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 p-4 text-sm leading-6 text-white/65">
                      <input
                        required
                        type="checkbox"
                        name="consent"
                        value="yes"
                        className="mt-1 h-5 w-5 shrink-0 accent-[#CEFF50]"
                      />
                      <span>
                        I agree to share these details and my photo with
                        STATIC for guest and entry management. My
                        preferences do not replace consent at the event.
                      </span>
                    </label>

                    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 p-4">
                      <div>
                        <p className="text-sm font-semibold">
                          One event pass
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          Payment arranged with STATIC
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-[#CEFF50]">
                        ₹1,200
                      </p>
                    </div>
                  </div>

                  {error && settings && (
                    <p
                      role="alert"
                      className="mt-5 rounded-2xl border border-red-400/30 bg-red-950/30 p-4 text-sm leading-6 text-red-100"
                    >
                      {error}
                    </p>
                  )}

                  <div className="mt-7 flex gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => moveTo(step - 1)}
                        disabled={busy}
                        className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 text-sm font-semibold disabled:opacity-50"
                      >
                        <ArrowLeft size={17} aria-hidden="true" />
                        Back
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={disabled}
                      className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#CEFF50] px-4 py-3 text-base font-bold text-[#080A07] transition hover:bg-[#dcff85] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CEFF50] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {busy ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                            aria-hidden="true"
                          />
                          Sending…
                        </>
                      ) : loading ? (
                        'Loading…'
                      ) : !settings ? (
                        'Event unavailable'
                      ) : !available ? (
                        'Registrations closed'
                      ) : step < 2 ? (
                        <>
                          Continue
                          <ArrowRight size={18} aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          Send my registration
                          <Check size={18} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-4 text-center text-xs leading-6 text-white/40">
                    {step < 2
                      ? 'Your answers stay here when you go back.'
                      : 'No online payment is taken through this form.'}
                  </p>
                </fieldset>
              </form>
            </section>
          </div>
        )}

        <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs leading-6 text-white/35">
          STATIC · Music. Culture. Experiences.
          <br />
          © {new Date().getFullYear()} STATIC
        </footer>
      </div>
    </main>
  )
}