'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Instagram,
  MapPin,
  Pause,
  Play,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'

// Replace this with your VIGAM video path when ready.
const EVENT_VIDEO = '/videos/raftaar.mp4'

const eventDetails = [
  {
    id: 'date',
    icon: CalendarDays,
    label: 'Year',
    value: '2026',
  },
  {
    id: 'location',
    icon: MapPin,
    label: 'Location',
    value: 'Bhilai, Chhattisgarh',
  },
  {
    id: 'status',
    icon: Sparkles,
    label: 'Status',
    value: 'Event Completed',
  },
  {
    id: 'event',
    icon: Users,
    label: 'Event',
    value: 'VIGAM 2026',
  },
]

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/sponsors', label: 'Partners' },
  { href: '/rules', label: 'Rules' },
]

export default function VigamPage() {
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const manuallyPaused = useRef(false)
  const reduceMotion = useReducedMotion()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoFailed, setVideoFailed] = useState(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  const videoScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, reduceMotion ? 1 : 1.08],
  )

  const videoOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [1, 1, 0.25],
  )

  const darkness = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [0.15, 0.4, 0.9],
  )

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45],
    [1, 1, 0],
  )

  const titleY = useTransform(
    scrollYProgress,
    [0, 0.45],
    [0, reduceMotion ? 0 : -90],
  )

  const archiveOpacity = useTransform(
    scrollYProgress,
    [0.48, 0.72],
    [0, 1],
  )

  const archiveY = useTransform(
    scrollYProgress,
    [0.48, 0.8],
    [reduceMotion ? 0 : 80, 0],
  )

  function reveal(delay = 0) {
    return {
      initial: reduceMotion
        ? (false as const)
        : { opacity: 0, y: 28 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.15 },
      transition: { duration: 0.6, delay },
    }
  }

  // Start muted. Sound can be enabled using the sound button.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true

    if (reduceMotion) {
      video.pause()
      return
    }

    if (!manuallyPaused.current) {
      void video.play().catch(() => {})
    }

    return () => {
      video.pause()
    }
  }, [reduceMotion])

  // Pause when leaving the opening section.
  useEffect(() => {
    return scrollYProgress.on('change', progress => {
      const video = videoRef.current
      if (!video) return

      if (progress >= 0.5) {
        video.pause()
        return
      }

      if (
        progress <= 0.25 &&
        video.paused &&
        !manuallyPaused.current &&
        !reduceMotion
      ) {
        void video.play().catch(() => {})
      }
    })
  }, [scrollYProgress, reduceMotion])

  async function togglePlay() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      manuallyPaused.current = false

      try {
        await video.play()
      } catch {
        setIsPlaying(false)
      }
    } else {
      manuallyPaused.current = true
      video.pause()
    }
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] text-white selection:bg-orange-500 selection:text-black">
      <Navbar />

      {/* Cinematic hero */}
      <section
        ref={heroRef}
        className="relative h-[190svh] bg-black"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">
          {/* Video background */}
          <motion.div
            style={{
              scale: videoScale,
              opacity: videoOpacity,
            }}
            className="absolute inset-0"
          >
            {!videoFailed && (
              <video
                ref={videoRef}
                src={EVENT_VIDEO}
                muted
                playsInline
                loop
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={event =>
                  setIsMuted(event.currentTarget.muted)
                }
                onError={() => {
                  setVideoFailed(true)
                  setIsPlaying(false)
                }}
                className="h-full w-full object-cover object-center"
              />
            )}
          </motion.div>

          {/* Overlays */}
          <motion.div
            style={{ opacity: darkness }}
            className="pointer-events-none absolute inset-0 bg-black"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />

          <div className="pointer-events-none absolute -right-40 top-[20%] h-[600px] w-[600px] rounded-full bg-red-600/10 blur-[160px]" />

          <div className="pointer-events-none absolute -left-40 bottom-[10%] h-[450px] w-[450px] rounded-full bg-orange-600/[.07] blur-[150px]" />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[.025]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
              backgroundSize: '70px 70px',
            }}
          />

          {/* Back link */}
          <Link
            href="/events"
            className="group absolute left-5 top-28 z-40 flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-white/60 transition hover:text-orange-500 sm:left-8 lg:left-12"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            All Events
          </Link>

          {/* Opening title */}
          <motion.div
            style={{
              opacity: titleOpacity,
              y: titleY,
            }}
            className="pointer-events-none absolute inset-0 z-20 flex items-end"
          >
            <div className="mx-auto w-full max-w-[1500px] px-5 pb-24 sm:px-8 sm:pb-28 lg:px-12">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-orange-500" />

                <p className="text-[9px] font-black uppercase tracking-[.3em] text-orange-500 sm:text-xs">
                  STATIC Archive / Past Event
                </p>
              </div>

              <h1 className="text-[clamp(4.5rem,17vw,15rem)] font-black uppercase leading-[.8] tracking-[-.075em]">
                VIGAM
                <span className="block text-orange-500">
                  2026
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
                The energy. The people. The moments.
                A look back at VIGAM 2026.
              </p>

              <div className="mt-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[.23em] text-white/45 sm:text-xs">
                <ArrowDown
                  size={15}
                  className="text-orange-500 motion-safe:animate-bounce"
                />
                Scroll through the story
              </div>
            </div>
          </motion.div>

          {/* Scroll reveal */}
          <motion.div
            style={{
              opacity: archiveOpacity,
              y: archiveY,
            }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center"
          >
            <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
              <p className="text-[10px] font-black uppercase tracking-[.3em] text-orange-500">
                VIGAM 2026 / Looking Back
              </p>

              <h2 className="mt-6 text-5xl font-black leading-[.9] tracking-[-.055em] sm:text-7xl lg:text-9xl">
                THE MOMENTS
                <br />
                <span className="text-white/30">
                  WE REMEMBER.
                </span>
              </h2>

              <p className="mt-7 text-sm leading-7 text-white/50 sm:text-base">
                The event ended.
                <br />
                The memories stayed.
              </p>
            </div>
          </motion.div>

          {/* Video controls */}
          {!videoFailed && (
            <div className="absolute bottom-5 right-5 z-40 flex gap-2 sm:bottom-7 sm:right-7">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-xl transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
              >
                {isPlaying ? (
                  <Pause size={17} />
                ) : (
                  <Play size={17} />
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                aria-pressed={!isMuted}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-xl transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"
              >
                {isMuted ? (
                  <VolumeX size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
            </div>
          )}

          {/* Scroll progress */}
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="absolute inset-x-0 bottom-0 z-40 h-[2px] origin-left bg-orange-500"
          />
        </div>
      </section>

      {/* Event story */}
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <div className="pointer-events-none absolute -left-52 top-0 h-[500px] w-[500px] rounded-full bg-orange-600/[.05] blur-[150px]" />

        <div className="relative mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[.6fr_1.4fr] lg:gap-20">
          <motion.p
            {...reveal()}
            className="text-xs font-bold uppercase tracking-[.3em] text-orange-500"
          >
            The Story
          </motion.p>

          <motion.div {...reveal()}>
            <h2 className="text-4xl font-black leading-[.95] tracking-[-.045em] sm:text-5xl lg:text-7xl">
              VIGAM 2026.
              <br />
              <span className="text-white/25">
                A CHAPTER WORTH KEEPING.
              </span>
            </h2>

            <div className="mt-10 grid gap-7 border-t border-white/10 pt-8 md:grid-cols-2">
              <p className="text-sm leading-7 text-white/50 sm:text-base">
                The people, the atmosphere, and the moments that
                made VIGAM 2026 memorable. A look back at an event
                that became part of our story.
              </p>

              <p className="text-sm leading-7 text-white/50 sm:text-base">
                This chapter lives on in the STATIC archive.
                A reminder of the energy we shared and the
                experiences we carry forward.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event details */}
      <section className="border-y border-white/[.06] bg-[#0A0A0A] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <motion.div {...reveal()} className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[.3em] text-orange-500">
              Event Details
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-.045em] sm:text-5xl">
              VIGAM 2026.
            </h2>
          </motion.div>

          <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {eventDetails.map((detail, index) => {
              const Icon = detail.icon

              return (
                <motion.div
                  key={detail.id}
                  {...reveal(index * 0.06)}
                  className="min-h-[200px] border-b border-r border-white/10 p-7 lg:p-8"
                >
                  <Icon
                    size={21}
                    className="text-orange-500"
                  />

                  <p className="mt-12 text-[9px] font-bold uppercase tracking-[.25em] text-white/30">
                    {detail.label}
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    {detail.value}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-0 h-96 w-96 rounded-full bg-orange-500/[.05] blur-[120px]"
        />

        <motion.div
          {...reveal()}
          className="relative mx-auto max-w-[1400px]"
        >
          <p className="text-xs font-bold uppercase tracking-[.3em] text-orange-500">
            STATIC Archive / VIGAM 2026
          </p>

          <h2 className="mt-7 text-5xl font-black leading-[.92] tracking-[-.05em] sm:text-6xl lg:text-8xl">
            THE EVENT ENDED.
            <br />
            <span className="text-white/20">
              THE STORY DIDN&apos;T.
            </span>
          </h2>
        </motion.div>
      </section>

      {/* Next events */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <motion.div
          {...reveal()}
          className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[30px] bg-orange-500 p-7 text-black sm:p-12 lg:p-16"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-8 select-none text-[300px] font-black leading-none text-black/[.06]"
          >
            ✳
          </span>

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.3em] text-black/55">
                VIGAM 2026 was then
              </p>

              <h2 className="mt-5 text-4xl font-black leading-[.93] tracking-[-.05em] sm:text-5xl lg:text-7xl">
                WHAT&apos;S NEXT
                <br />
                WITH STATIC?
              </h2>
            </div>

            <Link
              href="/events"
              className="group inline-flex min-h-12 w-fit shrink-0 items-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-black"
            >
              Explore Events
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Instagram */}
      <section className="border-t border-white/[.06] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <motion.div {...reveal()}>
            <p className="text-[10px] font-bold uppercase tracking-[.3em] text-orange-500">
              Stay Connected
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
              FOLLOW STATIC.
            </h2>
          </motion.div>

          <motion.a
            {...reveal()}
            href="https://www.instagram.com/staticislive_/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-white/15 bg-white/[.04] px-6 py-4 text-sm font-semibold transition hover:border-orange-500/40 hover:bg-orange-500/10"
          >
            <Instagram
              size={18}
              className="text-orange-500"
            />

            @staticislive_

            <ArrowRight
              size={16}
              className="text-white/40 transition-transform group-hover:translate-x-1"
            />
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[.06] bg-[#050505] px-5 pb-8 pt-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <Link
            href="/"
            className="inline-block text-[20vw] font-black leading-[.8] tracking-[-.075em] text-orange-500 sm:text-[16vw] lg:text-[10rem]"
          >
            STATIC
          </Link>

          <div className="mt-12 flex flex-col gap-7 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap gap-x-6 gap-y-4 text-xs text-white/45"
            >
              {footerLinks.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition hover:text-orange-500"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <p className="text-[10px] uppercase tracking-[.2em] text-white/25">
              Culture × Crowd × STATIC
            </p>
          </div>

          <p className="mt-8 text-[10px] text-white/25">
            © {new Date().getFullYear()} STATIC. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}