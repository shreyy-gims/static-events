'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'

const CONTACT_URL = 'https://www.instagram.com/staticislive_/'

const rules = [
  {
    number: '01',
    category: 'Registration & Entry',
    description: 'Sending your details is the first step, not a confirmed pass.',
    items: [
      'This event is for guests aged 18 and above. Carry an original, valid government-issued photo ID for age and identity verification.',
      'Submitting the guest form does not confirm admission, reserve accommodation, or guarantee an entry code.',
      'Registration details must be accurate. Use your own name, phone number, Instagram account, and photograph.',
      'Entry is confirmed only after the STATIC team communicates approval and issues your individual entry code or QR.',
      'Payment status must be confirmed by the organizer before entry. A payment screenshot alone is not a confirmed pass.',
      'Your entry code is linked to your guest record. Do not publish it, share it, or allow another person to use it.',
      'Each code permits one guest and one check-in. Re-entry requires explicit approval from the entry team.',
      'Duplicate, altered, revoked, or already-used codes cannot be used for admission.',
      'Guest substitutions and transfers require approval before arrival.',
      'Entry remains subject to verified identity, venue capacity, and the published safety and conduct requirements.',
    ],
  },
  {
    number: '02',
    category: 'Payment & Pass Inclusions',
    description: 'Know what you are paying for before sending money.',
    items: [
      'Payments are arranged manually. This website does not collect online payments.',
      'Pay only through a payment method or recipient confirmed by STATIC through its official contact channel.',
      'Before paying, obtain confirmation of the price, pass inclusions, event details, and cancellation conditions.',
      'Keep your payment reference and organizer confirmation until the event and any payment query are resolved.',
      'A pass covers only the inclusions expressly confirmed for that pass. Do not assume that drinks, food, pool access, transport, parking, or accommodation are included.',
      'Night-stay charges are not included in the event pass.',
      'Additional purchases and optional services must be separately agreed and paid for.',
      'Report incorrect amounts, duplicate payments, or missing payment confirmations promptly through the official contact channel.',
    ],
  },
  {
    number: '03',
    category: 'Respect & Consent',
    description: 'Good energy includes respecting every boundary.',
    items: [
      'Treat guests, staff, performers, security, and venue personnel respectfully.',
      'Harassment, stalking, threats, unwanted touching, bullying, discriminatory abuse, and fighting are not permitted.',
      'A registration answer such as “single”, “mingle”, or “open to being approached” is not consent to touching, flirting, photography, or any other interaction.',
      'Consent must be freely given for the specific interaction and can be withdrawn at any time.',
      'Stop immediately when someone says no, moves away, or appears uncomfortable. Silence is not agreement.',
      'Do not pressure anyone to drink, smoke, share contact details, dance, or take part in an activity.',
      'Someone who is asleep, unconscious, or too impaired to make a decision cannot give consent.',
      'Report unwanted behaviour to the event team. Staff will help address immediate safety concerns.',
    ],
  },
  {
    number: '04',
    category: 'Drinks & Smoking',
    description: 'Preferences on the form are for planning only.',
    items: [
      'Selecting an alcoholic drink preference does not promise alcohol availability or establish eligibility to receive it.',
      'Any alcohol service is subject to the applicable age requirements, venue conditions, and required authorizations. Additional age verification may be requested.',
      'Do not bring outside alcohol, unsealed drinks, or unapproved substances into the venue.',
      'Do not supply drinks to someone who is ineligible or pressure another person to consume alcohol.',
      'Staff may stop service and restrict participation where impairment creates a safety concern.',
      'Never leave your drink unattended or accept a drink if you are unsure where it came from. Inform staff immediately if you suspect tampering.',
      'Smoking or vaping is permitted only where expressly allowed in a designated area. It is not allowed near the pool, indoors, or in non-smoking areas.',
      'Do not drive after consuming alcohol or while impaired. Arrange a safe journey home.',
    ],
  },
  {
    number: '05',
    category: 'Pool & Activity Safety',
    description: 'A poolside event does not automatically include swimming.',
    items: [
      'Pool access is allowed only if the organizer expressly opens it and appropriate supervision and safety arrangements are in place.',
      'A poolside pass does not, by itself, include permission to enter the water.',
      'Do not enter the water when the pool is closed, unsupervised, or restricted by staff.',
      'No swimming after consuming alcohol or while impaired.',
      'No diving, running on wet surfaces, pushing people into the water, rough play, or holding another person underwater.',
      'Glass containers, electrical equipment, and smoking materials must stay away from the pool.',
      'Follow pool depth markings, capacity limits, clothing requirements, and all instructions from designated pool staff.',
      'If you cannot swim or have a condition that makes an activity unsafe, do not participate. Ask staff about a suitable alternative.',
      'Do not attempt a rescue that puts you at risk. Alert pool staff immediately and use available rescue equipment as instructed.',
      'Activities may be stopped or restricted when conditions become unsafe.',
    ],
  },
  {
    number: '06',
    category: 'Night Stay',
    description: 'Separate arrangements. Separate charges.',
    items: [
      'Night-stay charges are not included in the event pass.',
      'Selecting “yes” for night stay records your interest only. It does not reserve a room or guarantee availability.',
      'Accommodation requires separate written confirmation of the provider, price, payment recipient, room-sharing arrangement, and check-in and check-out times.',
      'Confirm the accommodation cancellation and refund conditions before paying for your stay.',
      'Guests must meet the accommodation provider’s identity, age, occupancy, and visitor requirements.',
      'Do not enter another guest’s room or bring an unregistered visitor without permission from the occupants and accommodation provider.',
      'No one may be pressured to share a room or sleeping space.',
      'Event entry does not give permission to remain at the venue overnight without a confirmed accommodation arrangement.',
      'Report accommodation concerns to the named provider and STATIC where STATIC arranged the booking.',
    ],
  },
  {
    number: '07',
    category: 'Restricted Items & Areas',
    description: 'Keep the venue comfortable and safe for everyone.',
    items: [
      'Weapons, dangerous sharp objects, explosives, fireworks, and illegal substances are prohibited.',
      'Do not bring hazardous materials or items that could injure guests or damage the venue.',
      'Bags and belongings may be checked respectfully at entry. Guests who decline a necessary check may be unable to enter.',
      'Do not enter backstage, production, staff-only areas, closed rooms, or other restricted spaces.',
      'Do not climb stages, lighting equipment, railings, rooftops, or temporary structures.',
      'Drones, professional recording equipment, and equipment requiring installation need prior approval.',
      'Keep essential medication safely with you. Ask the team in advance if you need storage or accessibility assistance.',
    ],
  },
  {
    number: '08',
    category: 'Photos & Guest Privacy',
    description: 'Enjoy the memories without compromising someone’s privacy.',
    items: [
      'Registration photographs and personal answers are collected for guest review, communication, and entry management.',
      'Registration photos are not permission for STATIC to publish your image in advertising. Separate permission should be obtained for that use.',
      'Access to registration information is limited to authorized people who need it to operate the event.',
      'Do not share another guest’s phone number, registration answers, entry code, or private images without permission.',
      'Official photography may capture general event and crowd scenes. Tell the team if you do not want to be photographed so reasonable steps can be taken.',
      'Ask before taking close-up photographs or recordings of another guest. Respect requests to stop.',
      'No photography or recording in changing areas, washrooms, accommodation rooms, or other private spaces without the express agreement of everyone involved.',
      'Do not publish humiliating, intimate, or intrusive images of another person.',
      'Contact STATIC for questions about your information, correction requests, deletion requests, or an identifiable promotional image. Some records may need to be retained for payment, safety, or other required purposes.',
    ],
  },
  {
    number: '09',
    category: 'Health & Emergency',
    description: 'Ask for help early. Look out for each other.',
    items: [
      'Keep exits, stairs, access routes, and emergency equipment unobstructed.',
      'Notify staff immediately about injury, illness, suspected drink tampering, unsafe behaviour, or a missing person.',
      'Follow evacuation and emergency instructions promptly.',
      'Tell staff about relevant allergies before accepting food or drinks. Ask about ingredients rather than assuming an item is suitable.',
      'Flashing lights, loud sound, crowds, and wet surfaces may be present. Ask the team about accessibility and activity conditions before attending.',
      'If you feel unwell or impaired, stop the activity and request assistance.',
      'Provide accurate emergency information when requested and arrange a safe departure.',
    ],
  },
  {
    number: '10',
    category: 'Belongings & Damage',
    description: 'Respect the space and keep your essentials close.',
    items: [
      'Keep your phone, cash, identification, jewellery, and other valuables secure. Do not leave belongings unattended.',
      'Do not assume storage, lockers, or a cloakroom are available unless confirmed by the organizer.',
      'Report missing property promptly. Found items should be handed to the designated event team.',
      'Do not damage furniture, pool equipment, rooms, decorations, or other guests’ belongings.',
      'Any request to recover damage costs must be based on documented damage attributable to the person concerned. Arbitrary penalties are not part of these rules.',
      'Do not move or interfere with safety equipment, cables, sound systems, or production installations.',
    ],
  },
  {
    number: '11',
    category: 'Changes & Entry Decisions',
    description: 'Clear communication and reasonable decisions.',
    items: [
      'Timings, activities, or layouts may need reasonable changes for safety or operational reasons.',
      'Material changes, including a venue or event-date change, will be communicated to registered guests through the contact details provided.',
      'Entry may be refused or participation stopped for a specific reason such as failed identity checks, an invalid code, serious misconduct, or an immediate safety risk.',
      'Removal decisions should be proportionate to the situation. Guests may request the reason and contact the organizer about any payment dispute.',
      'Capacity restrictions do not automatically remove refund rights where a valid confirmed guest cannot be admitted.',
      'New terms will not be used retrospectively to remove benefits already paid for without an appropriate resolution.',
    ],
  },
  {
    number: '12',
    category: 'Questions & Concerns',
    description: 'Raise an issue so the team can address it.',
    items: [
      'Use the official STATIC contact channel for booking, payment, accommodation, privacy, and event concerns.',
      'Share the relevant guest name, booking or payment reference, and a brief description. Never send passwords, PINs, or OTPs.',
      'For an immediate safety concern at the venue, contact on-site staff rather than waiting for a social-media reply.',
      'Guests may raise a complaint or seek assistance without being asked to give up their rights.',
      'These rules do not exclude responsibility for negligence, misconduct, or any obligation that cannot be excluded.',
    ],
  },
]

const paymentPolicy = [
  {
    title: 'Before you pay',
    text: 'Get written confirmation of the pass price, inclusions, event details, and cancellation conditions. Keep a copy of the terms provided at that time.',
  },
  {
    title: 'Guest cancellation',
    text: 'Any cancellation deadline or deduction must be disclosed before payment and must be reasonable. Contact STATIC for the terms that apply to your confirmed booking.',
  },
  {
    title: 'Organizer cancellation',
    text: 'If STATIC cancels the event, guests will be offered a refund of amounts collected for services not provided. The process and expected timeline will be communicated directly.',
  },
  {
    title: 'Postponement or major change',
    text: 'If the event is postponed or materially changed, guests will be told what has changed and offered an appropriate resolution, including a refund option where applicable.',
  },
  {
    title: 'Duplicate or incorrect payment',
    text: 'Report the transaction reference through the official contact channel. Verified duplicate payments and incorrect collections will be corrected.',
  },
  {
    title: 'Separate night-stay booking',
    text: 'Accommodation is charged separately. Its provider, inclusions, cancellation conditions, and refund process must be confirmed before payment.',
  },
  {
    title: 'Your rights remain',
    text: 'No blanket “no refunds” or “no responsibility” statement overrides rights that apply to the booking. Contact the team if the service provided differs from what was confirmed.',
  },
]

export default function RulesPage() {
  const [active, setActive] = useState<number | null>(0)

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080A07] text-[#F3F4EC] selection:bg-[#CEFF50] selection:text-black">
      <Navbar />

      <style>{`
        @keyframes rulesTicker {
          to { transform: translateX(-50%); }
        }

        .rules-ticker {
          animation: rulesTicker 30s linear infinite;
        }

        .rules-grid {
          background-image:
            linear-gradient(#CEFF5010 1px, transparent 1px),
            linear-gradient(90deg, #CEFF5010 1px, transparent 1px);
          background-size: 55px 55px;
        }

        @media (prefers-reduced-motion: reduce) {
          .rules-ticker { animation: none; }
        }
      `}</style>

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-white/15 px-5 pb-20 pt-36 sm:px-9 sm:pb-28 sm:pt-44 lg:px-14">
        <div
          aria-hidden="true"
          className="rules-grid absolute inset-0 -z-10 opacity-70"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-10 -z-10 h-[500px] w-[500px] rounded-full bg-[#CEFF50]/10 blur-[120px]"
        />

        <div className="mx-auto max-w-[1500px]">
          <p className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.25em] text-[#CEFF50]">
            <span className="h-px w-10 bg-[#CEFF50]" />
            STATIC / The Guest Code
          </p>

          <h1 className="text-[clamp(4rem,14vw,13rem)] font-black uppercase leading-[.8] tracking-[-.085em]">
            GOOD
            <br />
            <span className="text-[#CEFF50]">CHAOS.</span>
            <br />
            NO HARM.
          </h1>

          <div className="mt-12 flex flex-col justify-between gap-7 border-t border-white/20 pt-7 md:flex-row md:items-end">
            <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Bring your energy. Respect the boundaries.
              Read the guest rules before registering or paying
              for your STATIC experience.
            </p>

            <a
              href="#event-code"
              className="group inline-flex min-h-11 w-fit items-center gap-3 border-b-2 border-[#CEFF50] pb-2 text-xs font-black uppercase tracking-[.2em] text-[#CEFF50]"
            >
              Read the code
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1"
              >
                ↘
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div
        aria-hidden="true"
        className="overflow-hidden border-y border-[#CEFF50] bg-[#CEFF50] py-4 text-[#080A07]"
      >
        <div className="rules-ticker flex w-max">
          {[0, 1].map(copy => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-10 pr-10"
            >
              {[
                'RESPECT THE CROWD',
                'CONSENT ALWAYS',
                'KNOW YOUR PASS',
                'LOOK OUT FOR EACH OTHER',
              ].map(item => (
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

      {/* Key booking notices */}
      <section className="border-b border-white/15 bg-[#11150F] px-5 py-9 sm:px-9 lg:px-14">
        <div className="mx-auto grid max-w-[1500px] gap-6 md:grid-cols-3">
          {[
            {
              title: 'Registration ≠ confirmed entry',
              text: 'Your pass is confirmed separately by the STATIC team.',
            },
            {
              title: 'Manual payments only',
              text: 'Verify the recipient and pass inclusions before paying.',
            },
            {
              title: 'Night stay costs extra',
              text: 'Night-stay charges are not included in your event pass.',
            },
          ].map(notice => (
            <div
              key={notice.title}
              className="border-l-2 border-[#CEFF50]/60 pl-5"
            >
              <h2 className="text-[11px] font-black uppercase tracking-[.12em] text-[#CEFF50]">
                {notice.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                {notice.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section
        id="event-code"
        className="scroll-mt-24 px-5 py-20 sm:px-9 lg:px-14 lg:py-28"
      >
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.42fr_1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50]">
              01 / House Rules
            </p>

            <h2 className="text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[.85] tracking-[-.075em]">
              THE
              <br />
              GUEST
              <br />
              <span className="text-[#CEFF50]">CODE.</span>
            </h2>

            <p className="mt-7 max-w-xs text-sm leading-7 text-white/50">
              Clear expectations for a better night.
              Open each section to read the details.
            </p>

            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-12 items-center gap-4 rounded-full border border-white/20 px-5 text-[10px] font-black uppercase tracking-[.15em] transition hover:border-[#CEFF50] hover:text-[#CEFF50]"
            >
              Ask STATIC
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="border-t border-white/20">
            {rules.map((rule, index) => {
              const open = active === index

              return (
                <article
                  key={rule.number}
                  className="border-b border-white/20"
                >
                  <h3>
                    <button
                      id={`rule-heading-${index}`}
                      type="button"
                      aria-expanded={open}
                      aria-controls={`rule-panel-${index}`}
                      onClick={() => setActive(open ? null : index)}
                      className="group flex w-full items-center gap-3 py-7 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CEFF50] sm:gap-6 sm:py-9"
                    >
                      <span className="w-7 shrink-0 self-start pt-1 text-[11px] font-black text-[#CEFF50]">
                        {rule.number}
                      </span>

                      <span
                        className={`min-w-0 flex-1 text-[clamp(1.3rem,3vw,3rem)] font-black uppercase leading-[1.05] tracking-[-.045em] transition-colors ${
                          open
                            ? 'text-[#CEFF50]'
                            : 'text-white group-hover:text-[#CEFF50]'
                        }`}
                      >
                        {rule.category}
                      </span>

                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-2xl transition ${
                          open
                            ? 'rotate-45 border-[#CEFF50] bg-[#CEFF50] text-black'
                            : 'border-white/25 text-[#CEFF50]'
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`rule-panel-${index}`}
                    aria-labelledby={`rule-heading-${index}`}
                    hidden={!open}
                    className="pb-9 pl-10 sm:pl-[52px]"
                  >
                    <p className="mb-6 text-sm leading-7 text-white/45">
                      {rule.description}
                    </p>

                    <ul className="space-y-4">
                      {rule.items.map(item => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-7 text-white/75"
                        >
                          <span
                            aria-hidden="true"
                            className="shrink-0 font-black text-[#CEFF50]"
                          >
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

      {/* Payment and refund policy */}
      <section className="bg-[#CEFF50] px-5 py-20 text-[#090B08] sm:px-9 lg:px-14 lg:py-28">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="mb-7 text-[10px] font-black uppercase tracking-[.3em]">
              02 / Payments & Changes
            </p>

            <h2 className="text-[clamp(3.2rem,7vw,7rem)] font-black uppercase leading-[.85] tracking-[-.075em]">
              KNOW
              <br />
              YOUR
              <br />
              BOOKING.
            </h2>

            <p className="mt-7 max-w-sm text-sm font-semibold leading-7">
              Ask before paying. Keep your confirmation.
              Night stay is a separate arrangement.
            </p>
          </div>

          <div className="border-t border-black/25">
            {paymentPolicy.map((item, index) => (
              <div
                key={item.title}
                className="flex gap-4 border-b border-black/25 py-6 sm:gap-7"
              >
                <span className="shrink-0 pt-1 text-xs font-black">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-7 text-black/75">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact and registration */}
      <section className="px-5 py-20 sm:px-9 lg:px-14 lg:py-28">
        <div className="mx-auto max-w-[1500px] border-y border-white/20 py-12">
          <p className="mb-7 text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50]">
            03 / Before You Join
          </p>

          <h2 className="text-[clamp(3rem,8vw,8rem)] font-black uppercase leading-[.87] tracking-[-.075em]">
            CLEAR RULES.
            <br />
            <span className="text-[#CEFF50]">BETTER NIGHTS.</span>
          </h2>

          <p className="mt-8 max-w-2xl text-sm leading-7 text-white/55">
            Questions about entry, payment, pool access, or accommodation?
            Get confirmation from STATIC before making your plans.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/tickets"
              className="group inline-flex min-h-14 items-center gap-5 rounded-full bg-[#CEFF50] px-7 text-xs font-black uppercase tracking-[.12em] text-[#090B08] transition hover:bg-white"
            >
              Guest Registration
              <span
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>

            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center gap-3 rounded-full border border-white/25 px-7 text-xs font-black uppercase tracking-[.12em] transition hover:border-[#CEFF50] hover:text-[#CEFF50]"
            >
              Contact STATIC ↗
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/15 bg-[#060806] px-5 py-8 sm:px-9 lg:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-5">
          <Link
            href="/"
            className="text-3xl font-black tracking-[-.07em]"
          >
            STATIC<span className="text-[#CEFF50]">✳</span>
          </Link>

          <p className="text-[9px] font-black uppercase tracking-[.15em] text-white/35">
            © {new Date().getFullYear()} STATIC — Never Stay Still
          </p>
        </div>
      </footer>
    </main>
  )
}