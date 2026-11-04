'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import Image from 'next/image'
import Link from 'next/link'

import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Expand,
  Instagram,
  MapPin,
  Pause,
  Play,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react'

import { Navbar } from '@/components/navbar'

/* =========================================================
   EVENT DATA
========================================================= */

const eventDetails = [
  {
    id: 'date',
    icon: CalendarDays,
    label: 'Date',
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
    id: 'experience',
    icon: Users,
    label: 'Experience',
    value: 'static Community Event',
  },
]

/* =========================================================
   MOCK MEDIA

   Later replace src with:
   /events/media-1.jpg
   etc.
========================================================= */


  const media = [
  {
    id: 'spiderverse-01',
    src: '/1.jpg',
    alt: 'Spiderverse event crowd',
    type: 'photo',
    size: 'large',
  },
  {
    id: 'spiderverse-02',
    src: '/2.jpg',
    alt: 'Spiderverse live event',
    type: 'photo',
    size: 'normal',
  },
  {
    id: 'spiderverse-03',
    src: '/3.jpg',
    alt: 'Spiderverse stage',
    type: 'photo',
    size: 'normal',
  },
  {
    id: 'spiderverse-04',
    src: '/4.jpg',
    alt: 'Spiderverse atmosphere',
    type: 'photo',
    size: 'tall',
  },
  {
    id: 'spiderverse-05',
    src: '/5.jpg',
    alt: 'Spiderverse crowd',
    type: 'photo',
    size: 'normal',
  },
  {
    id: 'spiderverse-06',
    src: '/6.jpg',
    alt: 'Spiderverse memories',
    type: 'photo',
    size: 'normal',
  },
]
  



/* =========================================================
   GENERAL ANIMATION
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

export default function SpiderversePage() {
  const heroRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
const [isMuted, setIsMuted] = useState(false)
const [audioBlocked, setAudioBlocked] = useState(false)

const [selectedMedia, setSelectedMedia] = useState<
  (typeof media)[number] | null
>(null)

  /* =========================================================
     HERO SCROLL
  ========================================================= */

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })

  const videoScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.08]
  )

  const videoOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [1, 1, 0.25]
  )

  const darkness = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [0.15, 0.4, 0.9]
  )

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45],
    [1, 1, 0]
  )

  const titleY = useTransform(
    scrollYProgress,
    [0, 0.45],
    [0, -90]
  )

  const archiveOpacity = useTransform(
    scrollYProgress,
    [0.48, 0.72],
    [0, 1]
  )

  const archiveY = useTransform(
    scrollYProgress,
    [0.48, 0.8],
    [80, 0]
  )

  /* =========================================================
   AUTOPLAY WITH SOUND
========================================================= */

useEffect(() => {
  const video = videoRef.current

  if (!video) return

  let cancelled = false

  const startWithSound = async () => {
    try {
      /*
       * Attempt exactly what we want:
       * autoplay + audible audio.
       */
      video.muted = false
      video.defaultMuted = false
      video.volume = 1

      await video.play()

      if (cancelled) return

      setIsPlaying(true)
      setIsMuted(false)
      setAudioBlocked(false)
    } catch {
      /*
       * Browser blocked audible autoplay.
       *
       * Keep the visual experience alive by playing muted.
       */
      if (cancelled) return

      video.muted = true
      video.defaultMuted = true

      try {
        await video.play()

        if (cancelled) return

        setIsPlaying(true)
        setIsMuted(true)
        setAudioBlocked(true)
      } catch {
        if (cancelled) return

        setIsPlaying(false)
        setIsMuted(true)
        setAudioBlocked(true)
      }
    }
  }

  startWithSound()

  return () => {
    cancelled = true
  }
}, [])

/* =========================================================
   ENABLE AUDIO ON FIRST USER INTERACTION IF BROWSER
   BLOCKED AUDIBLE AUTOPLAY
========================================================= */

useEffect(() => {
  if (!audioBlocked) return

  const enableAudio = async () => {
    const video = videoRef.current

    if (!video) return

    try {
      video.muted = false
      video.defaultMuted = false
      video.volume = 1

      await video.play()

      setIsPlaying(true)
      setIsMuted(false)
      setAudioBlocked(false)
    } catch {
      // Browser still hasn't granted playback.
    }
  }

  window.addEventListener('pointerdown', enableAudio, {
    once: true,
  })

  window.addEventListener('keydown', enableAudio, {
    once: true,
  })

  return () => {
    window.removeEventListener('pointerdown', enableAudio)
    window.removeEventListener('keydown', enableAudio)
  }
}, [audioBlocked])

  /* =========================================================
     PAUSE WHEN USER SCROLLS DOWN

     Resume if they return to the opening.
  ========================================================= */

  useEffect(() => {
    const unsubscribe = scrollYProgress.on(
      'change',
      (progress) => {
        const video = videoRef.current

        if (!video) return

        if (progress >= 0.5) {
          if (!video.paused) {
            video.pause()
            setIsPlaying(false)
          }

          return
        }

        if (progress <= 0.25 && video.paused) {
          video
            .play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch(() => {
              setIsPlaying(false)
            })
        }
      }
    )

    return unsubscribe
  }, [scrollYProgress])

  /* =========================================================
     VIDEO CONTROLS
  ========================================================= */

  const togglePlay = async () => {
    const video = videoRef.current

    if (!video) return

    if (video.paused) {
      try {
        await video.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current

    if (!video) return

    const nextMuted = !video.muted

    video.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] text-white">
      <Navbar />

      {/* =====================================================
          CINEMATIC PAST EVENT HERO
      ===================================================== */}

      <section
        ref={heroRef}
        className="relative h-[190svh] bg-black"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">

          {/* VIDEO */}

          <motion.div
            style={{
              scale: videoScale,
              opacity: videoOpacity,
            }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src="/videos/spider.mp4"
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* DARKNESS */}

          <motion.div
            style={{
              opacity: darkness,
            }}
            className="pointer-events-none absolute inset-0 bg-black"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />

          {/* RED / ORANGE ATMOSPHERE */}

          <div className="pointer-events-none absolute -right-40 top-[20%] h-[600px] w-[600px] rounded-full bg-red-600/10 blur-[160px]" />

          <div className="pointer-events-none absolute -left-40 bottom-[10%] h-[450px] w-[450px] rounded-full bg-orange-600/[0.07] blur-[150px]" />

          {/* GRID */}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
              backgroundSize: '70px 70px',
            }}
          />

          {/* ================================================
              BACK BUTTON
          ================================================= */}

          <div className="absolute left-5 top-24 z-50 sm:left-8 lg:left-12">
            <Link
              href="/events"
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 transition hover:text-orange-500 sm:text-xs"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-1"
              />

              All Events
            </Link>
          </div>

          {/* ================================================
              INITIAL TITLE
          ================================================= */}

          <motion.div
            style={{
              opacity: titleOpacity,
              y: titleY,
            }}
            className="pointer-events-none absolute inset-0 z-20 flex items-end"
          >
            <div className="mx-auto w-full max-w-[1500px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">

              {/* PAST EVENT */}

              <div className="mb-5 flex items-center gap-3">
                <span className="h-[1px] w-10 bg-orange-500" />

                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
                  static Archive / Past Event
                </p>
              </div>

              {/* TITLE */}

              <h1 className="max-w-6xl text-[14vw] font-black leading-[0.78] tracking-[-0.065em] sm:text-[10vw] lg:text-[7rem] xl:text-[8.5rem]">
                REMINISCE
                <span className="block text-orange-500">
                  
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-6 text-white/55 sm:text-base">
                One day. One crowd. A chapter from the Static archive.
              </p>

              <div className="mt-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/45 sm:text-xs">
                <ArrowDown
                  size={14}
                  className="animate-bounce text-orange-500"
                />

                Scroll Through The Memory
              </div>
            </div>
          </motion.div>

          {/* ================================================
              ARCHIVE REVEAL
          ================================================= */}

          <motion.div
            style={{
              opacity: archiveOpacity,
              y: archiveY,
            }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center"
          >
            <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
                This Happened.
              </p>

              <h2 className="mt-5 max-w-5xl text-5xl font-black leading-[0.88] tracking-[-0.055em] sm:text-7xl lg:text-9xl">
                THE DAY
                <br />

                <span className="text-white/25">
                  WE REMEMBER.
                </span>
              </h2>

              <p className="mt-7 max-w-lg text-sm leading-7 text-white/50 sm:text-base">
                The video stops.
                <br />
                The memories don&apos;t.
              </p>
            </div>
          </motion.div>

          {/* ================================================
              CONTROLS
          ================================================= */}

          <div className="absolute bottom-5 right-5 z-50 flex gap-2 sm:bottom-7 sm:right-7">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xl transition hover:bg-white hover:text-black sm:h-11 sm:w-11"
            >
              {isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xl transition hover:bg-white hover:text-black sm:h-11 sm:w-11"
            >
              {isMuted ? (
                <VolumeX size={17} />
              ) : (
                <Volume2 size={17} />
              )}
            </button>
          </div>

          {/* PROGRESS */}

          <motion.div
            style={{
              scaleX: scrollYProgress,
            }}
            className="absolute bottom-0 left-0 right-0 z-[60] h-[2px] origin-left bg-orange-500"
          />
        </div>
      </section>

      {/* =====================================================
          EVENT STORY
      ===================================================== */}

      <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <div className="pointer-events-none absolute -left-52 top-0 h-[500px] w-[500px] rounded-full bg-orange-600/[0.05] blur-[150px]" />

        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              The Story
            </p>
          </motion.div>

          <motion.div {...fadeUp}>
            <h2 className="max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
              IT HAPPENED.
              <br />

              <span className="text-white/25">
                WE KEPT THE MEMORIES.
              </span>
            </h2>

            <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
              <p className="text-sm leading-7 text-white/50 sm:text-base">
                Reminisce was a Static experience built around people,
                music, atmosphere and a crowd that became part of the night
                instead of simply watching it.
              </p>

              <p className="text-sm leading-7 text-white/50 sm:text-base">
                This page now lives as part of the Static archive — a place
                for photographs, videos and moments captured during the
                event.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          EVENT DETAILS
      ===================================================== */}

      <section className="border-y border-white/[0.06] bg-[#0a0a0a] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...fadeUp}
            className="mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Event Details
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              REMINISCE.
            </h2>
          </motion.div>

          <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {eventDetails.map((detail, index) => {
              const Icon = detail.icon

              return (
                <div
                  key={detail.id}
                  className="border-b border-r border-white/10"
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                    }}
                    className="min-h-[200px] p-7 lg:p-8"
                  >
                    <Icon
                      size={21}
                      className="text-orange-500"
                    />

                    <p className="mt-12 text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">
                      {detail.label}
                    </p>

                    <p className="mt-2 text-lg font-bold">
                      {detail.value}
                    </p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          MEDIA ARCHIVE HEADER
      ===================================================== */}

      <section
        id="media"
        className="px-5 pb-10 pt-24 sm:px-8 sm:pb-14 sm:pt-32 lg:px-12"
      >
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...fadeUp}
            className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <Camera
                  size={16}
                  className="text-orange-500"
                />

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                  Event Archive
                </p>
              </div>

              <h2 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                THE
                <br />

                <span className="text-white/25">
                  MEMORIES.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-white/40">
              Moments captured from Reminisce. Tap any photograph to
              experience it fullscreen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          MEDIA GALLERY
      ===================================================== */}

      <section className="px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12">
        <div className="mx-auto max-w-[1400px]">

          {/* FIRST FEATURED IMAGE */}

          <motion.button
            {...fadeUp}
            type="button"
            onClick={() => setSelectedMedia(media[0])}
            className="group relative block h-[55svh] min-h-[450px] w-full overflow-hidden rounded-[24px] border border-white/10 text-left sm:h-[70svh] lg:rounded-[32px]"
          >
            <Image
              src={media[0].src}
              alt={media[0].alt}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-500">
                  REMINISCE Archive
                </p>

                <p className="mt-2 text-xl font-bold sm:text-2xl">
                  The Crowd
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 backdrop-blur-xl transition group-hover:bg-white group-hover:text-black">
                <Expand size={17} />
              </div>
            </div>
          </motion.button>

          {/* MOSAIC */}

          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-12">
            {media.slice(1).map((item, index) => {
              let classes =
                'relative min-h-[260px] overflow-hidden rounded-[20px] border border-white/10'

              if (index === 0) {
                classes +=
                  ' col-span-2 h-[420px] lg:col-span-7 lg:h-[600px]'
              }

              if (index === 1) {
                classes +=
                  ' col-span-2 h-[420px] lg:col-span-5 lg:h-[600px]'
              }

              if (index === 2) {
                classes +=
                  ' col-span-1 h-[330px] lg:col-span-4 lg:h-[430px]'
              }

              if (index === 3) {
                classes +=
                  ' col-span-1 h-[330px] lg:col-span-4 lg:h-[430px]'
              }

              if (index === 4) {
                classes +=
                  ' col-span-2 h-[360px] lg:col-span-4 lg:h-[430px]'
              }

              return (
                <motion.button
                  key={item.id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.1,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.05,
                  }}
                  type="button"
                  onClick={() => setSelectedMedia(item)}
                  className={`${classes} group`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />

                  <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/30" />

                  <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 opacity-0 backdrop-blur-xl transition group-hover:opacity-100">
                    <Expand size={14} />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          QUOTE / MEMORY
      ===================================================== */}

      <section className="border-y border-white/[0.06] bg-[#0a0a0a] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-[1400px]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
            static Archive
          </p>

          <h2 className="mt-7 max-w-6xl text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
            THE EVENT ENDED.
            <br />

            <span className="text-white/20">
              THE STORY DIDN&apos;T.
            </span>
          </h2>
        </motion.div>
      </section>

      {/* =====================================================
          NEXT EVENTS CTA
      ===================================================== */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[30px] bg-orange-500 p-7 text-black sm:p-12 lg:p-16"
        >
          <div className="pointer-events-none absolute -bottom-20 -right-10 select-none text-[250px] font-black leading-none text-black/[0.05]">
            K
          </div>

          <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50">
                Reminisce Was Then
              </p>

              <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[0.93] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                WHAT&apos;S THE
                <br />
                NEXT static?
              </h2>
            </div>

            <Link
              href="/events"
              className="group flex w-fit items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-black"
            >
              Upcoming Events

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          INSTAGRAM
      ===================================================== */}

      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <motion.div {...fadeUp}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
              More Memories
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              FOLLOW THE static.
            </h2>
          </motion.div>

          <motion.a
            {...fadeUp}
            href="https://www.instagram.com/staticislive_/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold transition hover:border-orange-500/30 hover:bg-orange-500/10"
          >
            <Instagram
              size={17}
              className="text-orange-500"
            />

            @staticislive_

            <ArrowRight
              size={15}
              className="text-white/30 transition-transform group-hover:translate-x-1"
            />
          </motion.a>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.06] bg-[#050505] px-5 pb-8 pt-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[19vw] font-black leading-[0.7] tracking-[-0.075em] sm:text-[15vw] lg:text-[9rem]">
            D<span className="text-orange-500">static</span>
          </p>

          <div className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/40">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>

              <Link
                href="/events"
                className="transition hover:text-white"
              >
                Events
              </Link>

              <Link
                href="/about"
                className="transition hover:text-white"
              >
                About
              </Link>

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
            </div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">
              Culture × Crowd × static
            </p>
          </div>

          <div className="mt-8 text-[10px] text-white/20">
            © 2026 static. All rights reserved.
          </div>
        </div>
      </footer>

      {/* =====================================================
          IMAGE LIGHTBOX
      ===================================================== */}

      {selectedMedia && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl sm:p-8"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedMedia(null)}
            aria-label="Close image"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 transition hover:bg-white hover:text-black sm:right-8 sm:top-8"
          >
            <X size={18} />
          </button>

          <div
            className="relative h-[80svh] w-full max-w-6xl overflow-hidden rounded-[20px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedMedia.src}
              alt={selectedMedia.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  )
}