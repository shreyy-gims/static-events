
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'

const rules = [
  {
    number: '01',
    category: 'Entry & Tickets',
    description: 'Everything you need before entering the venue.',
    items: [
      'A valid STATIC ticket with a scannable QR code is required for entry.',
      'Each QR code is valid for one entry only unless stated otherwise.',
      'Carry a valid government-issued photo ID if requested at check-in.',
      'Tickets purchased from unauthorized sellers may be rejected.',
      'Damaged, duplicated, altered, or already-used QR codes will not be accepted.',
      'Entry is subject to security checks and venue capacity.',
    ],
  },
  {
    number: '02',
    category: 'Crowd Behaviour',
    description: 'Come for the chaos. Keep it respectful.',
    items: [
      'Respect fellow attendees, artists, staff, security, and venue personnel.',
      'Harassment, threats, fighting, or deliberately unsafe behaviour will not be tolerated.',
      'Do not push barricades or intentionally create dangerous crowd movement.',
      'Follow instructions given by security and event staff.',
      'Anyone creating a safety risk may be removed from the venue.',
    ],
  },
  {
    number: '03',
    category: 'Prohibited Items',
    description: 'Some things need to stay outside.',
    items: [
      'Weapons, sharp objects, explosives, fireworks, or dangerous items are prohibited.',
      'Illegal substances are strictly prohibited.',
      'Outside alcohol is not permitted.',
      'Large bags or items restricted by the venue may be denied entry.',
      'Professional recording equipment may require prior organizer approval.',
      'Any item considered unsafe by venue security may be refused.',
    ],
  },
  {
    number: '04',
    category: 'Photos & Recording',
    description: 'Capture the night without ruining someone else’s.',
    items: [
      'Personal mobile photography and short-form recording are generally permitted unless announced otherwise.',
      'Do not obstruct other attendees while recording.',
      'Flash, tripods, drones, or professional camera equipment may be restricted.',
      'Artist-specific photography and recording restrictions must be followed.',
      'By attending, you acknowledge that official event photography or videography may capture crowd areas.',
    ],
  },
  {
    number: '05',
    category: 'Safety & Emergency',
    description: 'Your safety comes before the show.',
    items: [
      'Keep emergency exits and access routes clear at all times.',
      'Immediately contact event staff or security if you feel unsafe or require assistance.',
      'Follow evacuation or emergency instructions without delay.',
      'Do not climb barricades, stage structures, lighting rigs, or restricted installations.',
      'Medical assistance locations will be communicated at the venue where applicable.',
    ],
  },
  {
    number: '06',
    category: 'Venue & Organizer Rights',
    description: 'Rules that keep the event running smoothly.',
    items: [
      'STATIC and venue management reserve the right to refuse or revoke entry where permitted.',
      'Security checks may be conducted before entry.',
      'Restricted backstage, production, artist, and staff areas must not be entered.',
      'Event timings, performances, layouts, and schedules may change when operationally necessary.',
      'Serious rule violations may result in removal from the venue without re-entry.',
    ],
  },
]

const ticketPolicy = [
  'Tickets cannot be duplicated or used by multiple attendees.',
  'Refund eligibility depends on the refund policy displayed for the specific event or ticket category.',
  'Tickets may be non-refundable after the stated refund deadline.',
  'If an event is cancelled by the organizer, applicable refund instructions will be communicated to ticket holders.',
  'Line-up, schedule, venue layout or event timings may change due to operational, safety or unavoidable circumstances.',
]

export default function RulesPage() {
  const [active, setActive] = useState<number | null>(0)
  const [agreed, setAgreed] = useState(false)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080A07] text-[#F3F4EC] selection:bg-[#CEFF50] selection:text-black">
      <Navbar />

      <style>{`
        @keyframes rulesTicker {
          to {
            transform: translateX(-50%);
          }
        }

        .rules-ticker {
          animation: rulesTicker 26s linear infinite;
        }

        .rules-grid {
          background-image:
            linear-gradient(#CEFF5010 1px, transparent 1px),
            linear-gradient(90deg, #CEFF5010 1px, transparent 1px);
          background-size: 55px 55px;
        }

        @media (prefers-reduced-motion: reduce) {
          .rules-ticker {
            animation: none;
          }
        }
      `}</style>

      {/* HERO */}

      <section className="relative isolate overflow-hidden border-b border-white/15 px-5 pb-20 pt-36 sm:px-9 sm:pb-28 sm:pt-44 lg:px-14">
        <div className="absolute inset-0 -z-30 bg-[url('/staticbg.jpeg')] bg-cover bg-center opacity-25" />

        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#080A07] via-[#080A07]/90 to-[#080A07]/55" />

        <div className="rules-grid absolute inset-0 -z-10 opacity-80" />

        <div className="pointer-events-none absolute -right-32 top-10 -z-10 h-[500px] w-[500px] rounded-full bg-[#CEFF50]/10 blur-[120px]" />

        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50]">
            <span className="h-px w-10 bg-[#CEFF50]" />
            THE CODE / 001 — 006
          </div>

          <h1 className="max-w-[1300px] text-[clamp(4.5rem,14vw,13rem)] font-black uppercase leading-[.78] tracking-[-.095em]">
            GOOD
            <br />
            <span className="text-[#CEFF50]">CHAOS.</span>
            <br />
            NO HARM.
          </h1>

          <div className="mt-12 flex flex-col justify-between gap-7 border-t border-white/20 pt-7 md:flex-row md:items-end">
            <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Lose yourself in the music. Not your respect for others.
              Here&apos;s the code that keeps every STATIC night safe,
              welcoming and unforgettable.
            </p>

            <a
              href="#event-code"
              className="inline-flex w-fit items-center gap-3 border-b-2 border-[#CEFF50] pb-2 text-xs font-black uppercase tracking-[.2em] text-[#CEFF50] transition hover:gap-6"
            >
              READ THE CODE
              <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
      </section>

      {/* ANIMATED MARQUEE */}

      <div
        className="overflow-hidden border-y border-[#CEFF50] bg-[#CEFF50] py-4 text-[#080A07]"
        aria-hidden="true"
      >
        <div className="rules-ticker flex w-max">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-10 pr-10"
            >
              {[
                'RESPECT THE CROWD',
                'KEEP THE ENERGY',
                'SAFETY FIRST',
                'NEVER STAY STILL',
              ].map((item) => (
                <span
                  key={item}
                  className="whitespace-nowrap text-lg font-black uppercase tracking-[-.04em] sm:text-2xl"
                >
                  ✳ {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* IMPORTANT NOTICE */}

      <section className="border-b border-white/15 bg-[#11150F] px-5 py-8 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <span className="shrink-0 text-[10px] font-black uppercase tracking-[.25em] text-[#CEFF50]">
            ⚠ BEFORE ENTRY
          </span>

          <p className="text-sm leading-6 text-white/70">
            Purchasing or using an event ticket means you agree to
            follow applicable event and venue rules. Serious violations
            may result in denied entry or removal.
          </p>
        </div>
      </section>

      {/* INTERACTIVE RULES */}

      <section
        id="event-code"
        className="scroll-mt-24 px-5 py-24 sm:px-9 lg:px-14 lg:py-36"
      >
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.42fr_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50]">
              01 / HOUSE RULES
            </p>

            <h2 className="text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[.85] tracking-[-.075em]">
              THE
              <br />
              EVENT
              <br />
              <span className="text-[#CEFF50]">CODE.</span>
            </h2>

            <p className="mt-7 max-w-xs text-sm leading-7 text-white/50">
              Six chapters. One standard: enjoy the experience without
              compromising anyone else&apos;s.
            </p>

            <p className="mt-10 text-xs font-black uppercase tracking-[.18em] text-white/35">
              SELECT A CHAPTER ↗
            </p>
          </div>

          <div className="border-t border-white/20">
            {rules.map((rule, index) => {
              const open = active === index

              return (
                <article
                  key={rule.number}
                  className="border-b border-white/20"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`rule-panel-${index}`}
                    onClick={() => setActive(open ? null : index)}
                    className="group flex w-full items-center gap-4 py-7 text-left sm:gap-7 sm:py-9"
                  >
                    <span className="w-9 shrink-0 self-start pt-1 text-xs font-black text-[#CEFF50]">
                      {rule.number}
                    </span>

                    <span
                      className={`min-w-0 flex-1 text-[clamp(1.6rem,3.6vw,3.8rem)] font-black uppercase leading-none tracking-[-.055em] transition-colors ${
                        open
                          ? 'text-[#CEFF50]'
                          : 'text-white group-hover:text-[#CEFF50]'
                      }`}
                    >
                      {rule.category}
                    </span>

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-2xl transition ${
                        open
                          ? 'rotate-45 border-[#CEFF50] bg-[#CEFF50] text-black'
                          : 'border-white/30 text-[#CEFF50]'
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  <div
                    id={`rule-panel-${index}`}
                    hidden={!open}
                    className="pb-9 pl-[52px] sm:pl-[64px]"
                  >
                    <p className="mb-6 max-w-xl text-sm leading-6 text-white/50">
                      {rule.description}
                    </p>

                    <ul className="max-w-3xl space-y-4">
                      {rule.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-4 text-sm leading-7 text-white/75"
                        >
                          <span className="shrink-0 font-black text-[#CEFF50]">
                            ↗
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* TICKET AND REFUND POLICY */}

      <section className="bg-[#CEFF50] px-5 py-20 text-[#090B08] sm:px-9 lg:px-14 lg:py-28">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="mb-7 text-[10px] font-black uppercase tracking-[.3em]">
              02 / TICKET POLICY
            </p>

            <h2 className="text-[clamp(3.4rem,7vw,8rem)] font-black uppercase leading-[.83] tracking-[-.085em]">
              THE
              <br />
              FINE
              <br />
              PRINT.
            </h2>

            <p className="mt-7 max-w-sm text-sm font-semibold leading-7">
              Event-specific ticket conditions shown during booking
              take priority where applicable.
            </p>
          </div>

          <div className="border-t border-black/25">
            {ticketPolicy.map((item, i) => (
              <div
                key={item}
                className="flex gap-5 border-b border-black/25 py-6 sm:gap-9"
              >
                <span className="shrink-0 text-xs font-black">
                  0{i + 1}
                </span>

                <p className="text-sm font-semibold leading-7 sm:text-base">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGREEMENT */}

      <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36">
        <div className="mx-auto max-w-[1500px] border-y border-white/20 py-12">
          <p className="mb-7 text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50]">
            03 / THE PLEDGE
          </p>

          <h2 className="max-w-5xl text-[clamp(3.2rem,8vw,9rem)] font-black uppercase leading-[.85] tracking-[-.08em]">
            READY TO
            <br />
            <span className="text-[#CEFF50]">ENTER?</span>
          </h2>

          <label className="mt-12 flex max-w-2xl cursor-pointer items-start gap-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-[#CEFF50]"
            />

            <span className="text-sm leading-7 text-white/65">
              I have read and agree to follow the event rules, safety
              requirements and applicable venue guidelines.
            </span>
          </label>

          <div className="mt-10 flex flex-wrap gap-4">
            {agreed ? (
              <Link
                href="/events"
                className="inline-flex min-h-14 items-center gap-6 bg-[#CEFF50] px-7 text-xs font-black uppercase tracking-[.17em] text-[#090B08] transition hover:bg-white"
              >
                EXPLORE EVENTS
                <span>↗</span>
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-14 cursor-not-allowed items-center gap-6 bg-white/10 px-7 text-xs font-black uppercase tracking-[.17em] text-white/35"
              >
                EXPLORE EVENTS
                <span>↗</span>
              </button>
            )}

            <Link
              href="/"
              className="inline-flex min-h-14 items-center gap-3 border border-white/25 px-7 text-xs font-black uppercase tracking-[.17em] transition hover:border-[#CEFF50] hover:text-[#CEFF50]"
            >
              ← BACK HOME
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/15 bg-[#060806] px-5 py-8 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-3xl font-black tracking-[-.09em]"
          >
            STATIC
            <span className="text-[#CEFF50]">✳</span>
          </Link>

          <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/35">
            © {new Date().getFullYear()} STATIC — NEVER STAY STILL
          </span>
        </div>
      </footer>
    </main>
  )
}
