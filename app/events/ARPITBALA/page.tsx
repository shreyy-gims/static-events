'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

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
  Headphones,
  Instagram,
  MapPin,
  Mic2,
  Music2,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react'

import { Navbar } from '@/components/navbar'

/* =========================================================
   DATA
========================================================= */

const highlights = [
  {
    id: 'monthly-listeners',
    icon: Headphones,
    value: '2.8M+',
    label: 'Monthly Listeners',
  },
  {
    id: 'catalog-streams',
    icon: Music2,
    value: '343M+',
    label: 'Catalog Streams',
  },
  {
    id: 'spotify-followers',
    icon: Users,
    value: '360K+',
    label: 'Spotify Followers',
  },
]

const tracks = [
  {
    id: 'bargad',
    number: '01',
    title: 'Bargad',
  },
  {
    id: 'maharani',
    number: '02',
    title: 'Maharani',
  },
  {
    id: 'ik-kudi',
    number: '03',
    title: 'Ik Kudi',
  },
  {
    id: 'rakhlo-tum-chupaake',
    number: '04',
    title: 'Rakhlo Tum Chupaake',
  },
  {
    id: 'pyari-amaanat',
    number: '05',
    title: 'Pyari Amaanat',
  },
  {
    id: 'gulabo',
    number: '06',
    title: 'Gulabo',
  },
]

const experiences = [
  {
    id: 'live-performance',
    number: '01',
    icon: Mic2,
    title: 'Live Performance',
    description:
      'A high-energy live set built around music, crowd interaction and the unmistakable personality Arpit brings to the stage.',
  },
  {
    id: 'crowd-energy',
    number: '02',
    icon: Users,
    title: 'Crowd Energy',
    description:
      'Sing-alongs, reactions and shared moments designed for an audience that wants to be part of the performance.',
  },
  {
    id: 'culture-moments',
    number: '03',
    icon: Camera,
    title: 'Culture Moments',
    description:
      'A night made to live beyond the venue through photographs, reels, crowd videos and memories.',
  },
  {
    id: 'static-experience',
    number: '04',
    icon: Sparkles,
    title: 'static Experience',
    description:
      'Production, visual identity, audience experiences and cultural energy brought together under one static night.',
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

export default function ArtistOnePage() {
  const videoSectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [needsSoundInteraction, setNeedsSoundInteraction] = useState(false)

  /* =========================================================
     SCROLL PROGRESS
  ========================================================= */

  const { scrollYProgress } = useScroll({
    target: videoSectionRef,
    offset: ['start start', 'end end'],
  })

  /* =========================================================
     VIDEO EFFECTS
  ========================================================= */

  const videoScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.08]
  )

  const videoOpacity = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [1, 1, 0.35]
  )

  const darkOverlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [0.2, 0.3, 0.65, 0.9]
  )

  /* =========================================================
     OPENING TITLE
  ========================================================= */

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.35],
    [1, 1, 0]
  )

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.35],
    [0, -100]
  )

  /* =========================================================
     ARTIST STORY
  ========================================================= */

  const storyOpacity = useTransform(
    scrollYProgress,
    [0.35, 0.52, 0.78, 0.92],
    [0, 1, 1, 0]
  )

  const storyY = useTransform(
    scrollYProgress,
    [0.35, 0.55],
    [100, 0]
  )

  /* =========================================================
     FINAL VIDEO MESSAGE
  ========================================================= */

  const finalOpacity = useTransform(
    scrollYProgress,
    [0.78, 0.92],
    [0, 1]
  )

  const finalY = useTransform(
    scrollYProgress,
    [0.78, 0.95],
    [70, 0]
  )

  /* =========================================================
     AUTO PLAY / PAUSE
  ========================================================= */

  useEffect(() => {
  const video = videoRef.current

  if (!video) return

  const startVideo = async () => {
    try {
      // Try sound autoplay first
      video.muted = false
      video.volume = 1

      await video.play()

      setIsPlaying(true)
      setIsMuted(false)
      setNeedsSoundInteraction(false)
    } catch {
      // Browser blocked sound autoplay.
      // Continue the cinematic video muted.
      video.muted = true

      try {
        await video.play()

        setIsPlaying(true)
        setIsMuted(true)
        setNeedsSoundInteraction(true)
      } catch {
        setIsPlaying(false)
        setNeedsSoundInteraction(true)
      }
    }
  }

  startVideo()
}, [])

const enterWithSound = async () => {
  const video = videoRef.current

  if (!video) return

  video.muted = false
  video.volume = 1

  try {
    await video.play()

    setIsMuted(false)
    setIsPlaying(true)
    setNeedsSoundInteraction(false)
  } catch {
    setIsPlaying(false)
  }
}
  
  useEffect(() => {
  const video = videoRef.current

  if (!video) return

  const startVideo = async () => {
    try {
      // First try autoplay WITH sound
      video.muted = false
      video.volume = 1

      await video.play()

      setIsPlaying(true)
      setIsMuted(false)
    } catch {
      // Browser blocked autoplay with audio.
      // Fall back to muted autoplay.
      video.muted = true

      try {
        await video.play()

        setIsPlaying(true)
        setIsMuted(true)
      } catch {
        setIsPlaying(false)
      }
    }
  }

  startVideo()
}, [])

  useEffect(() => {
    const unsubscribe = scrollYProgress.on(
      'change',
      (progress) => {
        const video = videoRef.current

        if (!video) return

        /*
         * Keep video running through the cinematic portion.
         * Pause near the end as the page transitions into content.
         */

        if (progress >= 0.84) {
          if (!video.paused) {
            video.pause()
            setIsPlaying(false)
          }

          return
        }

        /*
         * If visitor scrolls upward again,
         * resume the video.
         */

        if (progress <= 0.72 && video.paused) {
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
          CINEMATIC VIDEO INTRO
      ===================================================== */}

      <section
        ref={videoSectionRef}
        className="relative h-[260svh] bg-black"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden bg-black">

          {needsSoundInteraction && (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    type="button"
    onClick={enterWithSound}
    className="
      absolute
      left-1/2
      top-1/2
      z-[100]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      border
      border-white/20
      bg-black/50
      px-6
      py-4
      text-xs
      font-black
      uppercase
      tracking-[0.22em]
      text-white
      backdrop-blur-xl
      transition
      hover:border-orange-500/50
      hover:bg-orange-500
      hover:text-black
    "
  >
    <span className="flex items-center gap-3">
      <Volume2 size={17} />
      Enter With Sound
    </span>
  </motion.button>
)}
          {/* ================================================
              VIDEO
          ================================================= */}

          <motion.div
            style={{
              scale: videoScale,
              opacity: videoOpacity,
            }}
            className="absolute inset-0"
          >
            <video
  ref={videoRef}
  src="/videos/arpit.mp4"
  autoPlay
  playsInline
  loop
  preload="metadata"
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  className="
    h-full
    w-full
    object-cover
    object-center
    max-sm:object-[50%_center]
  "
/>
          </motion.div>

          {/* ================================================
              CINEMATIC OVERLAYS
          ================================================= */}

          <motion.div
            style={{
              opacity: darkOverlayOpacity,
            }}
            className="pointer-events-none absolute inset-0 bg-black"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />

          {/* Orange atmosphere */}

          <div className="pointer-events-none absolute -right-48 top-[20%] h-[600px] w-[600px] rounded-full bg-orange-600/10 blur-[160px]" />

          {/* Subtle grid */}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
              backgroundSize: '70px 70px',
            }}
          />

          {/* ================================================
              BACK TO EVENTS
          ================================================= */}

          <div className="absolute left-5 top-24 z-40 sm:left-8 lg:left-12">
            <Link
              href="/events"
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 transition hover:text-orange-500 sm:text-xs"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-1"
              />

              All Events
            </Link>
          </div>

          {/* ================================================
              FIRST SCREEN
          ================================================= */}

          <motion.div
            style={{
              opacity: heroOpacity,
              y: heroY,
            }}
            className="pointer-events-none absolute inset-0 z-10 flex items-end"
          >
            <div className="mx-auto w-full max-w-[1500px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-[1px] w-9 bg-orange-500 sm:w-12" />

                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
                  static Presents
                </p>
              </div>

              <h1 className="text-[13vw] font-black leading-[0.78] tracking-[-0.06em] sm:text-[10vw] md:text-[8vw] lg:text-[6.5rem] xl:text-[7.5rem]">
  ARPIT

  <span className="block text-orange-500">
    BALA.
  </span>
</h1>

              <div className="mt-8 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white/45 sm:text-xs">
                <ArrowDown
                  size={5}
                  className="animate-bounce text-orange-500"
                />

                Scroll To Enter
              </div>
            </div>
          </motion.div>

          {/* ================================================
              SECOND SCREEN — ARTIST STORY
          ================================================= */}

          <motion.div
            style={{
              opacity: storyOpacity,
              y: storyY,
            }}
            className="pointer-events-none absolute inset-0 z-20 flex items-end"
          >
            <div className="mx-auto w-full max-w-[1500px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
              <div className="max-w-5xl">
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
                  The Artist
                </p>

                <h2 className="mt-5 text-4xl font-black leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                  MUSIC.
                  <br />

                  INTERNET
                  <br />

                  <span className="text-white/30">
                    CULTURE.
                  </span>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
                  A distinctive creative presence where music, personality
                  and internet culture collide.
                </p>

                {/* Mini statistics */}

                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5 sm:gap-x-12">
                  <div>
                    <p className="text-2xl font-black tracking-tight sm:text-3xl">
                      2.8M+
                    </p>

                    <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 sm:text-[9px]">
                      Monthly Listeners
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-black tracking-tight sm:text-3xl">
                      343M+
                    </p>

                    <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 sm:text-[9px]">
                      Catalog Streams
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-black tracking-tight sm:text-3xl">
                      360K+
                    </p>

                    <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 sm:text-[9px]">
                      Spotify Followers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================================================
              THIRD SCREEN — FINAL REVEAL
          ================================================= */}

          <motion.div
            style={{
              opacity: finalOpacity,
              y: finalY,
            }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center"
          >
            <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
                static × Arpit Bala
              </p>

              <h2 className="mt-5 max-w-5xl text-5xl font-black leading-[0.88] tracking-[-0.055em] sm:text-7xl lg:text-9xl">
                BHILAI,
                <br />

                <span className="text-white/30">
                  YOUR TURN.
                </span>
              </h2>

              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/50 sm:text-sm">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={15}
                    className="text-orange-500"
                  />

                  Bhilai, Chhattisgarh
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={15}
                    className="text-orange-500"
                  />

                  Date Revealing Soon
                </div>

                <div className="flex items-center gap-2">
                  <Zap
                    size={15}
                    className="text-orange-500"
                  />

                  Venue Revealing Soon
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================================================
              VIDEO CONTROLS
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

          {/* Scroll progress */}

          <motion.div
            style={{
              scaleX: scrollYProgress,
            }}
            className="absolute bottom-0 left-0 right-0 z-[60] h-[2px] origin-left bg-orange-500"
          />
        </div>
      </section>

      {/* =====================================================
          EVENT INTRO
      ===================================================== */}

      <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
        <div className="pointer-events-none absolute -left-52 top-0 h-[500px] w-[500px] rounded-full bg-orange-600/[0.05] blur-[150px]" />

        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Live In Bhilai
            </p>
          </motion.div>

          <motion.div {...fadeUp}>
            <h2 className="max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
              ONE ARTIST.
              <br />
              ONE CROWD.
              <br />

              <span className="text-white/25">
                ONE NIGHT OF static.
              </span>
            </h2>

            <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
              <p className="text-sm leading-7 text-white/50 sm:text-base">
                static brings Arpit Bala to Bhilai for a live experience
                where music, internet culture and a crowd ready to sing
                every word come together.
              </p>

              <p className="text-sm leading-7 text-white/50 sm:text-base">
                From crowd interaction to visual production and fan
                experiences, the night is designed to feel bigger than
                simply watching an artist perform.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          NUMBERS
      ===================================================== */}

      <section className="border-y border-white/[0.06] bg-[#0a0a0a] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1400px] sm:grid-cols-3">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon

            return (
              <div
                key={highlight.id}
                className="border-b border-white/[0.08] sm:border-b-0 sm:border-r"
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                  }}
                  className="py-10 sm:px-7 sm:py-14 lg:px-10"
                >
                  <Icon
                    size={20}
                    className="mb-8 text-orange-500"
                  />

                  <p className="text-5xl font-black tracking-[-0.05em] sm:text-4xl lg:text-6xl">
                    {highlight.value}
                  </p>

                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/35">
                    {highlight.label}
                  </p>
                </motion.div>
              </div>
            )
          })}
        </div>

        <div className="mx-auto max-w-[1400px] border-t border-white/[0.06] py-4">
          <p className="text-[9px] leading-5 text-white/20">
            Public streaming figures are indicative and may change over time.
          </p>
        </div>
      </section>

      {/* =====================================================
          TRACKS
      ===================================================== */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...fadeUp}
            className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                The Sound
              </p>

              <h2 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                YOU KNOW
                <br />

                <span className="text-white/25">
                  THE WORDS.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-white/35">
              Some of the tracks that have become part of Arpit Bala&apos;s
              growing music catalogue.
            </p>
          </motion.div>

          <div className="border-t border-white/10">
            {tracks.map((track, index) => (
              <div key={track.id}>
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
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
                    duration: 0.45,
                    delay: index * 0.04,
                  }}
                  className="group flex items-center justify-between border-b border-white/10 py-5 transition-all duration-300 hover:px-3 sm:py-6"
                >
                  <div className="flex items-center gap-5 sm:gap-8">
                    <span className="text-[10px] font-bold text-white/20">
                      {track.number}
                    </span>

                    <h3 className="text-xl font-bold tracking-[-0.025em] transition group-hover:text-orange-500 sm:text-2xl">
                      {track.title}
                    </h3>
                  </div>

                  <Music2
                    size={17}
                    className="text-white/15 transition group-hover:text-orange-500"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPERIENCE
      ===================================================== */}

      <section
        id="experience"
        className="border-y border-white/[0.06] bg-[#0a0a0a] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...fadeUp}
            className="mb-14 max-w-4xl"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              The Night
            </p>

            <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
              DON&apos;T JUST
              <br />
              WATCH IT.
              <br />

              <span className="text-white/25">
                BE IN IT.
              </span>
            </h2>
          </motion.div>

          <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((experience, index) => {
              const Icon = experience.icon

              return (
                <div
                  key={experience.id}
                  className="border-b border-r border-white/10"
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.07,
                    }}
                    className="group min-h-[300px] p-7 transition-colors duration-300 hover:bg-white/[0.025] lg:min-h-[350px] lg:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <Icon
                        size={25}
                        strokeWidth={1.5}
                        className="text-orange-500"
                      />

                      <span className="text-[10px] font-bold text-white/20">
                        {experience.number}
                      </span>
                    </div>

                    <div className="mt-16 lg:mt-28">
                      <h3 className="text-xl font-bold sm:text-2xl">
                        {experience.title}
                      </h3>

                      <p className="mt-4 text-sm leading-6 text-white/40">
                        {experience.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          EVENT REVEAL
      ===================================================== */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <motion.div
          {...fadeUp}
          className="relative mx-auto min-h-[500px] max-w-[1400px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0d0d0d] p-7 sm:p-12 lg:p-16"
        >
          {/* Background text */}

          <div className="pointer-events-none absolute -bottom-10 -right-5 select-none text-[150px] font-black leading-none tracking-[-0.08em] text-white/[0.025] sm:text-[260px] lg:text-[350px]">
            static
          </div>

          {/* Glow */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[140px]" />

          <div className="relative z-10 flex min-h-[370px] flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                Event Information
              </p>

              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                BHILAI,
                <br />

                <span className="text-white/25">
                  GET READY.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                Date, venue and ticket information will be revealed through
                official static channels.
              </p>
            </div>

            <div className="mt-14 grid gap-7 sm:grid-cols-3">
              <div className="border-t border-white/10 pt-5">
                <MapPin
                  size={18}
                  className="mb-4 text-orange-500"
                />

                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">
                  City
                </p>

                <p className="mt-2 font-semibold">
                  Bhilai, Chhattisgarh
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <CalendarDays
                  size={18}
                  className="mb-4 text-orange-500"
                />

                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">
                  Date
                </p>

                <p className="mt-2 font-semibold">
                  Revealing Soon
                </p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <Zap
                  size={18}
                  className="mb-4 text-orange-500"
                />

                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/25">
                  Venue
                </p>

                <p className="mt-2 font-semibold">
                  Revealing Soon
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          SAFETY STRIP
      ===================================================== */}

      <section className="border-y border-white/[0.06] bg-[#0a0a0a] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            {...fadeUp}
            className="flex flex-col justify-between gap-8 md:flex-row md:items-center"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <ShieldCheck
                  size={21}
                  className="text-orange-500"
                />
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  Good static. Safe static.
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                  Check event entry, venue and safety policies before
                  attending.
                </p>
              </div>
            </div>

            <Link
              href="/rules"
              className="group flex w-fit items-center gap-3 text-sm font-semibold text-white/60 transition hover:text-orange-500"
            >
              Event Rules

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SPONSOR CTA
      ===================================================== */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[30px] bg-orange-500 p-7 text-black sm:p-10 lg:p-14"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 select-none text-[220px] font-black leading-none text-black/[0.05]">
            D
          </div>

          <div className="relative z-10 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/50">
                Brands × static
              </p>

              <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                PUT YOUR BRAND
                <br />
                INSIDE THE MOMENT.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-6 text-black/60">
                Partner with static through event visibility, experiences,
                activations and audience engagement.
              </p>
            </div>

            <Link
              href="/sponsors"
              className="group flex w-fit items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-black"
            >
              Sponsorships

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          FOLLOW
      ===================================================== */}

      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <motion.div {...fadeUp}>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
              Follow The static
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              DON&apos;T MISS THE REVEAL.
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
              <Link
                href="/"
                className="transition hover:text-white"
              >
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
    </main>
  )
}