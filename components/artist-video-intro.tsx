'use client'

import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  ArrowDown,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react'

export function ArtistVideoIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  /*
   * Video:
   * visible at beginning
   * slowly darkens as artist information appears
   */

  const videoOpacity = useTransform(
    scrollYProgress,
    [0, 0.62, 0.9],
    [1, 1, 0.2]
  )

  const videoScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.08]
  )

  const darkness = useTransform(
    scrollYProgress,
    [0, 0.4, 0.85],
    [0.2, 0.35, 0.85]
  )

  /*
   * Intro text disappears
   */

  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.32],
    [1, 1, 0]
  )

  const introY = useTransform(
    scrollYProgress,
    [0, 0.32],
    [0, -80]
  )

  /*
   * Artist details appear
   */

  const detailsOpacity = useTransform(
    scrollYProgress,
    [0.42, 0.65],
    [0, 1]
  )

  const detailsY = useTransform(
    scrollYProgress,
    [0.42, 0.7],
    [100, 0]
  )

  /*
   * Pause video once user reaches artist details.
   * Resume if they scroll back to the beginning.
   */

  useEffect(() => {
    const unsubscribe = scrollYProgress.on(
      'change',
      (progress) => {
        const video = videoRef.current

        if (!video) return

        if (progress > 0.68) {
          if (!video.paused) {
            video.pause()
            setIsPlaying(false)
          }
        } else if (progress < 0.55) {
          if (video.paused) {
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
      }
    )

    return unsubscribe
  }, [scrollYProgress])

  /*
   * Try autoplay when component mounts
   */

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    video.muted = true

    video
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(() => {
        setIsPlaying(false)
      })
  }, [])

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
    <section
      ref={sectionRef}
      className="relative h-[220svh] bg-black"
    >
      {/* ==============================
          STICKY VIDEO
      ============================== */}

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{
            opacity: videoOpacity,
            scale: videoScale,
          }}
          className="absolute inset-0"
        >
          <video
            ref={videoRef}
            src="/videos/arpit.mp4"
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            className="h-full w-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </motion.div>

        {/* ==================================
            CINEMATIC OVERLAYS
        ================================== */}

        <motion.div
          style={{
            opacity: darkness,
          }}
          className="pointer-events-none absolute inset-0 bg-black"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />

        {/* Orange atmosphere */}

        <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[150px]" />

        {/* ==================================
            OPENING TEXT
        ================================== */}

        <motion.div
          style={{
            opacity: introOpacity,
            y: introY,
          }}
          className="pointer-events-none absolute inset-0 z-10 flex items-end"
        >
          <div className="mx-auto w-full max-w-[1500px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[1px] w-10 bg-orange-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
                static Presents
              </span>
            </div>

            <h1 className="text-[18vw] font-black leading-[0.72] tracking-[-0.07em] sm:text-[14vw] lg:text-[9rem] xl:text-[11rem]">
              ARPIT

              <span className="block text-orange-500">
                BALA.
              </span>
            </h1>

            <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
              <ArrowDown
                size={16}
                className="animate-bounce text-orange-500"
              />

              Scroll to enter
            </div>
          </div>
        </motion.div>

        {/* ==================================
            DETAILS REVEAL
        ================================== */}

        <motion.div
          style={{
            opacity: detailsOpacity,
            y: detailsY,
          }}
          className="pointer-events-none absolute inset-0 z-20 flex items-end"
        >
          <div className="mx-auto w-full max-w-[1500px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
            <div className="max-w-4xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
                The Artist
              </p>

              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
                MUSIC.
                <br />

                INTERNET
                <br />

                <span className="text-white/30">
                  CULTURE.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
                Music, personality and internet culture collide in a live
                experience built around crowd energy, interaction and moments
                that live beyond the stage.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <p className="text-2xl font-black sm:text-3xl">
                    2.8M+
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
                    Monthly Listeners
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black sm:text-3xl">
                    343M+
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
                    Catalog Streams
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black sm:text-3xl">
                    360K+
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/35">
                    Spotify Followers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ==================================
            VIDEO CONTROLS
        ================================== */}

        <div className="absolute bottom-5 right-5 z-30 flex gap-2 sm:bottom-7 sm:right-7">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xl transition hover:bg-white hover:text-black"
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xl transition hover:bg-white hover:text-black"
          >
            {isMuted ? (
              <VolumeX size={17} />
            ) : (
              <Volume2 size={17} />
            )}
          </button>
        </div>

        {/* Progress indicator */}

        <motion.div
          style={{
            scaleX: scrollYProgress,
          }}
          className="absolute bottom-0 left-0 right-0 z-40 h-[2px] origin-left bg-orange-500"
        />
      </div>
    </section>
  )
}