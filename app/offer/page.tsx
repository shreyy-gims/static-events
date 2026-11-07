'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Loader2, RotateCw, Users } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import {
  OFFER_DISCOUNTS,
  type OfferResult,
} from '@/lib/offer-types'

const field =
  'min-h-12 w-full rounded-xl border border-white/15 bg-[#080A07] px-4 py-3 text-base text-white outline-none transition placeholder:text-white/25 focus:border-[#CEFF50] disabled:opacity-60'

const button =
  'inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-[#CEFF50] px-7 py-4 text-xs font-black uppercase tracking-wider text-[#080A07] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40'

const STORAGE_KEY = 'static-group-offer-request-v1'

const wheelColors = [
  '#CEFF50', '#87AB37', '#E4FFAD', '#9AC13E', '#D5F982', '#789B2B',
]

function wheelSegments(odds: number[]) {
  return OFFER_DISCOUNTS
    .map((discount, index) => ({ discount, odds: odds[index] ?? 0 }))
    .filter(segment => segment.odds > 0)
}

function money(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

export default function OfferPage() {
  const reduceMotion = useReducedMotion()
  const lock = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useRef(false)

  const [config, setConfig] = useState<{
    base_price: number
    enabled: boolean
    odds: number[]
  } | null>(null)

  const [requestKey, setRequestKey] = useState('')
  const [promoter, setPromoter] = useState('')
  const [phone, setPhone] = useState('')
  const [names, setNames] = useState<string[]>(Array(10).fill(''))
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<OfferResult | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    mounted.current = true

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const valid =
        stored &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          stored,
        )

      const key = valid ? stored : crypto.randomUUID()
      localStorage.setItem(STORAGE_KEY, key)
      setRequestKey(key)
    } catch {
      setRequestKey(crypto.randomUUID())
    }

    return () => {
      mounted.current = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  async function loadConfig() {
    setError('')

    try {
      const response = await fetch('/api/raat-offers?action=config', {
        cache: 'no-store',
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Unable to load offers.')
      if (mounted.current) setConfig(data)
    } catch (error) {
      if (mounted.current) {
        setError(error instanceof Error ? error.message : 'Unable to load offers.')
      }
    }
  }

  useEffect(() => {
    void loadConfig()
  }, [])

  function finishReveal() {
    if (!mounted.current) return

    if (timer.current) clearTimeout(timer.current)
    setRevealed(true)
    setBusy(false)
    lock.current = false
  }

  async function spin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (lock.current || result || !requestKey || !config?.enabled) return

    lock.current = true
    setBusy(true)
    setError('')

    try {
      const response = await fetch('/api/raat-offers?action=spin', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_key: requestKey,
          promoter_name: promoter,
          promoter_phone: phone,
          guest_names: names,
          consent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to save your group offer.')
      }

      const saved = data.result as OfferResult
      if (!mounted.current) return

      const odds: number[] = data.odds
      const spinSegments = wheelSegments(odds)
      const index = spinSegments.findIndex(segment => segment.discount === saved.discount)

      setConfig(current => current ? { ...current, odds } : current)
      setResult(saved)

      if (reduceMotion || index < 0) {
        // An existing offer may have won a prize that has since been disabled.
        finishReveal()
      } else {
        const winningAngle = (index + 0.5) * (360 / spinSegments.length)
        setRotation(2160 - winningAngle)
        timer.current = setTimeout(finishReveal, 5600)
      }
    } catch (error) {
      if (!mounted.current) return

      setError(
        error instanceof Error ? error.message : 'Unable to save your offer.',
      )
      setBusy(false)
      lock.current = false
    }
  }

  const segments = wheelSegments(config?.odds ?? [])
  const segmentAngle = 360 / Math.max(segments.length, 1)
  const colorStops = segments.map((_, index) =>
    `${wheelColors[index]} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`,
  )
  const wheelBackground = segments.length > 1
    ? `conic-gradient(${colorStops.join(', ')})`
    : segments.length === 1 ? wheelColors[0] : '#26331B'

  const filled = names.filter(name => name.trim().length >= 2).length

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#080A07] text-[#F5F6EE] selection:bg-[#CEFF50] selection:text-black">
      <Navbar />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(#CEFF500D 1px,transparent 1px),linear-gradient(90deg,#CEFF500D 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#CEFF50]">
          STATIC / The group offer
        </p>

        <h1 className="mt-6 text-5xl font-black uppercase leading-[.9] tracking-[-.065em] sm:text-7xl">
          Bring your ten.
          <br />
          <span className="text-[#CEFF50]">Reveal your offer.</span>
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">
          Enter your promoter details and 10 guests’ names. Spin once
          to reveal the discount each guest receives.
        </p>

        <div className="mt-10 grid items-start gap-7 lg:grid-cols-[.85fr_1.15fr]">
          {/* Wheel */}
          <aside className="rounded-3xl border border-[#CEFF50]/20 bg-[#11160F] p-6 sm:p-8 lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-wider text-[#CEFF50]">
                Spin for your price
              </p>
              <RotateCw size={20} className="text-[#CEFF50]" />
            </div>

            <div className="relative mx-auto my-9 w-full max-w-[320px]">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[-8px] z-20 -translate-x-1/2 text-4xl leading-none text-white drop-shadow-lg"
              >
                ▼
              </div>

              <div
                aria-hidden="true"
                onTransitionEnd={event => {
                  if (
                    event.target === event.currentTarget &&
                    event.propertyName === 'transform' &&
                    result
                  ) {
                    finishReveal()
                  }
                }}
                className="relative aspect-square rounded-full border-[7px] border-[#26331B] shadow-[0_0_50px_rgba(206,255,80,.12)]"
                style={{
                  background: wheelBackground,
                  transform: `rotate(${rotation}deg)`,
                  transition: reduceMotion
                    ? 'none'
                    : 'transform 5s cubic-bezier(.12,.75,.12,1)',
                }}
              >
                {segments.map(({ discount }, index) => (
                  <div
                    key={discount}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${(index + 0.5) * segmentAngle}deg)` }}
                  >
                    <div className="absolute left-1/2 top-[12%] -translate-x-1/2 text-center text-[#101509]">
                      <p className="text-xl font-black">−₹{discount}</p>
                      <p className="mt-1 text-[8px] font-black uppercase">
                        Per person
                      </p>
                    </div>
                  </div>
                ))}

                <div className="absolute inset-[35%] flex items-center justify-center rounded-full border-4 border-white/20 bg-[#080A07] text-4xl text-[#CEFF50]">
                  ✳
                </div>
              </div>
            </div>

            <p className="text-center text-xs leading-6 text-white/45">
              {config && segments.map(({ discount, odds }) =>
                `₹${discount} off: ${odds}%`,
              ).join(' · ')}
              {config && <br />}
              No payment is required to spin.
            </p>

            <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-6 text-white/45">
              {config
                ? `Current standard pass: ${money(config.base_price)} per person.`
                : 'Loading the current pass price…'}
              {' '}Discounts apply to all 10 listed guests and cannot
              be combined with another offer.
            </p>

            {config && !config.enabled && (
              <p className="mt-4 text-sm text-amber-200">
                Group offers are currently closed.
              </p>
            )}
          </aside>

          {/* Form */}
          <section className="rounded-3xl border border-white/10 bg-[#11160F] p-6 sm:p-8">
            {revealed && result ? (
              <div aria-live="polite">
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#CEFF50]">
                  Your group offer is saved
                </p>

                <h2 className="mt-6 text-5xl font-black tracking-[-.06em] text-[#CEFF50]">
                  {money(result.discount)} OFF
                </h2>

                <p className="mt-2 text-sm text-white/55">
                  Per person, for your group of 10.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-[10px] uppercase text-white/40">
                      Each guest pays
                    </p>
                    <p className="mt-3 text-2xl font-black">
                      {money(result.price_per_person)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#CEFF50]/25 bg-[#CEFF50]/5 p-5">
                    <p className="text-[10px] uppercase text-white/40">
                      Group total
                    </p>
                    <p className="mt-3 text-2xl font-black text-[#CEFF50]">
                      {money(result.group_total)}
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-[#CEFF50]/25 bg-[#CEFF50]/5 p-5">
  <p className="text-xs font-black uppercase tracking-[.16em] text-[#CEFF50]">
    Before you spin
  </p>

  <ul className="mt-3 space-y-3 text-xs leading-6 text-white/65">
    <li>
      On a successful spin, your promoter details, all 10 guest names,
      and your offer are registered with the submission date and time.
    </li>
    <li>
      Only one offer is permitted per group. Further spins submitted
      by the promoter or any listed group member will not be accepted.
      The first registered offer applies.
    </li>
    <li>
      A spin result is not an entry pass. Passes are issued only after
      STATIC confirms full payment. Complete payment before arriving;
      without full payment, no pass will be issued.
    </li>
  </ul>
</div>

                <p className="mt-6 text-sm leading-7 text-white/60">
                  Your promoter details, guest names, and result have
                  been sent to STATIC. Our team will contact you to
                  arrange payment.
                </p>

                <p className="mt-4 text-xs leading-6 text-white/40">
                  This offer is not an entry pass. Full payment must be
                  confirmed before arrival. Night stay is charged separately.
                </p>

                <p className="mt-6 break-all rounded-xl bg-black/30 p-4 font-mono text-xs text-white/50">
                  Offer ID: {result.id}
                </p>

                <a
                  href="https://www.instagram.com/staticislive_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${button} mt-7`}
                >
                  Contact STATIC <ArrowUpRight size={17} />
                </a>
              </div>
            ) : (
              <form onSubmit={spin}>
                <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight">
                  <Users size={23} className="text-[#CEFF50]" />
                  Your group
                </h2>

                <fieldset disabled={busy || Boolean(result)} className="mt-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-bold text-white/60">
                        Promoter’s name
                      </span>
                      <input
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                        className={field}
                        value={promoter}
                        onChange={event => setPromoter(event.target.value)}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-bold text-white/60">
                        Promoter’s phone
                      </span>
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        autoComplete="tel-national"
                        placeholder="10-digit mobile"
                        className={field}
                        value={phone}
                        onChange={event =>
                          setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                      />
                    </label>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-wider">
                      The 10 guest names
                    </p>
                    <span className="text-xs font-bold text-[#CEFF50]">
                      {filled}/10
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-white/40">
                    Enter all 10 attendees. If the promoter is attending,
                    include their name in this list.
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {names.map((name, index) => (
                      <label key={index} className="block">
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-white/40">
                          Guest {String(index + 1).padStart(2, '0')}
                        </span>
                        <input
                          required
                          minLength={2}
                          maxLength={100}
                          placeholder="Full name"
                          className={field}
                          value={name}
                          onChange={event =>
                            setNames(current =>
                              current.map((value, position) =>
                                position === index ? event.target.value : value,
                              ),
                            )
                          }
                        />
                      </label>
                    ))}
                  </div>

                  <label className="mt-7 flex items-start gap-3 text-xs leading-6 text-white/55">
                    <input
                      required
                      type="checkbox"
                      className="mt-1.5 accent-[#CEFF50]"
                      checked={consent}
                      onChange={event => setConsent(event.target.checked)}
                    />
                    <span>
  I have permission to share these names with STATIC. I agree to
  the one-offer-per-group rule and understand that passes are issued
  only after full payment is confirmed.
</span>
                  </label>
                </fieldset>

                {error && (
                  <div role="alert" className="mt-5 rounded-xl border border-red-400/25 bg-red-950/20 p-4 text-sm leading-6 text-red-100">
                    {error}
                    {!config && (
                      <button
                        type="button"
                        onClick={loadConfig}
                        className="ml-3 underline"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    busy ||
                    Boolean(result) ||
                    !requestKey ||
                    !config?.enabled ||
                    filled !== 10 ||
                    !consent
                  }
                  className={`${button} mt-7 w-full`}
                >
                  {busy ? (
                    <Loader2 size={19} className="animate-spin" />
                  ) : (
                    <RotateCw size={19} />
                  )}
                  {busy
                    ? result
                      ? 'Revealing your offer…'
                      : 'Saving your group…'
                    : 'Spin for your group offer'}
                </button>

                <p className="mt-4 text-center text-[10px] leading-6 text-white/35">
                  Your result is saved before the wheel reveals it.
                  Refreshing does not grant another offer.
                </p>
              </form>
            )}
          </section>
        </div>

        <footer className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
          <Link href="/" className="font-black text-[#CEFF50]">
            STATIC✳
          </Link>
          <Link href="/rules" className="text-xs text-white/45 hover:text-white">
            Event rules ↗
          </Link>
        </footer>
      </div>
    </main>
  )
}
