'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, Ticket, X, Instagram } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', number: '01' },
  { href: '/events', label: 'Events', number: '02' },
  { href: '/about', label: 'About', number: '03' },
  { href: '/team', label: 'Team', number: '04' },
  { href: '/sponsors', label: 'Partners', number: '05' },
  { href: '/rules', label: 'Rules', number: '06' },
]

export function Navbar() {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onEscape)
    }
  }, [menuOpen])

  const active = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[80] transition-colors duration-500 ${
          scrolled || menuOpen
            ? 'border-b border-[#CEFF50]/15 bg-[#080A07]/95 shadow-[0_15px_50px_rgba(0,0,0,.45)] backdrop-blur-2xl'
            : 'border-b border-white/10 bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-4 px-5 sm:h-[84px] sm:px-9 lg:px-14">
          <Link href="/" aria-label="STATIC home" className="group relative z-[90] flex shrink-0 items-center">
            <div className="relative h-[43px] w-[145px] sm:h-[49px] sm:w-[175px] lg:h-[54px] lg:w-[195px]">
              <Image
  src="/bgstatic2.png"
  alt="STATIC logo"
  fill
  priority
  sizes="(max-width: 640px) 145px, 175px"
  className="object-contain object-left"
/>
            </div>
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active(item.href) ? 'page' : undefined}
                className={`group relative overflow-hidden px-4 py-3 text-[11px] font-black uppercase tracking-[.16em] transition-colors ${
                  active(item.href) ? 'text-[#CEFF50]' : 'text-white/65 hover:text-white'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span className={`absolute inset-x-4 bottom-1 h-[2px] origin-left bg-[#CEFF50] transition-transform duration-300 ${active(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}/>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/tickets" className="group hidden items-center gap-3 rounded-full bg-[#CEFF50] px-6 py-3 text-[11px] font-black uppercase tracking-[.12em] text-[#080A07] transition hover:bg-white hover:shadow-[0_0_35px_rgba(206,255,80,.3)] sm:inline-flex">
              <Ticket size={16}/> GET IN <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(open => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="static-mobile-navigation"
              className="relative z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/[.06] text-white transition hover:border-[#CEFF50] hover:text-[#CEFF50] lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={menuOpen ? 'close' : 'open'} initial={reduce ? false : { opacity: 0, rotate: -70, scale: .75 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={reduce ? {} : { opacity: 0, rotate: 70, scale: .75 }} transition={{ duration: .18 }}>
                  {menuOpen ? <X size={22}/> : <Menu size={22}/>}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="static-mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={reduce ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-[#090C08] px-5 pb-8 pt-[110px] text-white sm:px-9 lg:hidden"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#CEFF5014 1px,transparent 1px),linear-gradient(90deg,#CEFF5014 1px,transparent 1px)', backgroundSize: '52px 52px' }}/>
            <div aria-hidden="true" className="pointer-events-none absolute -right-36 top-28 h-[450px] w-[450px] rounded-full bg-[#CEFF50]/10 blur-[100px]"/>
            <div className="relative mb-7 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.3em] text-[#CEFF50]"><span className="h-[1px] w-8 bg-[#CEFF50]"/> CHOOSE YOUR FREQUENCY</div>

            <nav aria-label="Mobile links" className="relative flex flex-col border-t border-white/20">
              {navItems.map((item, index) => (
                <motion.div key={item.href} initial={reduce ? false : { opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 + index * .07 }}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} aria-current={active(item.href) ? 'page' : undefined} className="group flex items-center justify-between gap-4 border-b border-white/20 py-4 sm:py-5">
                    <span className="flex items-baseline gap-4">
                      <span className="text-[10px] font-black text-[#CEFF50]">{item.number}</span>
                      <span className={`text-[clamp(2.4rem,9vw,5rem)] font-black uppercase leading-none tracking-[-.075em] ${active(item.href) ? 'text-[#CEFF50]' : 'text-white'}`}>{item.label}</span>
                    </span>
                    <ArrowUpRight size={24} className="shrink-0 text-[#CEFF50] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} className="relative mt-8">
              <Link href="/events" onClick={() => setMenuOpen(false)} className="flex w-full items-center justify-between bg-[#CEFF50] px-6 py-5 text-xs font-black uppercase tracking-[.16em] text-[#080A07]"><span className="flex items-center gap-3"><Ticket size={19}/> FIND THE NEXT DROP</span><ArrowUpRight size={20}/></Link>
            </motion.div>

            <div className="relative mt-auto flex items-end justify-between gap-5 pt-12">
              <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#CEFF50]">STATIC / AFTER DARK</p><p className="mt-2 text-xs text-white/40">NEVER STAY STILL ✳</p></div>
              <p className="text-[10px] font-bold text-white/35">© {new Date().getFullYear()} STATIC</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
