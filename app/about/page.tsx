'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Heart, MapPin, Music2, Plus, Sparkles, Users, X, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'

const lime = '#CEFF50'
const ease = [0.22, 1, 0.36, 1] as const

const eventTypes = [
  { number: '01', title: 'FAREWELLS', eyebrow: 'THE LAST DANCE', description: 'One last night together. A proper send-off, built around the people and the memories.', symbol: '✳' },
  { number: '02', title: 'FRESHERS', eyebrow: 'THE FIRST CHAPTER', description: 'First impressions that last. New faces, new friendships, and a room full of possibility.', symbol: '↗' },
  { number: '03', title: 'PRIVATE EVENTS', eyebrow: 'YOUR NIGHT, YOUR RULES', description: 'More intimate experiences with a personal touch, designed around the occasion and the crowd.', symbol: '✦' },
]

const values = [
  { number: '01', title: 'THE ENERGY', text: 'The music, the room, the anticipation. Every detail contributes to the feeling.' },
  { number: '02', title: 'THE PEOPLE', text: 'The crowd is never just an audience. They are the reason the night exists.' },
  { number: '03', title: 'THE MEMORY', text: 'We want people to leave with something bigger than a ticket stub.' },
]

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 45, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .13 }} transition={{ duration: .8, delay, ease }}>{children}</motion.div>
}

function Kicker({ children, index }: { children: React.ReactNode; index: string }) {
  return <p className="mb-7 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.25em] text-[#CEFF50] sm:text-xs"><span className="h-px w-8 bg-[#CEFF50]" /> {index} / {children}</p>
}

function CTA({ href, children, outline = false }: { href: string; children: React.ReactNode; outline?: boolean }) {
  return <Link href={href} className={`group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-xs font-black uppercase tracking-[.13em] transition-all hover:-translate-y-1 ${outline ? 'border border-white/30 text-white hover:border-[#CEFF50]' : 'bg-[#CEFF50] text-[#080A07] hover:bg-white hover:shadow-[0_0_35px_#CEFF5040]'}`}>{children}<ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
}

function Marquee() {
  return <div aria-hidden="true" className="overflow-hidden border-y border-[#CEFF50] bg-[#CEFF50] py-4 text-[#080A07]"><div className="about-marquee flex w-max">{[0, 1].map(copy => <div key={copy} className="flex shrink-0 items-center gap-9 pr-9">{['MADE TO BE FELT', 'NOT JUST AN EVENT', 'THE CROWD IS THE CULTURE', 'STATIC'].map(word => <span key={word} className="flex shrink-0 items-center gap-9 whitespace-nowrap text-lg font-black uppercase tracking-[-.04em] sm:text-2xl"><span>✳</span>{word}</span>)}</div>)}</div></div>
}

export default function AboutPage() {
  const reduced = useReducedMotion()
  const [expanded, setExpanded] = useState<number | null>(null)
  return <main className="min-h-screen overflow-x-hidden bg-[#080A07] text-[#F5F6EE] selection:bg-[#CEFF50] selection:text-black">
    <style>{`
      @keyframes aboutMarquee { to { transform: translateX(-50%); } }
      @keyframes aboutRotate { to { transform: rotate(360deg); } }
      .about-marquee { animation: aboutMarquee 26s linear infinite; }
      .about-rotate { animation: aboutRotate 28s linear infinite; }
      .about-grid { background-image: linear-gradient(#CEFF500e 1px, transparent 1px), linear-gradient(90deg,#CEFF500e 1px,transparent 1px); background-size: 64px 64px; }
      @media (prefers-reduced-motion: reduce) { .about-marquee,.about-rotate { animation: none !important; } }
    `}</style>
    <Navbar />

    <section className="relative isolate flex min-h-[740px] items-center overflow-hidden px-5 pb-24 pt-40 sm:min-h-[840px] sm:px-9 lg:px-14">
      <Image src="/staticbg.jpeg" alt="Atmosphere at a live event" fill priority sizes="100vw" className="-z-30 object-cover opacity-40" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#080A07] via-[#080A07]/80 to-[#080A07]/40" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#080A07] via-transparent to-[#080A07]/55" />
      <div className="about-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -right-32 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-[#CEFF50]/10 blur-[130px]" />
      <div className="mx-auto w-full max-w-[1500px]">
        <motion.p initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="mb-9 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.27em] text-[#CEFF50] sm:text-xs"><span className="h-2 w-2 animate-pulse rounded-full bg-[#CEFF50]" /> THE STORY BEHIND THE NOISE / BHILAI, INDIA</motion.p>
        <motion.h1 initial={reduced ? false : { opacity: 0, y: 65, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1, ease }} className="text-[clamp(5rem,13.5vw,14rem)] font-black uppercase leading-[.75] tracking-[-.1em]">WE ARE<br /><span className="text-[#CEFF50]">STATIC<span className="align-top text-[.45em]">✳</span></span></motion.h1>
        <motion.div initial={reduced ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .8 }} className="mt-12 flex flex-col justify-between gap-8 border-t border-white/25 pt-7 lg:flex-row lg:items-end">
          <p className="max-w-2xl text-lg font-semibold leading-snug sm:text-2xl lg:text-3xl">We turn ordinary gatherings into <span className="text-[#CEFF50]">the nights people talk about.</span></p>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[.16em] text-white/55"><ArrowDownRight size={27} className="text-[#CEFF50]" /> SCROLL TO KNOW US</div>
        </motion.div>
      </div>
    </section>

    <Marquee />

    <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.4fr_1fr]">
      <Reveal><Kicker index="01">OUR STORY</Kicker><p className="max-w-xs text-sm leading-7 text-white/45">Not another event company. A creative culture built around people, music and moments.</p></Reveal>
      <Reveal><h2 className="text-[clamp(3.3rem,8vw,9rem)] font-black uppercase leading-[.88] tracking-[-.08em]">WE DON'T<br />JUST <span className="italic text-[#CEFF50]">HOST.</span><br />WE CREATE<br />A FEELING.</h2><div className="mt-10 grid gap-7 border-t border-white/20 pt-8 text-sm leading-7 text-white/60 sm:grid-cols-2 sm:text-base"><p>STATIC started with a simple idea: a great event should feel different from the moment you walk in to the moment you leave.</p><p>From college celebrations to private gatherings, we're building experiences that bring the right people, atmosphere and energy together.</p></div></Reveal>
    </div></section>

    <section className="relative overflow-hidden border-y border-white/15 bg-[#11160F] px-5 py-24 sm:px-9 lg:px-14 lg:py-32"><div className="mx-auto max-w-[1500px]">
      <Reveal><Kicker index="02">THE TRACK RECORD</Kicker><div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="text-[clamp(8rem,26vw,25rem)] font-black leading-[.75] tracking-[-.12em] text-[#CEFF50]">06<span className="align-top text-[.24em]">✳</span></p><h2 className="mt-8 text-[clamp(2.8rem,6vw,6rem)] font-black uppercase leading-[.9] tracking-[-.07em]">EVENTS.<br />COUNTLESS<br /><span className="text-[#CEFF50]">MOMENTS.</span></h2></div><div className="max-w-md border-l-2 border-[#CEFF50] pl-6"><p className="text-xl font-bold leading-snug sm:text-2xl">Six events hosted so far — and we're just getting started.</p><p className="mt-5 text-sm leading-7 text-white/55">Our past events have included farewell celebrations, freshers' events and private experiences. Each one has helped shape what STATIC is becoming.</p><p className="mt-7 flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-[#CEFF50]"><MapPin size={15} /> ROOTED IN BHILAI</p></div></div></Reveal>
    </div></section>

    <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto max-w-[1500px]"><Reveal><Kicker index="03">WHAT WE'VE DONE</Kicker><h2 className="mb-12 text-[clamp(3.3rem,8vw,8.5rem)] font-black uppercase leading-[.86] tracking-[-.08em]">DIFFERENT<br /><span className="text-[#CEFF50]">NIGHTS.</span><br />SAME ENERGY.</h2></Reveal>
      <div className="border-t border-white/20">{eventTypes.map((item, index) => <Reveal key={item.number} delay={index * .06}><div className="border-b border-white/20"><button type="button" aria-expanded={expanded === index} onClick={() => setExpanded(expanded === index ? null : index)} className="group grid w-full grid-cols-[35px_1fr_40px] items-center gap-4 py-8 text-left sm:grid-cols-[65px_1fr_1fr_50px] sm:py-11"><span className="text-xs font-black text-[#CEFF50]">{item.number}</span><span className="text-[clamp(2rem,5.5vw,6rem)] font-black uppercase leading-none tracking-[-.065em] transition-transform duration-300 group-hover:translate-x-2">{item.title}</span><span className="hidden text-xs font-black uppercase tracking-[.2em] text-white/40 sm:block">{item.eyebrow}</span><span className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${expanded === index ? 'rotate-45 border-[#CEFF50] bg-[#CEFF50] text-black' : 'border-white/30 text-[#CEFF50] group-hover:border-[#CEFF50]'}`}><Plus size={20} /></span></button><AnimatePresence initial={false}>{expanded === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="grid gap-5 pb-9 sm:grid-cols-[65px_1fr]"><span className="text-5xl text-[#CEFF50]">{item.symbol}</span><p className="max-w-2xl text-base leading-8 text-white/60 sm:text-lg">{item.description}</p></div></motion.div>}</AnimatePresence></div></Reveal>)}</div>
      <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-5"><p className="max-w-xl text-sm leading-7 text-white/45">These are the types of events we've hosted, not a complete list of six individually named shows.</p><CTA href="/events" outline>EXPLORE EVENTS</CTA></Reveal>
    </div></section>

    <section className="relative overflow-hidden bg-[#CEFF50] px-5 py-24 text-[#080A07] sm:px-9 lg:px-14 lg:py-36"><div className="pointer-events-none absolute -right-16 -top-32 text-[clamp(20rem,50vw,55rem)] font-black leading-none opacity-[.06]">S</div><Reveal className="relative mx-auto max-w-[1500px]"><p className="mb-9 text-xs font-black uppercase tracking-[.26em]">✳ THE STATIC MINDSET</p><h2 className="text-[clamp(4rem,11vw,12rem)] font-black uppercase leading-[.8] tracking-[-.09em]">THE EVENT<br />ENDS.<br /><span className="italic">THE FEELING</span><br />DOESN'T.</h2><p className="mt-12 max-w-xl border-t border-black/25 pt-7 text-base font-semibold leading-8">We measure a great night by the energy in the room — and the stories people take home.</p></Reveal></section>

    <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto max-w-[1500px]"><Reveal><Kicker index="04">WHAT DRIVES US</Kicker><h2 className="mb-14 text-[clamp(3.4rem,8vw,8rem)] font-black uppercase leading-[.87] tracking-[-.08em]">THE STATIC<br /><span className="text-[#CEFF50]">FORMULA.</span></h2></Reveal><div className="grid gap-px border border-white/20 bg-white/20 md:grid-cols-3">{values.map((value, index) => <Reveal key={value.number} delay={index * .1} className="group flex min-h-[320px] flex-col justify-between bg-[#10140F] p-8 transition-colors hover:bg-[#1B2715] sm:p-10"><div className="flex items-start justify-between"><span className="text-xs font-black tracking-widest text-[#CEFF50]">{value.number} / 03</span><Zap className="text-[#CEFF50] transition-transform group-hover:rotate-12" size={27} /></div><div><h3 className="text-3xl font-black uppercase tracking-[-.05em] sm:text-4xl">{value.title}</h3><p className="mt-4 max-w-sm text-sm leading-7 text-white/55">{value.text}</p></div></Reveal>)}</div></div></section>

    <section className="border-y border-white/15 bg-[#111610] px-5 py-24 sm:px-9 lg:px-14 lg:py-32"><div className="mx-auto grid max-w-[1500px] items-center gap-12 lg:grid-cols-2"><Reveal><Kicker index="05">THE NEXT CHAPTER</Kicker><h2 className="text-[clamp(3.4rem,7vw,7rem)] font-black uppercase leading-[.88] tracking-[-.08em]">SIX DOWN.<br /><span className="text-[#CEFF50]">SO MUCH</span><br />MORE AHEAD.</h2><p className="mt-8 max-w-lg text-sm leading-7 text-white/55">We're taking everything we've learned from farewells, freshers and private events into our next wave of music, culture and live experiences.</p><div className="mt-9 flex flex-wrap gap-3"><CTA href="/events">SEE WHAT'S NEXT</CTA><CTA href="/sponsors" outline>WORK WITH US</CTA></div></Reveal><Reveal className="relative min-h-[410px] overflow-hidden border border-white/15 bg-[#1B2119] sm:min-h-[540px]"><Image src="/14.jpg" alt="Live event crowd and lights" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-65" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" /><span className="absolute left-7 top-7 -rotate-6 bg-[#CEFF50] px-5 py-3 text-xs font-black uppercase tracking-widest text-black">MORE THAN A CROWD ✳</span><p className="absolute bottom-8 left-7 right-7 text-5xl font-black uppercase leading-[.86] tracking-[-.06em] sm:text-7xl">NEVER<br />STAY STILL.</p></Reveal></div></section>

    <footer className="bg-[#060806] px-5 pb-9 pt-24 sm:px-9 lg:px-14"><div className="mx-auto max-w-[1500px]"><Reveal><p className="mb-5 text-xs font-black uppercase tracking-[.25em] text-[#CEFF50]">✳ YOU KNOW OUR STORY. NOW BE PART OF IT.</p><h2 className="text-[clamp(4rem,10vw,11rem)] font-black uppercase leading-[.8] tracking-[-.09em]">SEE YOU<br /><span className="text-[#CEFF50]">OUT THERE.</span></h2><div className="mt-10"><CTA href="/events">FIND THE NEXT DROP</CTA></div></Reveal><div className="mt-20 flex flex-col justify-between gap-8 border-t border-white/20 py-9 sm:flex-row sm:items-end"><div><Link href="/" className="text-5xl font-black tracking-[-.09em] sm:text-7xl">STATIC<span className="text-[#CEFF50]">✳</span></Link><p className="mt-3 text-xs uppercase tracking-[.2em] text-white/40">MUSIC / CULTURE / EXPERIENCES</p></div><div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-wider text-white/60"><Link href="/">HOME</Link><Link href="/events">EVENTS</Link><Link href="/sponsors">PARTNERS</Link><Link href="/rules">RULES</Link></div></div><p className="border-t border-white/10 pt-7 text-xs text-white/35">© {new Date().getFullYear()} STATIC. ALL RIGHTS RESERVED.</p></div></footer>
  </main>
}
