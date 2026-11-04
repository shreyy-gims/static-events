'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'

const INTRO_KEY = 'static-animation-intro-seen'
const INTRO_DURATION = 2800

const letters = 'STATIC'.split('')
const barHeights = [16, 30, 44, 24, 54, 36, 20, 42, 28]

const ease = [0.22, 1, 0.36, 1] as const

export default function StaticIntro() {
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, 'true')
    } catch {
      // The intro still closes if browser storage is unavailable.
    }

    setVisible(false)
  }, [])

  useEffect(() => {
    // Respect visitors who prefer reduced animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    try {
      if (sessionStorage.getItem(INTRO_KEY)) return
    } catch {
      // Allow the animation when browser storage is unavailable.
    }

    setVisible(true)
  }, [])

  useEffect(() => {
    if (!visible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timeout = window.setTimeout(
      finishIntro,
      INTRO_DURATION
    )

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') finishIntro()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(timeout)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [visible, finishIntro])

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          key="static-animated-intro"
          aria-label="STATIC welcome animation"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: reduceMotion ? 0 : '-4%',
            filter: reduceMotion ? 'none' : 'blur(8px)',
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            ease,
          }}
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#080A07] text-[#F5F6EE]"
        >
          {/* Animated background grid */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.8, ease }}
            className="pointer-events-none absolute -inset-16"
            style={{
              backgroundImage:
                'linear-gradient(rgba(206,255,80,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(206,255,80,.07) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage:
                'radial-gradient(ellipse at center, black, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, black, transparent 75%)',
            }}
          />

          {/* Soft lime glow */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.65 }}
            animate={{
              opacity: [0, 0.65, 0.35],
              scale: [0.65, 1.1, 1],
            }}
            transition={{ duration: 2.6, ease: 'easeInOut' }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CEFF50]/10 blur-[100px] sm:h-[560px] sm:w-[560px]"
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-6 sm:px-10 sm:py-9">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[9px] font-black uppercase tracking-[.22em] text-white/45 sm:text-[11px]"
            >
              MUSIC / CULTURE / EXPERIENCES
            </motion.p>

            <button
              type="button"
              onClick={finishIntro}
              className="min-h-11 shrink-0 border border-white/20 px-4 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-white/65 transition hover:border-[#CEFF50] hover:text-[#CEFF50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CEFF50]"
            >
              Skip ↗
            </button>
          </div>

          {/* Main reveal */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mb-8 flex items-center gap-3 sm:mb-12"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#CEFF50]"
              />

              <p className="text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50] sm:text-xs">
                Enter the frequency
              </p>
            </motion.div>

            <h1
              aria-label="STATIC"
              className="flex items-baseline justify-center overflow-hidden pb-3 text-[clamp(3.5rem,17vw,13rem)] font-black leading-[1] tracking-[-.075em]"
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  aria-hidden="true"
                  initial={{
                    y: '115%',
                    opacity: 0,
                    rotate: 8,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                  }}
                  transition={{
                    duration: 0.85,
                    delay: 0.3 + index * 0.075,
                    ease,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}

              <motion.span
                aria-hidden="true"
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: -120,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.9,
                  ease,
                }}
                className="ml-2 inline-block self-start pt-2 text-[.38em] text-[#CEFF50] sm:ml-4"
              >
                ✳
              </motion.span>
            </h1>

            {/* Expanding divider */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.75,
                ease,
              }}
              className="mt-5 h-px w-full max-w-[660px] origin-left bg-gradient-to-r from-transparent via-[#CEFF50]/60 to-transparent"
            />

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 1.05,
                ease,
              }}
              className="mt-7 text-center text-xs font-medium tracking-wide text-white/50 sm:text-base"
            >
              Feel the noise. Live the moment.
            </motion.p>

            {/* Decorative frequency bars */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-10 flex h-14 items-center justify-center gap-1.5"
            >
              {barHeights.map((height, index) => (
                <motion.span
                  key={index}
                  animate={{
                    scaleY: [0.35, 1, 0.5, 0.8, 0.35],
                  }}
                  transition={{
                    duration: 1.2 + index * 0.08,
                    delay: index * 0.06,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="block w-[3px] origin-center rounded-full bg-[#CEFF50]"
                  style={{ height }}
                />
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative z-10 flex items-center justify-between gap-5 px-5 pb-7 text-[9px] font-bold uppercase tracking-[.18em] text-white/35 sm:px-10 sm:pb-9 sm:text-[10px]"
          >
            <span>Bhilai, India</span>
            <span>Made to be felt ↗</span>
          </motion.div>

          {/* Intro timing line */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: INTRO_DURATION / 1000,
                ease: 'linear',
              }}
              className="h-full origin-left bg-[#CEFF50]"
            />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}