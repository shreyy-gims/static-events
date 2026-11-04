'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Instagram,
  MapPin,
  Music2,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'

import { Navbar } from '@/components/navbar'

const features = [
  {
    icon: Music2,
    number: '01',
    title: 'Live Music',
    description:
      'Concerts and live performances built around artists, sound, energy and unforgettable crowd moments.',
  },
  {
    icon: Users,
    number: '02',
    title: 'Community',
    description:
      'A growing community of students, creators, music lovers and young people who want something different.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Experiences',
    description:
      'From fan zones to visual installations, every detail is designed to make the night worth remembering.',
  },
  {
    icon: Zap,
    number: '04',
    title: 'Culture',
    description:
      'Music, fashion, creators, nightlife and youth culture come together under one static experience.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden border-b border-white/10 px-4 pb-12 pt-28 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-[-10%] top-[5%] h-[400px] w-[400px] rounded-full bg-orange-600/10 blur-[140px] sm:h-[600px] sm:w-[600px]" />

          <div className="absolute bottom-[-20%] left-[-10%] h-[350px] w-[350px] rounded-full bg-red-600/10 blur-[130px]" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '70px 70px',
            }}
          />

          {/* Big background text */}
          <div className="absolute right-[-30px] top-[15%] select-none text-[35vw] font-black leading-none tracking-[-0.09em] text-white/[0.015] lg:text-[400px]">
            K
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            {/* Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-orange-500 sm:w-12" />

              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-orange-500 sm:text-xs">
                About static
              </span>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:items-end">
              <div>
                <h1 className="max-w-5xl text-[17vw] font-black uppercase leading-[0.76] tracking-[-0.075em] sm:text-[90px] md:text-[110px] lg:text-[135px]">
                  We Create
                  <span className="block text-orange-500">static.</span>
                </h1>

                <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base md:text-lg">
                  static is a youth-driven event brand creating concerts,
                  cultural experiences and unforgettable nights built around
                  music, people and pure crowd energy.
                </p>
              </div>

              {/* Hero side text */}
              <div className="border-l border-white/10 pl-6 lg:pl-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                  Our Philosophy
                </p>

                <p className="mt-4 text-xl font-bold leading-snug sm:text-2xl">
                  Not another event.
                  <br />
                  Not another night.
                  <br />
                  <span className="text-orange-500">
                    Something worth remembering.
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="overflow-hidden border-b border-white/10 bg-orange-500 py-3">
        <div className="whitespace-nowrap text-center text-[10px] font-black uppercase tracking-[0.28em] text-black sm:text-xs">
          MUSIC &nbsp; • &nbsp; CULTURE &nbsp; • &nbsp; PEOPLE &nbsp; • &nbsp;
          EXPERIENCE &nbsp; • &nbsp; static &nbsp; • &nbsp; MUSIC &nbsp; •
          &nbsp; CULTURE &nbsp; • &nbsp; PEOPLE
        </div>
      </div>

      {/* ================= WHO WE ARE ================= */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 sm:text-xs">
              01 / Who We Are
            </p>

            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Born For
              <br />
              The Crowd.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8"
          >
            <p>
              static was built around a simple idea — young people deserve
              experiences that feel bigger than just another event.
            </p>

            <p>
              We bring together artists, music, visual production, creators,
              brands and communities to create nights that people don&apos;t
              simply attend. They participate in them.
            </p>

            <p>
              From the first announcement to the final song of the night, our
              goal is to make every interaction feel like part of one complete
              experience.
            </p>

            <div className="pt-3">
              <span className="text-lg font-bold text-white">
                The crowd isn&apos;t the audience.
              </span>

              <span className="ml-2 text-lg font-bold text-orange-500">
                It&apos;s part of the show.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= static DNA ================= */}
      <section className="border-y border-white/10 bg-[#090909] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 sm:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 sm:text-xs">
                02 / What Defines Us
              </p>

              <h2 className="mt-4 text-4xl font-black uppercase tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                The static DNA
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-zinc-500">
              Four ideas behind every experience we create.
            </p>
          </div>

          <div className="grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group min-h-[310px] border-b border-r border-white/10 p-6 transition-colors duration-300 hover:bg-orange-500 sm:p-7 lg:min-h-[370px]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center border border-white/10 transition-colors group-hover:border-black/20">
                      <Icon
                        size={20}
                        className="text-orange-500 transition-colors group-hover:text-black"
                      />
                    </div>

                    <span className="text-xs font-bold text-zinc-700 group-hover:text-black/50">
                      {feature.number}
                    </span>
                  </div>

                  <div className="mt-24 lg:mt-32">
                    <h3 className="text-xl font-black uppercase transition-colors group-hover:text-black">
                      {feature.title}
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-zinc-500 transition-colors group-hover:text-black/70">
                      {feature.description}
                    </p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= OUR VISION ================= */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden border border-white/10 lg:grid-cols-2">
            {/* Orange section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex min-h-[400px] flex-col justify-between bg-orange-500 p-7 text-black sm:p-10 lg:min-h-[570px] lg:p-14"
            >
              <div className="flex items-center justify-between">
                <Zap size={28} />

                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  static / 2026
                </span>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em]">
                  Our Vision
                </p>

                <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                  Bigger
                  <br />
                  Than A
                  <br />
                  Concert.
                </h2>
              </div>
            </motion.div>

            {/* Dark section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col justify-between bg-[#0b0b0b] p-7 sm:p-10 lg:p-14"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 sm:text-xs">
                  Where We&apos;re Going
                </p>

                <p className="mt-7 max-w-xl text-xl font-medium leading-relaxed text-zinc-200 sm:text-2xl">
                  We want to build a recognizable youth entertainment platform
                  starting from Bhilai and create experiences capable of
                  bringing artists, communities and brands together.
                </p>
              </div>

              <div className="mt-16 border-t border-white/10 pt-8">
                <p className="text-sm leading-7 text-zinc-500">
                  static is being built one event, one crowd and one unforgettable
                  night at a time.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= HOME ================= */}
      <section className="border-y border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 sm:text-xs">
                03 / Our Home
              </p>

              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl">
                Bhilai,
                <span className="block text-orange-500">Chhattisgarh.</span>
              </h2>

              <p className="mt-7 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                static begins here. Our goal is to contribute to Bhilai&apos;s
                growing youth culture while creating experiences capable of
                attracting audiences from across Chhattisgarh and beyond.
              </p>
            </div>

            <div className="relative min-h-[300px] overflow-hidden border border-white/10 bg-[#0b0b0b] sm:min-h-[400px]">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                  backgroundSize: '45px 45px',
                }}
              />

              <div className="relative flex h-full min-h-[300px] flex-col justify-between p-7 sm:min-h-[400px] sm:p-10">
                <MapPin size={32} className="text-orange-500" />

                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                    Coordinates
                  </span>

                  <p className="mt-3 text-2xl font-black uppercase sm:text-3xl">
                    From Bhilai.
                    <br />
                    <span className="text-zinc-600">For Everywhere.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-7xl overflow-hidden bg-orange-500 px-6 py-12 text-black sm:px-10 sm:py-16 lg:px-14 lg:py-20"
        >
          <div className="absolute right-[-20px] top-[-70px] select-none text-[250px] font-black leading-none text-black/[0.05]">
            K
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] sm:text-xs">
                Be Part Of It
              </p>

              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.85] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
                Experience
                <br />
                The static.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/events"
                className="group flex min-h-14 min-w-[210px] items-center justify-between bg-black px-5 text-xs font-black uppercase tracking-[0.15em] text-white"
              >
                Explore Events

                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/sponsors"
                className="flex min-h-14 min-w-[210px] items-center justify-between border border-black/30 px-5 text-xs font-black uppercase tracking-[0.15em] transition hover:bg-black/5"
              >
                Partner With Us
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= SOCIAL ================= */}
      <section className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black uppercase">static Events</p>

            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-600">
              Music • Culture • Community
            </p>
          </div>

          <a
            href="https://www.instagram.com/staticislive_/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-sm font-bold text-zinc-400 transition hover:text-orange-500"
          >
            <Instagram size={18} />
            @staticislive_
            <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
    </main>
  )
}