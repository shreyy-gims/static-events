'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Music2,
  Sparkles,
} from 'lucide-react'

import { Navbar } from '@/components/navbar'

/* =========================================================
   TYPES
========================================================= */

type EventStatus = 'UP NEXT' | 'COMING SOON' | 'PAST'

type Event = {
  id: number
  title: string
  subtitle: string
  description: string
  location: string
  venue: string
  date: string
  time?: string
  image: string
  href: string
  status: EventStatus
  year: string
}

/* =========================================================
   EVENT DATA

   Later you can move this into:
   lib/events.ts
========================================================= */

const featuredEvent: Event = {
  id: 1,
  title: ' ',
  subtitle: 'LIVE IN BHILAI',
  description:
    'static brings a new live music experience to Bhilai. Music, culture, crowd energy and a night built to be remembered.',
  location: 'Bhilai, Chhattisgarh',
  venue: 'Venue Revealing Soon',
  date: 'Coming Soon',
  time: 'To Be Announced',
  image: '/raat2.png',
  href: '/events/artist1',
  status: 'UP NEXT',
  year: '2026',
}

const upcomingEvents: Event[] = [

]

/*
  Add your real previous static / ADS events here later.

  Example:

  {
    id: 4,
    title: 'NOCTRA',
    subtitle: 'static EXPERIENCE',
    description: '...',
    location: 'Bhilai, Chhattisgarh',
    venue: '...',
    date: '12 July 2026',
    image: '/events/noctra.jpg',
    href: '/events/noctra',
    status: 'PAST',
    year: '2026',
  }
*/

const pastEvents: Event[] = [
{
    id: 1,
    title: 'REMINISCE-2K25',
    subtitle: 'BSP SSS-10 FAREWELL',
    description: '...',
    location: 'Bhilai, Chhattisgarh',
    venue: '...',
    date: '24 NOVEMBER 2025',
    image: '/spiderverse.jpeg',
    href: '/events/noctra',
    status: 'PAST',
    year: '2025',
  },

  {
    id: 2,
    title: 'VIGAM-2K26',
    subtitle: 'DS-IT FAREWELL RUNGTA',
    description: '...',
    location: 'Bhilai, Chhattisgarh',
    venue: '...',
    date: '31 MARCH 2026',
    image: '/raftaar.jpeg',
    href: '/events/cl6',
    status: 'PAST',
    year: '2026',
  },


]

/* =========================================================
   ANIMATION
========================================================= */

const fadeUp = {
  initial: {
    opacity: 0,
    y: 30,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
  viewport: {
    once: true,
    amount: 0.15,
  },
  transition: {
    duration: 0.6,
  },
}

/* =========================================================
   PAGE
========================================================= */

export default function EventsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] text-white">
      <Navbar />

      {/* =====================================================
          PAGE HERO
      ===================================================== */}

      

      {/* =====================================================
          FEATURED / UP NEXT
      ===================================================== */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">

        <div className="mx-auto max-w-[1400px]">

          <motion.div
            {...fadeUp}
            className="mb-10 flex items-end justify-between"
          >

            <div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                Featured
              </p>

              <h2 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                UP NEXT.
              </h2>

            </div>

            <span className="hidden text-xs uppercase tracking-[0.25em] text-white/20 sm:block">
              {featuredEvent.year}
            </span>

          </motion.div>

          {/* FEATURED EVENT CARD */}

          <motion.article
            {...fadeUp}
            className="group relative min-h-[650px] overflow-hidden rounded-[28px] border border-white/10 sm:min-h-[700px] lg:min-h-[720px] lg:rounded-[40px]"
          >

            {/* Image */}

            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1800ms] group-hover:scale-[1.025]"
              style={{
                backgroundImage: `url('${featuredEvent.image}')`,
              }}
            />

            {/* Overlays */}

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/10 to-transparent" />

            {/* Content */}

            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">

              {/* Top */}

              <div className="flex items-start justify-between">

                <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400 backdrop-blur-xl">
                  {featuredEvent.status}
                </span>

                <span className="text-xs font-bold text-white/30">
                  {featuredEvent.year}
                </span>

              </div>

              {/* Bottom */}

              <div className="max-w-5xl">

                <div className="mb-5 flex items-center gap-3">

                  <Music2
                    size={17}
                    className="text-orange-500"
                  />

                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                    Static Presents
                  </span>

                </div>

                <h3 className="text-[16vw] font-black leading-[0.73] tracking-[-0.065em] sm:text-7xl md:text-8xl lg:text-[8rem]">
                  {featuredEvent.title}
                </h3>

                <p className="mt-5 text-lg font-bold tracking-[0.22em] text-white/50 sm:text-2xl">
                  {featuredEvent.subtitle}
                </p>

                {/* Meta */}

                <div className="mt-8 flex flex-col gap-3 text-sm text-white/60 sm:flex-row sm:flex-wrap sm:gap-x-8">

                  <div className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      className="text-orange-500"
                    />

                    {featuredEvent.location}
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={16}
                      className="text-orange-500"
                    />

                    {featuredEvent.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3
                      size={16}
                      className="text-orange-500"
                    />

                    {featuredEvent.time}
                  </div>

                </div>

                {/* Description */}

                <p className="mt-7 max-w-xl text-sm leading-6 text-white/50 sm:text-base sm:leading-7">
                  {featuredEvent.description}
                </p>

                {/* CTA */}

                <Link
                  href={featuredEvent.href}
                  className="group/button mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:bg-orange-500"
                >
                  Explore Event

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover/button:translate-x-1"
                  />
                </Link>

              </div>

            </div>

          </motion.article>

        </div>
      </section>

      {/* =====================================================
          UPCOMING EVENTS
      ===================================================== */}

      <section className="border-y border-white/[0.06] bg-[#0a0a0a] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">

        <div className="mx-auto max-w-[1400px]">

          {/* Header */}

          <motion.div
            {...fadeUp}
            className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >

            <div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                What's Coming
              </p>

              <h2 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                UPCOMING.
              </h2>

            </div>

            <p className="max-w-sm text-sm leading-6 text-white/35">
              New artists, experiences and announcements will appear here
              as the next chapter of static unfolds.
            </p>

          </motion.div>

          {/* Cards */}

          <div className="grid gap-5 md:grid-cols-2">

            {upcomingEvents.map((event, index) => (

              <motion.article
                {...fadeUp}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                key={event.id}
                className="group relative min-h-[480px] overflow-hidden rounded-[25px] border border-white/[0.08] bg-[#101010] sm:min-h-[540px]"
              >

                {/* Image */}

                <div
                  className="absolute inset-0 bg-cover bg-center opacity-35 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-50 group-hover:grayscale-0"
                  style={{
                    backgroundImage: `url('${event.image}')`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />

                {/* Content */}

                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">

                  <div className="flex items-center justify-between">

                    <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 backdrop-blur-xl">
                      {event.status}
                    </span>

                    <span className="text-xs text-white/25">
                      0{index + 2}
                    </span>

                  </div>

                  <div>

                    <h3 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-xs font-bold tracking-[0.2em] text-orange-500">
                      {event.subtitle}
                    </p>

                    <p className="mt-5 max-w-md text-sm leading-6 text-white/40">
                      {event.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs text-white/40">

                      <MapPin
                        size={14}
                        className="text-orange-500"
                      />

                      {event.location}

                    </div>

                  </div>

                </div>

              </motion.article>

            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          PAST EVENTS
      ===================================================== */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">

        <div className="mx-auto max-w-[1400px]">

          <motion.div
            {...fadeUp}
            className="mb-12"
          >

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Archive
            </p>

            <h2 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              PAST Static
            </h2>

          </motion.div>

          {pastEvents.length > 0 ? (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {pastEvents.map((event, index) => (

                <motion.div
                  {...fadeUp}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.07,
                  }}
                  key={event.id}
                >

                  <Link
                    href={event.href}
                    className="group block"
                  >

                    <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#111]">

                      <div
                        className="absolute inset-0 bg-cover bg-center grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        style={{
                          backgroundImage: `url('${event.image}')`,
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6">

                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">
                          {event.date}
                        </p>

                        <h3 className="mt-2 text-3xl font-black">
                          {event.title}
                        </h3>

                      </div>

                    </div>

                  </Link>

                </motion.div>

              ))}

            </div>

          ) : (

            /* EMPTY ARCHIVE */

            <motion.div
              {...fadeUp}
              className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0d0d0d] px-6 py-16 sm:px-10 sm:py-20"
            >

              <div className="absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-orange-600/[0.06] blur-[100px]" />

              <div className="relative z-10 max-w-xl">

                <Sparkles
                  size={25}
                  className="mb-7 text-orange-500"
                />

                <h3 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
                  THE ARCHIVE IS
                  <span className="text-white/25"> JUST BEGINNING.</span>
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/40">
                  Past static experiences, crowd moments, photographs and
                  aftermovies will live here.
                </p>

              </div>

            </motion.div>

          )}

        </div>
      </section>

      {/* =====================================================
          CALENDAR CTA
      ===================================================== */}

      <section className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">

        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[30px] bg-orange-500 p-7 text-black sm:p-10 lg:p-14"
        >

          <div className="absolute -right-20 -top-32 text-[250px] font-black leading-none text-black/[0.05] sm:text-[350px]">
            K
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-12 lg:flex-row lg:items-end">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50">
                Never Miss The Next One
              </p>

              <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                SEE WHAT'S COMING
                <br />
                TO static.
              </h2>

            </div>

            <Link
              href="/events"
              className="group flex w-fit items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-black"
            >
              Event Calendar

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

        </motion.div>

      </section>

      {/* =====================================================
          MINI FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.06] px-5 py-8 sm:px-8 lg:px-12">

        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 text-[11px] text-white/25 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 static. All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <Link
              href="/sponsors"
              className="transition hover:text-white"
            >
              Sponsors
            </Link>

            <Link
              href="/rules"
              className="transition hover:text-white"
            >
              Rules
            </Link>

            <span>
              Culture × Crowd × static
            </span>

          </div>

        </div>

      </footer>

    </main>
  )
}