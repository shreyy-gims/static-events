'use client'



import { useEffect, useRef, useState } from 'react'

import { Navbar } from '@/components/navbar'

import Link from 'next/link'

import Image from 'next/image'

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'

import { ArrowUpRight, ArrowRight, CalendarDays, MapPin, Music2, Headphones, Users, Sparkles, Camera, HeartHandshake, ShieldCheck, Instagram, ChevronDown, Plus, Minus } from 'lucide-react'



const LIME = '#CEFF50'



const events = [



  { id: 'artist1', 



    title: 'Raat Baki', 



    subtitle: 'LIVE IN BHILAI', 



    date: '21 NOV', 



    location: 'Bhilai, Chhattisgarh', 



    image: '/raat2.png', href: '/events/artist1', 



    label: 'UP NEXT' },



]



const archive = [



  { id: 'noctra', 



    title: 'REMINISCE', 



    subtitle: 'THE ARCHIVE / 2026', 



    date: '2026',



    location: 'Bhilai, Chhattisgarh', 



    image: '/spiderverse.jpeg', 



    href: '/events/noctra' },







    { id: 'cl6', 



      title: 'VIGAM', 



      subtitle: 'THE ARCHIVE / 2026', 



      date: '2026', 



      location: 'Bhilai, Chhattisgarh', 



      image: '/raftaar.jpeg', 



      href: '/events/cl6' 



    },



]



const experiences = [



  { icon: Music2, 



    index: '01', 



    title: 'LIVE SHOWS', 



    detail: 'Concerts, emerging artists and live performances that sound better in person.' 



  },







  { icon: Headphones, 



    index: '02', 



    title: 'NIGHT CULTURE', 



    detail: 'Curated parties, fresh sounds and new ways to experience the city after dark.' 



  },







  { icon: Users, 



    index: '03', 



    title: 'SOCIAL CLUB', 



    detail: 'Community-first meetups that turn strangers into familiar faces.' 



  },







  { icon: Sparkles, 



    index: '04', 



    title: 'IMMERSIVE EVENTS', 



    detail: 'Interactive worlds, creative concepts and experiences beyond the usual stage.' 



  },







  { icon: Camera, 



    index: '05', 



    title: 'CREATOR CULTURE', 



    detail: 'Spaces for filmmakers, artists, performers and the next wave of local talent.' 



  },







  { icon: HeartHandshake,



     index: '06', 



     title: 'GOOD IMPACT', 



     detail: 'Meaningful community collaborations and youth-led initiatives that give back.'



  },



]



const faqs = [



  { q: 'What is STATIC?', a: 'STATIC is a youth-focused live experiences and culture brand based in Chhattisgarh. We create events that bring music, people and ideas together.' },



  { q: 'Where do your events happen?', a: 'Our focus begins in Bhilai and the wider Chhattisgarh region. Each event page will list its confirmed venue and location.' },



  { q: 'How can I collaborate?', a: 'Brands, creators, artists and community partners can reach out through our partnerships page.' },



  { q: 'How do I find tickets and event updates?', a: 'Visit the Events page for current announcements, event details and ticket information when available.' },



]









const ease = [0.22, 1, 0.36, 1] as const



function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {

  const reduce = useReducedMotion()

  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 55, filter: 'blur(12px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .12 }} transition={{ duration: .85, delay, ease }}>{children}</motion.div>

}

function MagneticLink({ href, children, outline = false }: { href: string; children: React.ReactNode; outline?: boolean }) {

  return <Link href={href} className={`group inline-flex min-h-12 items-center justify-center gap-4 rounded-full px-6 py-3 text-xs font-black uppercase tracking-[.15em] transition-all duration-300 hover:-translate-y-1 sm:px-8 ${outline ? 'border border-white/30 bg-black/30 text-white backdrop-blur-lg hover:border-[#CEFF50]' : 'bg-[#CEFF50] text-[#090B08] hover:bg-white hover:shadow-[0_0_40px_#CEFF5050]'}`}>{children}<ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/></Link>

}

function Noise() {

  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] opacity-[.045] mix-blend-screen" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'}}/>

}

function SectionKicker({ id, children }: { id: string; children: React.ReactNode }) {

  return <div className="mb-7 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.27em] text-[#CEFF50]"><span className="h-[1px] w-8 bg-[#CEFF50]"/>{id} — {children}</div>

}

function EventPoster({ event, large = false }: { event: { title: string; subtitle: string; date: string; location: string; image: string; href: string }; large?: boolean }) {

  return <Link href={event.href} className={`static-poster group relative block isolate overflow-hidden border border-white/15 bg-[#161914] ${large ? 'min-h-[540px] lg:min-h-[680px]' : 'min-h-[440px] lg:min-h-[530px]'}`}>

    <Image src={event.image} alt={`${event.title} event poster`} fill sizes={large ? '100vw' : '(max-width: 768px) 100vw, 50vw'} className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" />

    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/15"/>

    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"/>

    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 sm:p-9"><span className="border border-[#CEFF50] bg-black/65 px-4 py-2 text-[10px] font-black uppercase tracking-[.25em] text-[#CEFF50] backdrop-blur-xl">✳ {large ? 'NEXT TRANSMISSION' : 'ARCHIVED FREQUENCY'}</span><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#CEFF50] text-black transition-transform group-hover:rotate-45"><ArrowUpRight/></span></div>

    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">

      <div className="mb-4 text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50]">{event.subtitle}</div>

      <h3 className={`font-black uppercase leading-[.83] tracking-[-.075em] ${large ? 'text-[clamp(4rem,10vw,10rem)]' : 'text-[clamp(3.4rem,7vw,6rem)]'}`}>{event.title}</h3>

      <div className="mt-7 flex flex-wrap gap-5 text-xs font-semibold text-white/75"><span className="flex items-center gap-2"><MapPin size={15} className="text-[#CEFF50]"/>{event.location}</span><span className="flex items-center gap-2"><CalendarDays size={15} className="text-[#CEFF50]"/>{event.date}</span></div>

      <div className="mt-7 inline-flex items-center gap-3 border-b border-[#CEFF50] pb-2 text-xs font-black uppercase tracking-widest">ENTER EVENT <ArrowRight size={16} className="text-[#CEFF50] transition-transform group-hover:translate-x-2"/></div>

    </div>

  </Link>

}

function Marquee({ reverse = false, light = false }: { reverse?: boolean; light?: boolean }) {

  const words = ['NO SLEEP', 'ALL ENERGY', 'AFTER DARK', 'NO ORDINARY NIGHTS', 'STATIC', 'FEEL THE FREQUENCY']

  return <div aria-hidden="true" className={`overflow-hidden border-y py-4 ${light ? 'border-[#CEFF50] bg-[#CEFF50] text-[#090B08]' : 'border-white/20 bg-[#10130E] text-white'}`}><div className={`static-track flex w-max items-center ${reverse ? 'static-reverse' : ''}`}>{[0,1].map(n=><div key={n} className="flex shrink-0 items-center gap-9 pr-9">{words.map(word=><span key={word} className="flex items-center gap-9 whitespace-nowrap text-lg font-black uppercase tracking-[-.04em] sm:text-3xl"><span className={light ? 'text-black' : 'text-[#CEFF50]'}>✳</span>{word}</span>)}</div>)}</div></div>

}


// Effects use browser APIs and existing Framer Motion; no new dependencies.
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0, raf = 0, width = 0, height = 0
    const pointer = { x: -9999, y: -9999 }
    const dots = Array.from({ length: window.innerWidth < 700 ? 32 : 85 }, () => ({ x: Math.random(), y: Math.random(), size: .6 + Math.random() * 1.5, speed: .00006 + Math.random() * .00016 }))
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width; height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top }
    const leave = () => { pointer.x = -9999; pointer.y = -9999 }
    const draw = () => {
      frame++
      ctx.clearRect(0, 0, width, height)
      dots.forEach(dot => {
        dot.y -= dot.speed
        if (dot.y < 0) dot.y = 1
        const x = dot.x * width + Math.sin(frame * .008 + dot.y * 14) * 9
        const y = dot.y * height
        const dx = x - pointer.x, dy = y - pointer.y
        const dist = Math.hypot(dx, dy)
        const force = Math.max(0, 1 - dist / 135)
        const px = x + (dist ? dx / dist * force * 42 : 0)
        const py = y + (dist ? dy / dist * force * 42 : 0)
        ctx.beginPath(); ctx.arc(px, py, dot.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(206,255,80,${.3 + force * .6})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    resize(); draw()
    const observer = new ResizeObserver(resize); observer.observe(canvas)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('pointermove', move); window.removeEventListener('pointerleave', leave) }
  }, [])
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-80" />
}

function LiquidCursor() {
  const cursor = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = cursor.current
    if (!el || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, x = -200, y = -200, tx = -200, ty = -200
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY }
    const tick = () => { x += (tx - x) * .13; y += (ty - y) * .13; el.style.transform = `translate3d(${x - 65}px, ${y - 65}px, 0)`; raf = requestAnimationFrame(tick) }
    window.addEventListener('pointermove', move, { passive: true }); tick()
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={cursor} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[130px] w-[130px] rounded-full bg-[#CEFF50]/20 blur-[35px] mix-blend-screen lg:block" />
}

function KineticWord({ children, className = '' }: { children: string; className?: string }) {
  return <span className={`static-kinetic inline-block ${className}`} aria-label={children}>
    {Array.from(children).map((letter, i) => <span aria-hidden="true" key={`${letter}-${i}`} className="static-letter inline-block" style={{ animationDelay: `${i * 55}ms` }}>{letter === ' ' ? '\u00a0' : letter}</span>)}
  </span>
}

type DJDeck = 'A' | 'B'
type DJChannel = { low: BiquadFilterNode; mid: BiquadFilterNode; high: BiquadFilterNode; filter: BiquadFilterNode; gain: GainNode; analyser: AnalyserNode }
type DJEQ = { low: number; mid: number; high: number }
const DECKS: DJDeck[] = ['A', 'B']
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const clock = (s: number) => Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00'

function Rotary({ label, value, min, max, onChange, unit = '', size = 54 }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void; unit?: string; size?: number }) {
  const pointer = useRef<{ y: number; initial: number } | null>(null)
  const pct = (value - min) / (max - min)
  return <div className="flex flex-col items-center gap-2 select-none">
    <span className="text-[9px] font-black tracking-[.16em] text-white/55">{label}</span>
    <div role="slider" tabIndex={0} aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
      onKeyDown={e => { if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); onChange(clamp(value + 1, min, max)) } if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); onChange(clamp(value - 1, min, max)) } }}
      onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); pointer.current = { y: e.clientY, initial: value } }}
      onPointerMove={e => { if (pointer.current) onChange(Math.round(clamp(pointer.current.initial + (pointer.current.y - e.clientY) * (max - min) / 160, min, max))) }}
      onPointerUp={() => { pointer.current = null }} onPointerCancel={() => { pointer.current = null }}
      className="relative cursor-ns-resize rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#CEFF50] touch-none"
      style={{ width: size, height: size, background: `conic-gradient(from 225deg,#CEFF50 ${pct * 270}deg,#2c3529 ${pct * 270}deg 270deg,transparent 270deg)` }}>
      <div className="absolute inset-[5px] rounded-full border border-white/15 shadow-[inset_0_3px_7px_#000,0_5px_8px_#000]" style={{background:'radial-gradient(circle at 35% 24%,#596057,#202721 45%,#080b09 90%)'}} />
      <div className="absolute inset-[7px]" style={{ transform: `rotate(${-135 + pct * 270}deg)` }}><div className="mx-auto h-[35%] w-[3px] rounded-full bg-[#CEFF50] shadow-[0_0_7px_#CEFF50]" /></div>
    </div>
    <span className="font-mono text-[10px] font-bold text-[#CEFF50]">{value > 0 && min < 0 ? '+' : ''}{value}{unit}</span>
  </div>
}

function DJLab() {
  const audio = useRef<Record<DJDeck, HTMLAudioElement | null>>({ A: null, B: null })
  const canvas = useRef<Record<DJDeck, HTMLCanvasElement | null>>({ A: null, B: null })
  const context = useRef<AudioContext | null>(null)
  const channels = useRef<Partial<Record<DJDeck, DJChannel>>>({})
  const urls = useRef<Partial<Record<DJDeck, string>>>({})
  const imageUrls = useRef<Partial<Record<DJDeck, string>>>({})
  const drag = useRef<Partial<Record<DJDeck, { angle: number; time: number; wasPlaying: boolean }>>>({})
  const loopIn = useRef<Partial<Record<DJDeck, number>>>({})
  const cues = useRef<Record<DJDeck, (number | null)[]>>({ A: [null, null, null, null], B: [null, null, null, null] })
  const [expanded, setExpanded] = useState(false)
  const [playing, setPlaying] = useState<Record<DJDeck, boolean>>({ A: false, B: false })
  const [names, setNames] = useState<Record<DJDeck, string>>({ A: 'STATIC PREVIEW', B: 'LOAD YOUR TRACK' })
  const [images, setImages] = useState<Record<DJDeck, string>>({ A: '/deck3.jpg', B: '/deck2.jpg' })
  const [position, setPosition] = useState<Record<DJDeck, number>>({ A: 0, B: 0 })
  const [duration, setDuration] = useState<Record<DJDeck, number>>({ A: 0, B: 0 })
  const [crossfade, setCrossfade] = useState(50)
  const [volume, setVolume] = useState<Record<DJDeck, number>>({ A: 85, B: 85 })
  const [eq, setEq] = useState<Record<DJDeck, DJEQ>>({ A: { low: 0, mid: 0, high: 0 }, B: { low: 0, mid: 0, high: 0 } })
  const [filter, setFilter] = useState<Record<DJDeck, number>>({ A: 100, B: 100 })
  const [speed, setSpeed] = useState<Record<DJDeck, number>>({ A: 100, B: 100 })
  const [cueMarks, setCueMarks] = useState<Record<DJDeck, boolean[]>>({ A: [false, false, false, false], B: [false, false, false, false] })
  const [loop, setLoop] = useState<Record<DJDeck, { start: number; end: number } | null>>({ A: null, B: null })
  const [message, setMessage] = useState('WELCOME TO THE STATIC MIXING ROOM. LOAD YOUR TRACKS.')

  const syncNodes = () => {
    DECKS.forEach(deck => {
      const ch = channels.current[deck]
      if (!ch) return
      ch.gain.gain.value = volume[deck] / 100 * (deck === 'A' ? Math.cos(crossfade / 100 * Math.PI / 2) : Math.sin(crossfade / 100 * Math.PI / 2))
      ch.low.gain.value = eq[deck].low; ch.mid.gain.value = eq[deck].mid; ch.high.gain.value = eq[deck].high
      ch.filter.frequency.value = 250 * Math.pow(80, filter[deck] / 100)
    })
  }
  useEffect(syncNodes, [volume, eq, filter, crossfade])
  useEffect(() => { DECKS.forEach(d => { if (audio.current[d]) audio.current[d]!.playbackRate = speed[d] / 100 }) }, [speed])
  useEffect(() => {
    if (!expanded) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', esc) }
  }, [expanded])
  useEffect(() => {
    let frame = 0
    const draw = () => {
      DECKS.forEach(deck => {
        const el = canvas.current[deck], ctx = el?.getContext('2d')
        if (!el || !ctx) return
        const w = el.width, h = el.height
        ctx.clearRect(0, 0, w, h)
        const analyser = channels.current[deck]?.analyser
        const values = new Uint8Array(analyser?.frequencyBinCount || 128)
        if (analyser) analyser.getByteFrequencyData(values)
        for (let i = 0; i < 90; i++) {
          const v = analyser ? values[Math.floor(i / 90 * values.length)] / 255 : 0.04
          const bh = Math.max(2, v * h * 0.85)
          ctx.fillStyle = i % 11 === 0 ? '#ffffff' : '#CEFF50'
          ctx.fillRect(i * w / 90 + 1, (h - bh) / 2, Math.max(2, w / 90 - 3), bh)
        }
        const progress = duration[deck] ? position[deck] / duration[deck] : 0
        ctx.fillStyle = '#fff'; ctx.fillRect(progress * w, 0, 2, h)
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [duration, position])
  useEffect(() => () => {
    DECKS.forEach(d => audio.current[d]?.pause())
    if (context.current) void context.current.close()
    Object.values(urls.current).forEach(url => { if (url) URL.revokeObjectURL(url) })
    Object.values(imageUrls.current).forEach(url => { if (url) URL.revokeObjectURL(url) })
  }, [])

  const initAudio = () => {
    if (!context.current) context.current = new AudioContext()
    const ctx = context.current
    DECKS.forEach(deck => {
      const element = audio.current[deck]
      if (!element || channels.current[deck]) return
      const source = ctx.createMediaElementSource(element)
      const low = ctx.createBiquadFilter(); low.type = 'lowshelf'; low.frequency.value = 250
      const mid = ctx.createBiquadFilter(); mid.type = 'peaking'; mid.frequency.value = 1200; mid.Q.value = 0.8
      const high = ctx.createBiquadFilter(); high.type = 'highshelf'; high.frequency.value = 4000
      const filterNode = ctx.createBiquadFilter(); filterNode.type = 'lowpass'
      const gain = ctx.createGain(), analyser = ctx.createAnalyser(); analyser.fftSize = 256
      source.connect(low); low.connect(mid); mid.connect(high); high.connect(filterNode); filterNode.connect(gain); gain.connect(analyser); analyser.connect(ctx.destination)
      channels.current[deck] = { low, mid, high, filter: filterNode, gain, analyser }
    })
    syncNodes()
    return ctx
  }
  const toggle = async (deck: DJDeck) => {
    const el = audio.current[deck]
    if (!el) return
    if (!el.paused) { el.pause(); setPlaying(p => ({ ...p, [deck]: false })); return }
    try { await initAudio().resume(); await el.play(); setPlaying(p => ({ ...p, [deck]: true })); setMessage(`DECK ${deck} IS LIVE — TOUCH THE PLATTER TO SCRUB.`) }
    catch { setMessage('TRACK NOT FOUND. ADD public/static-preview.mp3 / static-preview2.mp3 OR UPLOAD YOUR OWN AUDIO.') }
  }
  const uploadTrack = (deck: DJDeck, file?: File) => {
    if (!file) return
    if (!file.type.startsWith('audio/') && !/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name)) { setMessage('PLEASE CHOOSE AN AUDIO FILE.'); return }
    const el = audio.current[deck]; if (!el) return
    el.pause()
    if (urls.current[deck]) URL.revokeObjectURL(urls.current[deck]!)
    const url = URL.createObjectURL(file); urls.current[deck] = url
    el.src = url; el.load(); setNames(p => ({ ...p, [deck]: file.name })); setPlaying(p => ({ ...p, [deck]: false })); setPosition(p => ({ ...p, [deck]: 0 })); setDuration(p => ({ ...p, [deck]: 0 })); setLoop(p => ({ ...p, [deck]: null }))
    setMessage(`${file.name} LOADED TO DECK ${deck}.`)
  }
  const uploadImage = (deck: DJDeck, file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    if (imageUrls.current[deck]) URL.revokeObjectURL(imageUrls.current[deck]!)
    const url = URL.createObjectURL(file); imageUrls.current[deck] = url; setImages(p => ({ ...p, [deck]: url }))
  }
  const jogAngle = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2)
  }
  const jogStart = (deck: DJDeck, e: React.PointerEvent<HTMLDivElement>) => {
    const el = audio.current[deck]
    if (!el || !Number.isFinite(el.duration) || !el.duration) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current[deck] = { angle: jogAngle(e), time: el.currentTime, wasPlaying: !el.paused }
    el.pause(); setPlaying(p => ({ ...p, [deck]: false }))
  }
  const jogMove = (deck: DJDeck, e: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current[deck], el = audio.current[deck]
    if (!start || !el || !Number.isFinite(el.duration)) return
    let delta = jogAngle(e) - start.angle
    if (delta > Math.PI) delta -= Math.PI * 2
    if (delta < -Math.PI) delta += Math.PI * 2
    // One full turn scrubs approximately 8 seconds, in either direction.
    const time = clamp(start.time + delta / (2 * Math.PI) * 8, 0, el.duration)
    el.currentTime = time; setPosition(p => ({ ...p, [deck]: time }))
    start.angle = jogAngle(e); start.time = time
  }
  const jogEnd = (deck: DJDeck) => {
    const start = drag.current[deck]; delete drag.current[deck]
    if (start?.wasPlaying) void toggle(deck)
  }
  const setCue = (deck: DJDeck, i: number, shift: boolean) => {
    const el = audio.current[deck]; if (!el) return
    const stored = cues.current[deck][i]
    if (stored === null || shift) {
      cues.current[deck][i] = el.currentTime
      setCueMarks(p => ({ ...p, [deck]: cues.current[deck].map(v => v !== null) }))
      setMessage(`DECK ${deck} / HOT CUE ${i + 1} SET AT ${clock(el.currentTime)}.`)
    } else { el.currentTime = stored; setPosition(p => ({ ...p, [deck]: stored })) }
  }
  const loopAction = (deck: DJDeck) => {
    const el = audio.current[deck]; if (!el || !Number.isFinite(el.duration)) return
    if (loop[deck]) { setLoop(p => ({ ...p, [deck]: null })); delete loopIn.current[deck]; return }
    if (loopIn.current[deck] === undefined) { loopIn.current[deck] = el.currentTime; setMessage(`DECK ${deck} LOOP IN SET — PRESS LOOP AGAIN TO SET OUT.`) }
    else { const start = loopIn.current[deck]!; const end = Math.max(start + 0.25, el.currentTime); setLoop(p => ({ ...p, [deck]: { start, end } })); delete loopIn.current[deck] }
  }
  const disc = (deck: DJDeck) => {
    const seconds = position[deck]
    const angle = seconds * 180 * speed[deck] / 100
    return <div className="relative mx-auto aspect-square w-full max-w-[350px] rounded-full border-[8px] border-[#202922] bg-[#070908] p-[9px] shadow-[0_14px_32px_#000,0_0_0_1px_#6b77603d,inset_0_0_20px_#000] sm:border-[11px]">
      <div className="pointer-events-none absolute inset-[2%] rounded-full border-2 border-[#CEFF50]/60 shadow-[0_0_15px_#CEFF5055]" />
      <div className="pointer-events-none absolute inset-[5%] rounded-full border border-dashed border-white/20" />
      <div onPointerDown={e => jogStart(deck, e)} onPointerMove={e => jogMove(deck, e)} onPointerUp={() => jogEnd(deck)} onPointerCancel={() => jogEnd(deck)}
        role="slider" tabIndex={0} aria-label={`Deck ${deck} jog wheel: drag clockwise to fast forward, counterclockwise to rewind`} aria-valuemin={0} aria-valuemax={Math.round(duration[deck] || 0)} aria-valuenow={Math.round(position[deck])}
        onKeyDown={e => { const el = audio.current[deck]; if (!el) return; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); el.currentTime = clamp(el.currentTime + (e.key === 'ArrowRight' ? 2 : -2), 0, el.duration || 0) } }}
        className="relative h-full w-full cursor-grab touch-none overflow-hidden rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#CEFF50] active:cursor-grabbing"
        style={{background:'repeating-radial-gradient(circle,#111512 0px,#111512 3px,#30372f 4px,#080a08 6px)'}}>
        <div className="absolute inset-[5%] rounded-full border-[2px] border-white/10" />
        <div className="absolute inset-[15%] rounded-full border border-white/10" />
        <div className="absolute inset-[25%] rounded-full border border-white/10" />
        <div className="absolute inset-[31%] overflow-hidden rounded-full border-[5px] border-[#303a2c] bg-[#CEFF50] shadow-[0_0_25px_#CEFF5040]" style={{transform:`rotate(${angle}deg)`}}>
          {/* Artist art rotates with the platter. Visitors can upload a custom portrait. */}
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage:`url("${images[deck]}")`}} />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-[8px] font-black tracking-[.15em] text-[#CEFF50]">STATIC {deck}</div>
          <div className="absolute left-1/2 top-1/2 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#CEFF50] bg-black" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[4%] h-[10px] w-[3px] -translate-x-1/2 rounded-full bg-[#CEFF50] shadow-[0_0_10px_#CEFF50]" />
      </div>
      <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 rounded bg-[#CEFF50] px-2 py-0.5 text-[8px] font-black text-black">JOG / {deck}</span>
    </div>
  }
  const deckPanel = (deck: DJDeck) => <div key={deck} className="min-w-0 rounded-xl border border-white/10 bg-gradient-to-b from-[#1b211b] to-[#0a0d0b] p-4 shadow-[inset_0_1px_#ffffff1a,0_15px_35px_#0008] sm:p-6">
    <div className="mb-4 flex items-center justify-between gap-2"><span className="text-[11px] font-black tracking-[.2em] text-[#CEFF50]">CDJ / DECK {deck}</span><span className={`text-[10px] font-bold ${playing[deck] ? 'text-[#CEFF50]' : 'text-white/40'}`}>{playing[deck] ? '● ON AIR' : '○ STANDBY'}</span></div>
    <div className="rounded-md border border-[#405632] bg-[#060c07] px-4 py-3 shadow-[inset_0_0_20px_#000]">
      <div className="flex justify-between gap-2 text-[9px] font-black tracking-widest text-[#CEFF50]/70"><span>TRACK {deck}</span><span>{speed[deck]}% TEMPO</span></div>
      <p className="mt-1 truncate text-sm font-black uppercase text-white" title={names[deck]}>{names[deck]}</p>
      <div className="mt-1 flex justify-between font-mono text-xs text-[#CEFF50]"><span>{clock(position[deck])}</span><span>-{clock(Math.max(0, duration[deck] - position[deck]))}</span></div>
      <canvas ref={el => { canvas.current[deck] = el }} width={650} height={76} role="img" aria-label={`Live audio spectrum deck ${deck}`} className="mt-3 h-[65px] w-full" />
      <input aria-label={`Seek deck ${deck}`} type="range" min={0} max={duration[deck] || 1} step="0.1" value={clamp(position[deck],0,duration[deck]||1)} onChange={e => { const el=audio.current[deck]; if (el) el.currentTime=Number(e.target.value) }} className="w-full accent-[#CEFF50]" />
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[9px] font-black tracking-wide sm:text-[10px]">
      <label className="cursor-pointer rounded border border-white/20 bg-[#181e18] px-2 py-3 hover:border-[#CEFF50]">+ LOAD AUDIO<input type="file" accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac" className="sr-only" onChange={e => { uploadTrack(deck,e.target.files?.[0]); e.target.value='' }} /></label>
      <label className="cursor-pointer rounded border border-white/20 bg-[#181e18] px-2 py-3 hover:border-[#CEFF50]">+ ARTIST PHOTO<input type="file" accept="image/*" className="sr-only" onChange={e => { uploadImage(deck,e.target.files?.[0]); e.target.value='' }} /></label>
    </div>
    <div className="mx-auto mt-5 w-full max-w-[350px]">{disc(deck)}</div>
    <p className="mt-4 text-center text-[9px] font-black uppercase tracking-widest text-white/35">TOUCH + ROTATE PLATTER TO SCRUB AUDIO</p>
    <div className="mt-5 grid grid-cols-[1fr_1fr_1fr] gap-2">
      <button type="button" onClick={() => { const el=audio.current[deck]; if(el) {el.pause();el.currentTime=0};setPlaying(p=>({...p,[deck]:false})) }} className="min-h-12 rounded border border-white/20 bg-[#202820] text-[10px] font-black">■ STOP</button>
      <button type="button" onClick={() => void toggle(deck)} className="min-h-12 rounded bg-[#CEFF50] text-[11px] font-black text-black shadow-[0_0_16px_#CEFF5033]">{playing[deck] ? '❚❚ PAUSE' : '▶ PLAY'}</button>
      <button type="button" onClick={() => { const el=audio.current[deck]; if(el)el.currentTime=0 }} className="min-h-12 rounded border border-[#CEFF50]/40 bg-[#1b2716] text-[10px] font-black text-[#CEFF50]">◀ CUE</button>
    </div>
    <div className="mt-5 flex items-center justify-between gap-3"><span className="text-[10px] font-black tracking-widest text-white/45">PERFORMANCE PADS</span><button type="button" onClick={() => loopAction(deck)} className={`rounded border px-3 py-2 text-[9px] font-black ${loop[deck] ? 'border-[#CEFF50] bg-[#CEFF50] text-black' : 'border-white/25 text-[#CEFF50]'}`}>{loop[deck] ? 'LOOP ON ✕' : loopIn.current[deck] !== undefined ? 'SET LOOP OUT' : 'LOOP IN / OUT'}</button></div>
    <div className="mt-3 grid grid-cols-4 gap-2">{[0,1,2,3].map(i => <button type="button" key={i} onClick={e => setCue(deck,i,e.shiftKey)} title="Tap to set cue, tap again to jump. Shift+tap to reset cue." className={`h-12 rounded border-b-4 text-[10px] font-black transition active:translate-y-0.5 ${cueMarks[deck][i] ? 'border-[#92bc24] bg-[#CEFF50] text-black shadow-[0_0_13px_#CEFF5070]' : 'border-[#35482c] bg-[#25331c] text-[#CEFF50]'}`}>HOT {i+1}</button>)}</div>
    <div className="mt-5 grid grid-cols-2 gap-4"><label className="text-[9px] font-black tracking-widest text-white/50">FILTER {filter[deck]}%<input aria-label={`Deck ${deck} filter`} type="range" min={0} max={100} value={filter[deck]} onChange={e => setFilter(p=>({...p,[deck]:Number(e.target.value)}))} className="mt-3 w-full accent-[#CEFF50]" /></label><label className="text-[9px] font-black tracking-widest text-white/50">TEMPO {speed[deck]}%<input aria-label={`Deck ${deck} speed`} type="range" min={70} max={130} value={speed[deck]} onChange={e=>setSpeed(p=>({...p,[deck]:Number(e.target.value)}))} className="mt-3 w-full accent-[#CEFF50]" /></label></div>
  </div>
  const mixer = <div className="min-w-0 rounded-xl border border-white/10 bg-gradient-to-b from-[#222922] to-[#0b0e0b] p-4 shadow-[inset_0_1px_#ffffff20,0_15px_35px_#0008] sm:p-5">
    <div className="border-b border-white/15 pb-4 text-center"><p className="text-[11px] font-black tracking-[.28em] text-[#CEFF50]">STATIC</p><p className="mt-1 text-[9px] font-black tracking-[.18em] text-white/45">PRO MIXER / 002</p></div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-center text-[10px] font-black text-[#CEFF50]"><span>CH 01 / A</span><span>CH 02 / B</span></div>
    <div className="mt-4 grid grid-cols-2 gap-3">{DECKS.map(deck => <div key={deck} className="flex flex-col items-center gap-5 rounded border border-white/10 bg-black/25 py-5">
      <Rotary label="HIGH" value={eq[deck].high} min={-18} max={18} unit="dB" onChange={n=>setEq(p=>({...p,[deck]:{...p[deck],high:n}}))} />
      <Rotary label="MID" value={eq[deck].mid} min={-18} max={18} unit="dB" onChange={n=>setEq(p=>({...p,[deck]:{...p[deck],mid:n}}))} />
      <Rotary label="LOW" value={eq[deck].low} min={-18} max={18} unit="dB" onChange={n=>setEq(p=>({...p,[deck]:{...p[deck],low:n}}))} />
      <div className="flex h-16 items-end gap-[3px]">{Array.from({length:7},(_,i)=><div key={i} className={`w-[5px] rounded-sm ${playing[deck] && i < 5 ? 'bg-[#CEFF50] shadow-[0_0_5px_#CEFF50]' : 'bg-[#33402d]'}`} style={{height:`${15+i*7}px`}} />)}</div>
      <span className="text-[9px] font-black tracking-wider text-white/45">CHANNEL FADER</span>
      <div className="flex h-36 items-center justify-center"><input aria-label={`Deck ${deck} channel volume`} type="range" min={0} max={100} value={volume[deck]} onChange={e=>setVolume(p=>({...p,[deck]:Number(e.target.value)}))} className="w-32 -rotate-90 accent-[#CEFF50]" /></div>
      <span className="font-mono text-[10px] text-[#CEFF50]">{volume[deck]}%</span>
    </div>)}</div>
    <div className="mt-6 rounded border border-[#CEFF50]/25 bg-[#090d08] p-3"><div className="flex justify-between text-[9px] font-black tracking-widest text-white/60"><span>A</span><span>CROSSFADER</span><span>B</span></div><input aria-label="Master crossfader" type="range" min={0} max={100} value={crossfade} onChange={e=>setCrossfade(Number(e.target.value))} className="mt-4 w-full accent-[#CEFF50]" /><div className="mt-1 text-center font-mono text-[10px] text-[#CEFF50]">{100-crossfade}% / {crossfade}%</div></div>
    <p className="mt-5 text-center text-[9px] leading-5 text-white/40">DRAG KNOBS UP / DOWN<br/>OR USE ARROW KEYS</p>
  </div>
  return <>
    <audio ref={el => { audio.current.A=el }} src="/static-preview.mp3" preload="metadata" onTimeUpdate={e=>{const t=e.currentTarget.currentTime;setPosition(p=>({...p,A:t}));const l=loop.A;if(l&&t>=l.end)e.currentTarget.currentTime=l.start}} onLoadedMetadata={e=>{const d=e.currentTarget.duration;setDuration(p=>({...p,A:Number.isFinite(d)?d:0}))}} onEnded={()=>setPlaying(p=>({...p,A:false}))} />
    <audio ref={el => { audio.current.B=el }} src="/static-preview2.mp3" preload="metadata" onTimeUpdate={e=>{const t=e.currentTarget.currentTime;setPosition(p=>({...p,B:t}));const l=loop.B;if(l&&t>=l.end)e.currentTarget.currentTime=l.start}} onLoadedMetadata={e=>{const d=e.currentTarget.duration;setDuration(p=>({...p,B:Number.isFinite(d)?d:0}))}} onEnded={()=>setPlaying(p=>({...p,B:false}))} />
    <div className={expanded ? 'fixed inset-0 z-[120] overflow-y-auto bg-[#070907] px-3 py-5 sm:px-8 sm:py-7' : 'relative border border-[#CEFF50]/30 bg-[#0b100b] p-3 sm:p-6'} role={expanded ? 'dialog' : undefined} aria-modal={expanded ? true : undefined} aria-label={expanded ? 'STATIC professional DJ mixing room' : undefined}>
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#CEFF50]/20 pb-5"><div><p className="text-[10px] font-black tracking-[.25em] text-[#CEFF50]">STATIC / PROFESSIONAL MIX LAB</p><h3 className="mt-2 text-2xl font-black uppercase tracking-[-.06em] sm:text-4xl">THE <span className="text-[#CEFF50]">MIXING ROOM.</span></h3><p className="mt-2 text-xs text-white/45">REAL AUDIO ENGINE · INTERACTIVE PLATTERS · HOT CUES · ROTARY EQ</p></div><button type="button" onClick={()=>setExpanded(v=>!v)} className="rounded bg-[#CEFF50] px-5 py-3 text-xs font-black text-black hover:bg-white">{expanded ? '✕ CLOSE FULLSCREEN' : '⤢ EXPAND DJ LAB'}</button></div>
        <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(220px,.46fr)_minmax(0,1fr)]">{deckPanel('A')}{mixer}{deckPanel('B')}</div>
        <p role="status" className="mt-5 text-xs font-black uppercase leading-6 text-[#CEFF50]">✳ {message}</p>
        <p className="mt-2 text-[11px] leading-5 text-white/40">JOG WHEEL: rotate to seek backward/forward (not real-time scratch audio). Artist portraits can be uploaded separately. Hot cue: first tap sets, next tap jumps; Shift+tap resets. Loop: press once for IN, again for OUT, again to clear. Audio stays on your device.</p>
      </div>
    </div>
  </>
}

function CrowdRadar() {
  const [active, setActive] = useState(0)
  const nodes = [{ title: 'THE MUSIC', detail: 'Live acts, new sounds, and loud memories.' }, { title: 'THE PEOPLE', detail: 'Meet your next favorite crowd.' }, { title: 'THE CULTURE', detail: 'Art, creativity, and after-dark ideas.' }, { title: 'THE ENERGY', detail: 'The feeling that stays after the lights go out.' }]
  return <div className="grid gap-8 border border-white/15 bg-[#0C120A] p-6 md:grid-cols-2 md:items-center sm:p-10">
    <div className="relative mx-auto aspect-square w-full max-w-[390px] rounded-full border border-[#CEFF50]/35 static-radar"><div className="absolute inset-[15%] rounded-full border border-[#CEFF50]/30"/><div className="absolute inset-[30%] rounded-full border border-[#CEFF50]/20"/><div className="static-radar-sweep absolute inset-0 rounded-full"/><span className="absolute inset-0 flex items-center justify-center text-6xl font-black text-[#CEFF50]">S✳</span>{nodes.map((n, i) => { const angle = i * Math.PI / 2 - Math.PI / 2; return <button key={n.title} type="button" aria-label={n.title} aria-pressed={active === i} onClick={() => setActive(i)} style={{left:`${50 + Math.cos(angle) * 43}%`,top:`${50 + Math.sin(angle) * 43}%`}} className={`absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-black transition ${active === i ? 'border-[#CEFF50] bg-[#CEFF50] text-black' : 'border-[#CEFF50] bg-black text-[#CEFF50]'}`}>{i + 1}</button> })}</div>
    <div><p className="text-xs font-black uppercase tracking-[.25em] text-[#CEFF50]">CROWD RADAR / EXPLORE</p><h3 className="mt-5 text-4xl font-black uppercase tracking-[-.06em] sm:text-6xl">{nodes[active].title}</h3><p className="mt-5 max-w-sm text-base leading-7 text-white/60">{nodes[active].detail}</p><p className="mt-10 text-xs uppercase tracking-widest text-[#CEFF50]">SELECT A RADAR POINT ↗</p></div>
  </div>
}

function Portal() {
  const reduce = useReducedMotion()
  return <div className="relative isolate flex min-h-[520px] flex-col items-center justify-center overflow-hidden border border-[#CEFF50]/30 bg-[#080D06] px-6 py-20 text-center">
    <div className="static-portal absolute h-[380px] w-[380px] rounded-full border-[3px] border-[#CEFF50]/65 shadow-[0_0_55px_#CEFF5035,inset_0_0_70px_#CEFF5020] sm:h-[450px] sm:w-[450px]" />
    <div className="static-portal-reverse absolute h-[290px] w-[290px] rounded-full border border-dashed border-[#CEFF50]/50 sm:h-[350px] sm:w-[350px]" />
    <div className="absolute h-[200px] w-[200px] rounded-full bg-[#CEFF50]/10 blur-[70px]" />
    <p className="relative z-10 text-xs font-black uppercase tracking-[.3em] text-[#CEFF50]">FINAL TRANSMISSION</p>
    <h2 className="relative z-10 mt-5 text-[clamp(3.5rem,9vw,8rem)] font-black uppercase leading-[.85] tracking-[-.09em]">ENTER<br/><span className="text-[#CEFF50]">STATIC.</span></h2>
    <motion.div whileHover={reduce ? undefined : { scale: 1.08 }} className="relative z-10 mt-9"><Link href="/events" className="inline-flex min-h-14 items-center gap-3 rounded-full bg-[#CEFF50] px-8 text-xs font-black uppercase tracking-widest text-black">ENTER THE PORTAL ↗</Link></motion.div>
  </div>
}

export default function Home() {

  const reduce = useReducedMotion()

  const [faqOpen, setFaqOpen] = useState<number | null>(0)

  const [introDone, setIntroDone] = useState(false)

  const x = useMotionValue(0), y = useMotionValue(0)

  const sx = useSpring(x, { stiffness: 35, damping: 22 }), sy = useSpring(y, { stiffness: 35, damping: 22 })

  const tiltX = useTransform(sy, [-250,250], [8,-8])

  const tiltY = useTransform(sx, [-250,250], [-8,8])

  useEffect(() => {

    const id = window.setTimeout(() => setIntroDone(true), 1600)

    return () => window.clearTimeout(id)

  }, [])

  const onMove = (e: React.MouseEvent<HTMLElement>) => {

    if (reduce) return

    const r = e.currentTarget.getBoundingClientRect()

    x.set(e.clientX - r.left - r.width/2)

    y.set(e.clientY - r.top - r.height/2)

  }

  return <main className="min-h-screen overflow-x-hidden bg-[#080A07] text-[#F3F3E9] selection:bg-[#CEFF50] selection:text-black">

    <style>{`

      @keyframes staticTrack{to{transform:translateX(-50%)}}

      @keyframes staticSpin{to{transform:rotate(360deg)}}

      @keyframes staticPulse{0%,100%{opacity:.35;transform:scale(.98)}50%{opacity:.8;transform:scale(1.06)}}

      @keyframes staticScan{from{transform:translateY(-110%)}to{transform:translateY(110%)}}

      .static-track{animation:staticTrack 27s linear infinite}

      .static-reverse{animation-direction:reverse;animation-duration:33s}

      .static-disc{animation:staticSpin 28s linear infinite}

      .static-glow{animation:staticPulse 7s ease-in-out infinite}

      .static-grid{background-image:linear-gradient(#CEFF500c 1px,transparent 1px),linear-gradient(90deg,#CEFF500c 1px,transparent 1px);background-size:65px 65px}

      @media(prefers-reduced-motion:reduce){.static-track,.static-disc,.static-glow,.static-letter,.static-portal,.static-portal-reverse,.static-radar-sweep{animation:none!important}.static-poster:hover{transform:none!important}}

    `}</style>

    <Noise/>
    <LiquidCursor/>

    <Navbar/>

    <AnimatePresence>{!introDone && !reduce && <motion.div key="intro" exit={{y:'-100%',transition:{duration:.85,ease}}} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#CEFF50] text-[#090B08]"><motion.div initial={{scale:.8,opacity:0,filter:'blur(18px)'}} animate={{scale:1,opacity:1,filter:'blur(0px)'}} transition={{duration:.6}} className="text-[clamp(5rem,18vw,16rem)] font-black leading-none tracking-[-.12em]">STATIC<span className="align-top text-[.5em]">✳</span></motion.div><p className="mt-6 text-xs font-black uppercase tracking-[.45em]">TUNING INTO THE CHAOS</p><motion.div initial={{width:0}} animate={{width:220}} transition={{duration:1.25}} className="mt-7 h-[3px] bg-black"/></motion.div>}</AnimatePresence>





    {/* The hero deliberately looks like an animated rave poster, not a SaaS landing page. */}

    <section onMouseMove={onMove} className="relative isolate flex min-h-[790px] items-center overflow-hidden pb-24 pt-40 sm:min-h-[900px] lg:min-h-[950px]">

      <Image src="/staticbg.jpeg" alt="STATIC event atmosphere" fill priority sizes="100vw" className="-z-30 object-cover opacity-50"/>

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#080A07] via-[#080A07]/75 to-[#080A07]/30"/>

      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#080A07] via-transparent to-[#080A07]/50"/>

      <div className="static-grid absolute inset-0 -z-10 opacity-80"/>
      <ParticleField/>

      <div className="static-glow pointer-events-none absolute -right-32 top-16 -z-10 h-[650px] w-[650px] rounded-full bg-[#CEFF50]/10 blur-[130px]"/>

      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-5 sm:px-9 lg:grid-cols-[1.2fr_.8fr] lg:px-14">

        <div className="relative z-10">

          <motion.div initial={reduce?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.75,duration:.6}} className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#CEFF50]"/> CHHATTISGARH / AFTER DARK / EST. 2026</motion.div>

          <motion.h1 initial={reduce?false:{opacity:0,y:100,filter:'blur(18px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{delay:1.7,duration:1,ease}} className="relative text-[clamp(5rem,12vw,13rem)] font-black uppercase leading-[.76] tracking-[-.105em]"><KineticWord>NOT</KineticWord><br/><span className="relative inline-block text-[#CEFF50]"><KineticWord>YOUR</KineticWord><span className="absolute -right-9 -top-5 text-[.26em] text-white">✳</span></span><br/><KineticWord>USUAL.</KineticWord></motion.h1>

          <motion.div initial={reduce?false:{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:2.05,duration:.7}} className="mt-10 flex flex-col gap-7 border-l-2 border-[#CEFF50] pl-5 sm:flex-row sm:items-end sm:justify-between">

            <div><p className="text-xl font-black uppercase tracking-[-.03em] sm:text-3xl">THE CITY HAS A NEW FREQUENCY.</p><p className="mt-3 max-w-md text-sm leading-7 text-white/65">Raves. Parties. Live acts. Unreal experiences. We make nights worth remembering and stories worth telling.</p></div>

          </motion.div>

          <motion.div initial={reduce?false:{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{delay:2.2,duration:.6}} className="mt-9 flex flex-wrap gap-3"><MagneticLink href="/tickets">Raat Baki Passes</MagneticLink><MagneticLink href="/sponsors" outline>PARTNER WITH STATIC</MagneticLink></motion.div>

        </div>

        <motion.div style={reduce?undefined:{rotateX:tiltX,rotateY:tiltY}} className="relative mx-auto hidden aspect-square w-full max-w-[480px] items-center justify-center lg:flex">

          <div className="static-disc absolute inset-[2%] rounded-full border border-[#CEFF50]/45"><span className="absolute left-1/2 top-[-7px] h-4 w-4 rounded-full bg-[#CEFF50] shadow-[0_0_30px_#CEFF50]"/></div>

          <div className="static-disc absolute inset-[12%] rounded-full border-[2px] border-dashed border-[#CEFF50]/35" style={{animationDirection:'reverse'}}/>

          <div className="absolute inset-[22%] rounded-full border-[45px] border-[#CEFF50] shadow-[0_0_110px_#CEFF5033]"/>

          <div className="absolute inset-[35%] flex items-center justify-center rounded-full bg-[#CEFF50] text-[145px] font-black tracking-[-.16em] text-[#090B08]">S</div>

          <div className="absolute -left-7 top-20 -rotate-12 border border-white/40 bg-black/90 px-5 py-3 text-xs font-black uppercase tracking-[.2em] text-[#CEFF50]">⚡ HIGH VOLTAGE CULTURE</div>

          <div className="absolute -bottom-1 right-0 rotate-6 bg-white px-5 py-3 text-xs font-black uppercase tracking-[.2em] text-black">NO NORMAL NIGHTS ↗</div>

        </motion.div>

      </div>

      <div className="absolute bottom-6 left-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.25em] text-white/45 sm:left-14"><span className="h-px w-8 bg-[#CEFF50]"/> SCROLL TO ENTER <ChevronDown size={16} className="animate-bounce"/></div>

      <div className="absolute bottom-6 right-5 hidden text-[10px] font-black tracking-[.3em] text-[#CEFF50] sm:block">S / 001 — THE BEGINNING</div>

    </section>



    <Marquee light/>

    <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-40"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.35fr_1fr]"><Reveal><SectionKicker id="01">THE MANIFESTO</SectionKicker><p className="text-sm font-medium leading-7 text-white/45">WE DON'T DO BORING.</p></Reveal><Reveal><h2 className="text-[clamp(3.4rem,8.8vw,10rem)] font-black uppercase leading-[.88] tracking-[-.085em]">SOME NIGHTS<br/>ARE <span className="text-[#CEFF50] italic">BUILT</span><br/>DIFFERENT.</h2><div className="mt-10 grid gap-8 border-t border-white/20 pt-8 text-sm leading-7 text-white/60 sm:grid-cols-2 sm:text-base"><p>STATIC is an experience-first culture collective. We mix sound, design, people and unexpected ideas into moments that feel larger than life.</p><p>Born in Bhilai. Built for dance floors, festival grounds, after-dark adventures, social chaos and the communities that make them matter.</p></div><Link href="/about" className="mt-9 inline-flex items-center gap-3 border-b border-[#CEFF50] pb-2 text-sm font-black uppercase tracking-widest">WHO WE ARE <ArrowUpRight size={18} className="text-[#CEFF50]"/></Link></Reveal></div></section>

    <section id="drop" className="bg-[#10130F] px-5 py-24 sm:px-9 lg:px-14 lg:py-32"><div className="mx-auto max-w-[1500px]"><Reveal className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><SectionKicker id="02">THE NEXT DROP</SectionKicker><h2 className="text-[clamp(3.5rem,9vw,9rem)] font-black uppercase leading-[.85] tracking-[-.08em]">DON'T MISS<br/><span className="text-[#CEFF50]">THE SIGNAL.</span></h2></div><MagneticLink href="/events" outline>ALL EVENTS</MagneticLink></Reveal><div className="space-y-6">{events.map(e=><Reveal key={e.id}><EventPoster event={e} large/></Reveal>)}</div></div></section>

    <section className="px-5 py-20 sm:px-9 lg:px-14"><div className="mx-auto max-w-[1500px]"><Reveal><SectionKicker id="SOUND">HEAR THE SIGNAL</SectionKicker><h2 className="mb-10 text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[.85] tracking-[-.08em]">SOUND IS<br/><span className="text-[#CEFF50]">EVERYTHING.</span></h2></Reveal><Reveal><DJLab/></Reveal></div></section>
    <Marquee reverse/>

    <section id="world" className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto max-w-[1500px]"><Reveal><SectionKicker id="03">PICK YOUR FREQUENCY</SectionKicker><h2 className="mb-14 text-[clamp(3.5rem,8vw,9rem)] font-black uppercase leading-[.85] tracking-[-.08em]">NOT ONE<br/><span className="text-[#CEFF50]">KIND OF NIGHT.</span></h2></Reveal><div className="border-t border-white/20">{experiences.map((item,i)=>{const Icon=item.icon;return <Reveal key={item.index} delay={.03*i}><div className="group grid gap-4 border-b border-white/20 py-7 transition-colors duration-300 hover:bg-[#CEFF50]/[.035] sm:grid-cols-[60px_1fr_1fr_50px] sm:items-center sm:gap-7 sm:py-10"><span className="text-xs font-black text-[#CEFF50]">{item.index}</span><h3 className="text-3xl font-black uppercase tracking-[-.055em] transition-transform duration-300 group-hover:translate-x-3 sm:text-5xl lg:text-6xl">{item.title}</h3><p className="max-w-sm text-sm leading-7 text-white/50">{item.detail}</p><Icon size={30} className="hidden text-[#CEFF50] transition-transform group-hover:-rotate-12 sm:block"/></div></Reveal>})}</div></div></section>

    <section className="px-5 py-20 sm:px-9 lg:px-14"><div className="mx-auto max-w-[1500px]"><Reveal><SectionKicker id="RADAR">THE CROWD IS THE CULTURE</SectionKicker><h2 className="mb-10 text-[clamp(3.5rem,8vw,8rem)] font-black uppercase leading-[.85] tracking-[-.08em]">FIND YOUR<br/><span className="text-[#CEFF50]">FREQUENCY.</span></h2></Reveal><Reveal><CrowdRadar/></Reveal></div></section>
    <section className="relative overflow-hidden bg-[#CEFF50] px-5 py-28 text-[#090B08] sm:px-9 lg:px-14 lg:py-36"><div className="pointer-events-none absolute -right-10 -top-28 select-none text-[350px] font-black leading-none opacity-[.08] lg:text-[700px]">S</div><Reveal className="relative mx-auto max-w-[1500px]"><p className="mb-9 text-xs font-black uppercase tracking-[.25em]">✳ THIS IS THE STATIC MINDSET</p><h2 className="text-[clamp(4rem,11vw,13rem)] font-black uppercase leading-[.79] tracking-[-.1em]">NORMAL<br/>IS <span className="italic">DEAD.</span><br/>LONG LIVE<br/>THE NIGHT.</h2><div className="mt-12 flex flex-col justify-between gap-6 border-t border-black/25 pt-7 sm:flex-row sm:items-end"><p className="max-w-md text-sm font-semibold leading-7">No copy-paste parties. No forgettable lineups. Just original experiences with a pulse of their own.</p><MagneticLink href="/about">MEET STATIC</MagneticLink></div></Reveal></section>

    <section id="archive" className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto max-w-[1500px]"><Reveal className="mb-12"><SectionKicker id="04">PAST TRANSMISSIONS</SectionKicker><h2 className="text-[clamp(3.6rem,9vw,9rem)] font-black uppercase leading-[.85] tracking-[-.08em]">THE NIGHTS<br/><span className="text-[#CEFF50]">WE KEPT.</span></h2><p className="mt-6 max-w-lg text-sm leading-7 text-white/55">A collection of moments, music and memories from the STATIC archive.</p></Reveal><div className="grid gap-5 md:grid-cols-2">{archive.map((e,i)=><Reveal key={e.id} delay={i*.1}><EventPoster event={e}/></Reveal>)}</div></div></section>

    <section className="border-y border-white/15 bg-[#111610] px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-2 lg:items-center"><Reveal><SectionKicker id="05">THE PEOPLE MAKE THE PARTY</SectionKicker><h2 className="text-[clamp(3.5rem,7vw,7rem)] font-black uppercase leading-[.88] tracking-[-.08em]">STRANGERS<br/>TONIGHT.<br/><span className="text-[#CEFF50]">STORIES<br/>TOMORROW.</span></h2><p className="mt-8 max-w-md text-sm leading-7 text-white/60">A good event brings people in. A great one brings people together. From the first beat to the last goodbye, the crowd is the culture.</p><div className="mt-8"><MagneticLink href="/events">FIND YOUR PEOPLE</MagneticLink></div></Reveal><Reveal className="relative min-h-[430px] overflow-hidden border border-white/20 bg-[#1A2417] sm:min-h-[560px]"><Image src="/14.jpg" alt="Crowd atmosphere" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover opacity-70"/><div className="absolute inset-0 bg-gradient-to-t from-[#111610] via-transparent to-transparent"/><div className="absolute left-6 top-6 rotate-[-9deg] bg-[#CEFF50] px-5 py-3 text-xs font-black uppercase tracking-widest text-black">THE CROWD IS THE HEADLINER ✳</div><div className="absolute bottom-8 left-8 right-8 text-5xl font-black uppercase leading-[.85] tracking-[-.06em] sm:text-7xl">FEEL IT.<br/>TOGETHER.</div></Reveal></div></section>

    <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><Reveal className="relative mx-auto max-w-[1500px] overflow-hidden border border-[#CEFF50]/40 bg-[#192316] p-7 sm:p-12 lg:p-20"><div className="static-glow pointer-events-none absolute -right-28 -top-32 h-[500px] w-[500px] rounded-full bg-[#CEFF50]/20 blur-[100px]"/><div className="relative grid gap-12 lg:grid-cols-[1.3fr_.7fr] lg:items-end"><div><SectionKicker id="06">PARTNER WITH THE ENERGY</SectionKicker><h2 className="text-[clamp(3.5rem,7vw,8rem)] font-black uppercase leading-[.86] tracking-[-.08em]">YOUR BRAND.<br/><span className="text-[#CEFF50]">OUR CHAOS.</span></h2><p className="mt-8 max-w-lg text-sm leading-7 text-white/60">Not another logo on a banner. Let's create activations, collaborations, branded moments and audience experiences people actually remember.</p></div><div className="lg:justify-self-end"><MagneticLink href="/sponsors">LET'S COLLABORATE</MagneticLink><p className="mt-5 text-xs text-white/40">For brands, artists, creators and collaborators.</p></div></div></Reveal></section>

    <section className="border-y border-white/10 bg-[#0F120E] px-5 py-24 sm:px-9 lg:px-14 lg:py-32"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.8fr_1.2fr]"><Reveal><SectionKicker id="07">BEFORE YOU ENTER</SectionKicker><h2 className="text-5xl font-black uppercase leading-[.9] tracking-[-.07em] sm:text-7xl">THE<br/><span className="text-[#CEFF50]">LOWDOWN.</span></h2></Reveal><Reveal className="border-t border-white/20">{faqs.map((f,i)=><div key={f.q} className="border-b border-white/20"><button type="button" aria-expanded={faqOpen===i} onClick={()=>setFaqOpen(faqOpen===i?null:i)} className="flex w-full items-center justify-between gap-4 py-7 text-left text-lg font-black sm:text-xl"><span>{f.q}</span><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${faqOpen===i?'border-[#CEFF50] bg-[#CEFF50] text-black':'border-white/25 text-[#CEFF50]'}`}>{faqOpen===i?<Minus size={18}/>:<Plus size={18}/>}</span></button><AnimatePresence initial={false}>{faqOpen===i&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><p className="max-w-xl pb-7 text-sm leading-7 text-white/55">{f.a}</p></motion.div>}</AnimatePresence></div>)}</Reveal></div></section>

    <section className="px-5 py-10 sm:px-9 lg:px-14"><div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 shrink-0 text-[#CEFF50]"/><div><h3 className="text-lg font-black uppercase">GOOD VIBES. SAFE SPACES.</h3><p className="mt-2 text-sm text-white/50">Check the entry, conduct and safety rules for every event.</p></div></div><Link href="/rules" className="inline-flex items-center gap-2 text-sm font-black text-[#CEFF50]">READ THE RULES <ArrowUpRight size={17}/></Link></div></section>

    <section className="px-5 py-16 sm:px-9 lg:px-14"><div className="mx-auto max-w-[1500px]"><Reveal><Portal/></Reveal></div></section>
    <Marquee light reverse/>

    <footer className="overflow-hidden bg-[#060806] px-5 pb-9 pt-24 sm:px-9 lg:px-14"><div className="mx-auto max-w-[1500px]"><Reveal><p className="mb-5 text-xs font-black uppercase tracking-[.3em] text-[#CEFF50]">THE NIGHT IS STILL YOUNG.</p><h2 className="text-[clamp(4rem,10vw,12rem)] font-black uppercase leading-[.8] tracking-[-.095em]">SEE YOU<br/><span className="text-[#CEFF50]">OUT THERE.</span></h2><div className="mt-10"><MagneticLink href="/events">NEXT EVENT ↗</MagneticLink></div></Reveal><div className="mt-24 grid gap-12 border-t border-white/20 py-12 lg:grid-cols-[1.4fr_1fr]"><div><Link href="/" className="text-[clamp(4.2rem,10vw,10rem)] font-black leading-none tracking-[-.1em]">STATIC<span className="text-[#CEFF50]">✳</span></Link><p className="mt-4 text-sm text-white/50">Raves. Music. Culture. People.<br/>Born in Bhilai. Built to be felt.</p></div><div className="grid grid-cols-2 gap-8 sm:grid-cols-3"><div><p className="mb-5 text-xs font-black uppercase tracking-widest text-[#CEFF50]">Explore</p><div className="flex flex-col gap-3 text-sm text-white/60"><Link href="/">Home</Link><Link href="/events">Events</Link><Link href="/about">About</Link></div></div><div><p className="mb-5 text-xs font-black uppercase tracking-widest text-[#CEFF50]">Info</p><div className="flex flex-col gap-3 text-sm text-white/60"><Link href="/sponsors">Partnerships</Link><Link href="/rules">Rules</Link></div></div><div><p className="mb-5 text-xs font-black uppercase tracking-widest text-[#CEFF50]">Social</p><a href="https://www.instagram.com/staticislive_/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#CEFF50]"><Instagram size={17}/>Instagram ↗</a><p className="mt-2 text-xs text-white/30"></p></div></div></div><div className="flex flex-col justify-between gap-3 border-t border-white/15 pt-7 text-xs text-white/40 sm:flex-row"><p>© {new Date().getFullYear()} STATIC. ALL RIGHTS RESERVED.</p><div className="flex gap-5"><span>NEVER STAY STILL ✳</span><a href="https://anshhh-inky.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[#CEFF50]">Developed by anshhh ↗</a></div></div></div></footer>

  </main>

}