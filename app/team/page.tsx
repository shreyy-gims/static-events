'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Crown,
  Instagram,
  Plus,
  Users,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'

// ─── EDIT DETAILS HERE ────────────────────────────────────────

const founder = {
  name: 'anshh',
  role: 'Founder',
  instagram: 'https://www.instagram.com/anshhhyrrrr/',
  photo: '/found.jpeg', 
}

const teamMembers = [
  { name: 'Kevin', role: 'Operational Head', instagram: 'https://www.instagram.com/kevingivesup/', photo: '/kavya2.jpeg' },
  
]

const STATIC_INSTAGRAM = 'https://www.instagram.com/staticislive_/' // Add STATIC's Instagram profile link.

// ─────────────────────────────────────────────────────────────

function getInstagramLink(value: string) {
  const username = value
    .trim()
    .replace(/^https?:\/\/(?:www\.)instagram\.com\//i, '')
    .replace(/^@/, '')
    .split(/[/?#]/)[0]

  return /^[a-zA-Z0-9._]{1,30}$/.test(username)
    ? `https://www.instagram.com/${username}/`
    : null
}

function Photo({
  src,
  name,
  featured = false,
}: {
  src: string
  name: string
  featured?: boolean
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showPhoto = Boolean(src.trim()) && failedSrc !== src

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#12170E]">
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ? `${name}, STATIC team` : 'STATIC team member'}
          loading={featured ? 'eager' : 'lazy'}
          onError={() => setFailedSrc(src)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(#CEFF5010 1px,transparent 1px),linear-gradient(90deg,#CEFF5010 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div
            aria-hidden="true"
            className="absolute h-48 w-48 rounded-full border border-[#CEFF50]/10"
          />

          <div
            aria-hidden="true"
            className="absolute h-28 w-28 rounded-full bg-[#CEFF50]/10 blur-3xl"
          />

          <div className="relative text-center">
            <span
              aria-hidden="true"
              className={`block font-black leading-none text-[#CEFF50]/25 ${
                featured ? 'text-[140px]' : 'text-8xl'
              }`}
            >
              ✳
            </span>

            <span className="mt-5 block text-[9px] font-bold uppercase tracking-[.3em] text-white/25">
              Photo coming soon
            </span>
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080A07]/70 via-transparent to-transparent"
      />
    </div>
  )
}

export default function TeamPage() {
  const reduceMotion = useReducedMotion()
  const staticInstagram = getInstagramLink(STATIC_INSTAGRAM)

  function reveal(delay = 0) {
    return {
      initial: reduceMotion ? (false as const) : { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.15 },
      transition: { duration: 0.65, delay },
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#080A07] text-[#F5F6EE] selection:bg-[#CEFF50] selection:text-black">
      <Navbar />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(#CEFF5008 1px,transparent 1px),linear-gradient(90deg,#CEFF5008 1px,transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 top-32 -z-10 h-[600px] w-[600px] rounded-full bg-[#CEFF50]/[.07] blur-[130px]"
      />

      <div className="mx-auto max-w-[1400px] px-5 pt-36 sm:px-9 sm:pt-44 lg:px-14">
        {/* Page heading */}
        <motion.section {...reveal()} className="pb-12 sm:pb-16">
          <p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.22em] text-[#CEFF50]">
            <span className="h-2 w-2 rounded-full bg-[#CEFF50]" />
            Meet the people behind STATIC
          </p>

          <h1 className="mt-7 text-[clamp(3.5rem,10vw,8rem)] font-black uppercase leading-[.9] tracking-[-.075em]">
            The people.
            <br />
            <span className="text-[#CEFF50]">The frequency.</span>
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-7 text-white/50">
            From the first idea to the last song. This is the crew
            bringing STATIC to life.
          </p>
        </motion.section>

        {/* Special founder section */}
        <motion.section
          {...reveal()}
          aria-labelledby="founder-heading"
          className="group relative overflow-hidden rounded-[26px] border border-[#CEFF50]/35 bg-[#10160C] shadow-[0_0_90px_rgba(206,255,80,.055)] sm:rounded-[36px]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#CEFF50] to-transparent"
          />

          <div className="grid lg:min-h-[600px] lg:grid-cols-[1fr_1.1fr]">
            {/* Founder photo */}
            <div className="relative aspect-[4/4] sm:aspect-[5/4] lg:aspect-auto">
              <Photo src={founder.photo} name={founder.name} featured />

              <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-[#CEFF50]/35 bg-black/60 px-4 py-2.5 text-[9px] font-black uppercase tracking-[.18em] text-[#CEFF50] backdrop-blur-md">
                <Crown size={14} />
                Founder / STATIC
              </div>

              <div className="absolute bottom-6 left-6 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.2em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#CEFF50]" />
                The vision behind the noise
              </div>
            </div>

            {/* Founder details */}
            <div className="relative flex flex-col justify-center overflow-hidden px-7 py-10 sm:px-11 sm:py-14 lg:px-12">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 top-0 text-[240px] font-black leading-none text-[#CEFF50]/[.035] sm:text-[330px]"
              >
                ✳
              </span>

              <p className="relative text-[10px] font-black uppercase tracking-[.25em] text-[#CEFF50]">
                The one who started it.
              </p>

              <h2
                id="founder-heading"
                className="relative mt-7 text-[clamp(4.5rem,10vw,9rem)] font-black uppercase leading-[.85] tracking-[-.08em]"
              >
                {founder.name}
                <span className="text-[#CEFF50]">.</span>
              </h2>

              <div className="relative mt-7 flex items-center gap-4">
                <span className="h-px w-12 bg-[#CEFF50]" />

                <p className="text-xs font-black uppercase tracking-[.28em] text-[#CEFF50]">
                  {founder.role}
                </p>
              </div>

              <p className="relative mt-8 max-w-sm text-lg font-medium leading-8 text-white/75 sm:text-xl">
                A vision for nights that stay with you.
              </p>

              <p className="relative mt-4 max-w-sm text-sm leading-7 text-white/40">
                Music, culture, and people. Bringing it all together
                under one name — STATIC.
              </p>

              <a
                href={founder.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group/founder relative mt-9 inline-flex min-h-13 w-fit items-center gap-3 rounded-full bg-[#CEFF50] px-7 py-4 text-[11px] font-black uppercase tracking-[.13em] text-[#080A07] transition duration-300 hover:bg-white hover:shadow-[0_0_35px_rgba(206,255,80,.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CEFF50]"
              >
                <Instagram size={18} />
                @anshhhyrrrr
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover/founder:-translate-y-1 group-hover/founder:translate-x-1"
                />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#CEFF50]/15 bg-black/20 px-6 py-4 sm:px-9">
            <span className="text-[9px] font-black uppercase tracking-[.2em] text-[#CEFF50]/70">
              Independent spirit. Shared frequency.
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[.2em] text-white/30">
              STATIC / Founder
            </span>
          </div>
        </motion.section>

        {/* Regular team cards */}
        <section className="py-20 sm:py-28">
          <motion.div
            {...reveal()}
            className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-[#CEFF50]">
                <Users size={16} />
                Organizing committee
              </p>

              <h2 className="mt-5 text-4xl font-black uppercase leading-none tracking-[-.06em] sm:text-6xl">
                Meet the crew<span className="text-[#CEFF50]">✳</span>
              </h2>
            </div>

            <p className="max-w-xs text-sm leading-7 text-white/45">
              The people making sure every detail comes together.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => {
              const instagram = getInstagramLink(member.instagram)

              return (
                <motion.article
                  key={`team-${index}`}
                  {...reveal((index % 3) * 0.06)}
                  whileHover={reduceMotion ? undefined : { y: -5 }}
                  className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#10140E] transition-colors duration-300 hover:border-[#CEFF50]/40"
                >
                  <div className="relative aspect-[4/3]">
                    <Photo src={member.photo} name={member.name} />

                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[9px] font-black tracking-[.15em] text-white/65 backdrop-blur-md">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#CEFF50]">
                      {member.role || 'Role coming soon'}
                    </p>

                    <h3 className="mt-3 break-words text-2xl font-black uppercase tracking-[-.04em]">
                      {member.name || 'Name coming soon'}
                    </h3>

                    <div className="mt-5 border-t border-white/10 pt-5">
                      {instagram ? (
                        <a
                          href={instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${member.name || 'team member'} on Instagram`}
                          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-[10px] font-bold uppercase tracking-wider text-white/70 transition hover:border-[#CEFF50] hover:text-[#CEFF50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CEFF50]"
                        >
                          <Instagram size={15} />
                          Instagram
                          <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <span className="inline-flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/25">
                          <Instagram size={15} />
                          Instagram coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}

            {/* Join card */}
            <motion.aside
              {...reveal(0.12)}
              className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[22px] border border-dashed border-[#CEFF50]/35 bg-[#CEFF50]/[.035] p-7"
            >
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#CEFF50]/10 blur-3xl"
              />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#CEFF50]/30 text-[#CEFF50]">
                <Plus size={23} />
              </div>

              <div className="relative mt-8">
                <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#CEFF50]">
                  Bring your energy
                </p>

                <h3 className="mt-4 text-4xl font-black uppercase leading-[.95] tracking-[-.06em]">
                  Your spot
                  <br />
                  in the crew.
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/50">
                  Want to be on the organizing committee?
                  DM us on Instagram.
                </p>

                {staticInstagram ? (
                  <a
                    href={staticInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/join mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#CEFF50] px-5 py-3 text-[10px] font-black uppercase tracking-wider text-[#080A07] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CEFF50]"
                  >
                    <Instagram size={16} />
                    DM us on Instagram
                    <ArrowUpRight
                      size={17}
                      className="transition-transform group-hover/join:-translate-y-0.5 group-hover/join:translate-x-0.5"
                    />
                  </a>
                ) : (
                  <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#CEFF50]/50">
                    <Instagram size={15} />
                    Instagram link coming soon
                  </span>
                )}
              </div>
            </motion.aside>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/15 py-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="w-fit text-3xl font-black tracking-[-.07em] text-[#CEFF50]"
            >
              STATIC✳
            </Link>

            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/35">
              Music. Culture. Experiences.
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[.14em] text-white/25">
              © {new Date().getFullYear()} STATIC
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}