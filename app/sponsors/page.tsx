'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'

type Tier = 'bronze' | 'silver' | 'gold' | 'platinum'
type Value = boolean | string

const tiers: { id: Tier; name: string; price: string; note: string }[] = [
  { id: 'bronze', name: 'Bronze', price: '₹1,00,000', note: 'Get your brand in the room.' },
  { id: 'silver', name: 'Silver', price: '₹2,00,000', note: 'Turn visibility into interaction.' },
  { id: 'gold', name: 'Gold', price: '₹3,50,000', note: 'Make the crowd remember you.' },
  { id: 'platinum', name: 'Platinum', price: '₹5,00,000', note: 'Own a defining part of the experience.' },
]

const benefits: { name: string; values: Record<Tier, Value> }[] = [
  { name: 'Official Sponsor Status', values: { bronze: true, silver: true, gold: true, platinum: true } },
  { name: 'Logo on Event Creatives', values: { bronze: 'Standard', silver: 'Enhanced', gold: 'Premium', platinum: 'Priority' } },
  { name: 'LED / Screen Rotation', values: { bronze: 'Standard', silver: 'Enhanced', gold: 'High', platinum: 'Maximum' } },
  { name: 'Social Media Integrations', values: { bronze: 'Limited', silver: 'Included', gold: 'Priority', platinum: 'Maximum' } },
  { name: 'On-Ground Stall / Activation', values: { bronze: 'Subject to space', silver: 'Standard', gold: 'Premium', platinum: 'Prime' } },
  { name: 'Stage / Host Mentions', values: { bronze: 'Limited', silver: 'Included', gold: 'Priority', platinum: 'Priority+' } },
  { name: 'Fanpit Passes', values: { bronze: '2', silver: '4', gold: '6', platinum: '10' } },
  { name: 'General Passes', values: { bronze: '4', silver: '8', gold: '12', platinum: '20' } },
  { name: 'Category Exclusivity', values: { bronze: false, silver: false, gold: 'Optional', platinum: true } },
  { name: 'Dedicated Brand Activation', values: { bronze: false, silver: 'Optional', gold: true, platinum: true } },
  { name: 'Post-Event Impact Report', values: { bronze: true, silver: true, gold: true, platinum: true } },
  { name: 'Sponsor Wall / Photo Zone', values: { bronze: 'Logo', silver: 'Enhanced', gold: 'Premium', platinum: 'Priority' } },
  { name: 'QR / Coupon Campaign', values: { bronze: false, silver: 'Optional', gold: true, platinum: true } },
  { name: 'Giveaway Collaboration', values: { bronze: false, silver: 'Optional', gold: true, platinum: true } },
  { name: 'Creator / Influencer Integration', values: { bronze: false, silver: 'Limited', gold: 'Included', platinum: 'Priority' } },
  { name: 'Ticket / Wristband Visibility', values: { bronze: false, silver: false, gold: 'Optional', platinum: 'Priority' } },
  { name: 'VIP / Fanpit Zone Branding', values: { bronze: false, silver: false, gold: 'Optional', platinum: true } },
  { name: 'Lead Capture / Sampling Support', values: { bronze: false, silver: 'Standard', gold: 'Enhanced', platinum: 'Priority' } },
  { name: 'Aftermovie / Recap Visibility', values: { bronze: 'Logo', silver: 'Included', gold: 'Premium', platinum: 'Priority' } },
  { name: 'Brand Content Usage Assets', values: { bronze: 'Selected', silver: 'Selected', gold: 'Expanded', platinum: 'Expanded' } },
]

const activations = [
  ['01', 'THE BIG SCREEN', 'LED screens, sponsor rotations, campaign films and visual takeovers.'],
  ['02', 'THE EXPERIENCE', 'Pop-ups, sampling, product demos, games and immersive brand stalls.'],
  ['03', 'THE SCAN', 'QR campaigns, giveaways, coupons and measurable audience actions.'],
  ['04', 'THE CROWD', 'Fanpit, audience-zone and experience-area brand integration.'],
  ['05', 'THE MIC', 'Host mentions and approved stage placements within the event programme.'],
  ['06', 'THE FEED', 'Pre-event, event-day and post-event content integration.'],
]

const partnerModels = [
  ['01', 'CASH', 'A defined sponsorship investment in exchange for agreed brand deliverables.', 'Example: ₹2,00,000 → Silver partnership'],
  ['02', 'BARTER', 'Provide useful event products or services in exchange for agreed visibility.', 'Examples: transport, rooms, printing, production or media'],
  ['03', 'HYBRID', 'Combine cash with products or services to reach an agreed partnership value.', 'Example: ₹70K services + ₹30K cash → ₹1L value'],
]

const categories = ['Automobile', 'Food & Beverage', 'Hospitality', 'Fashion', 'Education', 'FinTech', 'Technology', 'Healthcare', 'Fitness', 'Media', 'Travel', 'Local Business']

const measurements = [
  ['Digital Content', 'Views, reach, engagement and selected content performance', 'Post-event'],
  ['QR Campaign', 'Scans, registrations, coupon interactions or campaign actions', 'Campaign report'],
  ['Brand Activation', 'Sampling, participation or interaction data where trackable', 'Activation summary'],
  ['Deliverables', 'Agreed posts, placements, mentions and branding inventory', 'Delivery audit'],
  ['Event Content', 'Selected event photos and videos containing brand visibility', 'Media assets'],
]

function Label({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[.25em] text-[#CEFF50]"><span className="h-px w-8 bg-[#CEFF50]" /> {number} / {children}</p>
}

function ValueText({ value }: { value: Value }) {
  return <span className={value === false ? 'text-white/25' : value === true ? 'font-black text-[#CEFF50]' : 'text-white/75'}>{value === true ? '✓ INCLUDED' : value === false ? '—' : value}</span>
}

export default function SponsorsPage() {
  const [selected, setSelected] = useState<Tier>('gold')
  const tier = tiers.find(item => item.id === selected)!
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#080A07] text-[#F4F5E9] selection:bg-[#CEFF50] selection:text-black">
      <Navbar />
      <style>{`
        @keyframes staticMarquee { to { transform: translateX(-50%); } }
        @keyframes staticFloat { 50% { transform: translateY(-14px) rotate(6deg); } }
        .sponsor-marquee { animation: staticMarquee 28s linear infinite; }
        .sponsor-float { animation: staticFloat 7s ease-in-out infinite; }
        .sponsor-grid { background-image: linear-gradient(#CEFF5010 1px,transparent 1px),linear-gradient(90deg,#CEFF5010 1px,transparent 1px); background-size: 56px 56px; }
        @media(prefers-reduced-motion:reduce){.sponsor-marquee,.sponsor-float{animation:none}}
      `}</style>

      <section className="relative isolate min-h-[740px] overflow-hidden border-b border-white/15 px-5 pb-24 pt-40 sm:px-9 lg:min-h-[860px] lg:px-14 lg:pt-52">
        <div className="absolute inset-0 -z-30 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/staticbg.jpeg')" }} />
        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#080A07] via-[#080A07]/80 to-[#080A07]/35" />
        <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#080A07] via-transparent to-[#080A07]/50" />
        <div className="sponsor-grid absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[1500px]">
          <Label number="001">BRAND PARTNERSHIPS / STATIC</Label>
          <div className="relative">
            <h1 className="relative z-10 max-w-[1150px] text-[clamp(4.7rem,12vw,13rem)] font-black uppercase leading-[.76] tracking-[-.105em]">DON'T<br />BUY <span className="text-[#CEFF50]">ADS.</span><br />MAKE<br />NOISE<span className="text-[#CEFF50]">✳</span></h1>
            <div aria-hidden="true" className="sponsor-float pointer-events-none absolute -right-3 top-6 hidden h-48 w-48 rotate-12 items-center justify-center rounded-full border-[22px] border-[#CEFF50] text-center text-[11px] font-black uppercase tracking-[.15em] text-[#CEFF50] lg:flex xl:right-24 xl:h-64 xl:w-64">BRANDS × CULTURE × CROWD</div>
          </div>
          <div className="mt-12 flex flex-col gap-8 border-t border-white/25 pt-7 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-base leading-8 text-white/70 sm:text-lg">Put your brand where the energy is. STATIC builds live experiences where people don't just see brands — they interact with them.</p>
            <a href="#packages" className="inline-flex w-fit items-center gap-5 bg-[#CEFF50] px-7 py-4 text-xs font-black uppercase tracking-[.15em] text-black transition hover:bg-white">EXPLORE THE DEALS <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="absolute bottom-7 right-6 hidden text-[10px] font-black tracking-[.25em] text-white/40 sm:block">PARTNERSHIP DECK / 2026</div>
      </section>

      <div aria-hidden="true" className="overflow-hidden border-b border-[#CEFF50] bg-[#CEFF50] py-4 text-black"><div className="sponsor-marquee flex w-max">{[0,1].map(copy => <div key={copy} className="flex shrink-0 gap-10 pr-10 text-xl font-black uppercase tracking-tight sm:text-3xl">{['YOUR BRAND', 'OUR CULTURE', 'REAL CONNECTION', 'BIG ENERGY', 'STATIC ✳'].map(word => <span key={word} className="whitespace-nowrap">✳ {word}</span>)}</div>)}</div></div>

      <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.4fr_1fr]">
        <div><Label number="002">THE PITCH</Label><p className="text-sm uppercase tracking-[.12em] text-white/40">Not another logo on another banner.</p></div>
        <div><h2 className="text-[clamp(3.2rem,7.5vw,8rem)] font-black uppercase leading-[.88] tracking-[-.075em]">BE SEEN.<br /><span className="text-[#CEFF50]">BE FELT.</span><br />BE REMEMBERED.</h2><p className="mt-9 max-w-2xl text-base leading-8 text-white/55">From stage visibility to physical activations, social storytelling and trackable campaigns, STATIC can build partnerships around real audience moments — not just impressions.</p></div>
      </div></section>

      <section id="packages" className="scroll-mt-24 border-y border-white/15 bg-[#11150F] px-5 py-24 sm:px-9 lg:px-14 lg:py-32"><div className="mx-auto max-w-[1500px]">
        <Label number="003">CHOOSE YOUR LEVEL</Label>
        <div className="mb-12 flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><h2 className="text-[clamp(3.5rem,8vw,9rem)] font-black uppercase leading-[.85] tracking-[-.08em]">FOUR LEVELS.<br /><span className="text-[#CEFF50]">ONE CROWD.</span></h2><p className="max-w-sm text-sm leading-7 text-white/50">Select a level to explore its deliverables. All packages can be tailored to event inventory and campaign goals.</p></div>
        <div className="grid grid-cols-2 border-l border-t border-white/20 lg:grid-cols-4" role="group" aria-label="Select sponsorship tier">{tiers.map((item, index) => <button type="button" key={item.id} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} className={`group relative flex min-h-[250px] flex-col items-start justify-between border-b border-r p-5 text-left transition-colors duration-300 sm:p-8 lg:min-h-[330px] ${selected === item.id ? 'border-[#CEFF50] bg-[#CEFF50] text-[#080A07]' : 'border-white/20 bg-[#0A0D09] hover:bg-[#20291B]'}`}>
          <div className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-[.2em]"><span>0{index+1} / LEVEL</span><span aria-hidden="true" className="text-2xl">{selected === item.id ? '↗' : '+'}</span></div>
          <div><h3 className="text-[clamp(1.8rem,3vw,3.7rem)] font-black uppercase leading-none tracking-[-.06em]">{item.name}</h3><p className="mt-3 text-[clamp(1.35rem,2.3vw,2.5rem)] font-black tracking-[-.06em]">{item.price}</p><p className={`mt-5 max-w-[210px] text-xs leading-5 ${selected === item.id ? 'text-black/65' : 'text-white/45'}`}>{item.note}</p></div>
          {item.id === 'gold' && <span className={`absolute right-5 top-12 text-[9px] font-black uppercase tracking-widest ${selected === item.id ? 'text-black/65' : 'text-[#CEFF50]'}`}>POPULAR PICK</span>}
        </button>)}</div>
        <div className="mt-6 grid gap-8 border border-[#CEFF50]/30 bg-[#0A0D09] p-6 sm:p-9 lg:grid-cols-[.8fr_1.2fr] lg:p-12">
          <div><p className="mb-4 text-[10px] font-black uppercase tracking-[.25em] text-[#CEFF50]">SELECTED / {tier.name.toUpperCase()}</p><h3 className="text-5xl font-black uppercase leading-[.9] tracking-[-.06em] sm:text-7xl">{tier.name}<span className="text-[#CEFF50]">.</span></h3><p className="mt-5 text-3xl font-black">{tier.price}</p><p className="mt-5 text-sm text-white/50">{tier.note}</p><a href={`mailto:daa.static.official@gmail.com?subject=${encodeURIComponent(`STATIC ${tier.name} Sponsorship Enquiry`)}`} className="mt-9 inline-flex items-center gap-5 bg-[#CEFF50] px-6 py-4 text-xs font-black uppercase tracking-[.13em] text-black transition hover:bg-white">DISCUSS THIS PACKAGE ↗</a></div>
          <div><div className="mb-4 flex items-center justify-between border-b border-white/20 pb-4"><h4 className="text-xs font-black uppercase tracking-[.18em]">WHAT'S IN YOUR PACKAGE</h4><span className="text-[10px] text-white/40">20 DELIVERABLES</span></div><div className="grid gap-x-8 sm:grid-cols-2">{benefits.map(item => <div key={item.name} className="flex items-center justify-between gap-4 border-b border-white/10 py-3"><span className="max-w-[65%] text-xs leading-5 text-white/55">{item.name}</span><span className="shrink-0 text-right text-[10px] font-semibold uppercase"><ValueText value={item.values[selected]}/></span></div>)}</div></div>
        </div>
        <p className="mt-5 text-xs leading-6 text-white/40">Packages are proposals, not automatic guarantees. Final scope, exclusivity, availability and deliverables are subject to agreement and event feasibility.</p>
      </div></section>

      <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto max-w-[1500px]"><Label number="004">THE INVENTORY</Label><h2 className="mb-14 text-[clamp(3.4rem,8vw,8.5rem)] font-black uppercase leading-[.86] tracking-[-.075em]">DON'T JUST<br /><span className="text-[#CEFF50]">SHOW UP.</span><br />TAKE OVER.</h2><div className="border-t border-white/20">{activations.map(([number, title, description]) => <div key={number} className="group grid gap-4 border-b border-white/20 py-8 transition-colors hover:bg-[#CEFF50]/[.04] sm:grid-cols-[70px_1fr_1fr] sm:items-center sm:gap-8 sm:py-10"><span className="text-xs font-black text-[#CEFF50]">{number}</span><h3 className="text-3xl font-black uppercase tracking-[-.05em] transition-transform group-hover:translate-x-2 sm:text-4xl lg:text-5xl">{title}</h3><p className="max-w-lg text-sm leading-7 text-white/50">{description}</p></div>)}</div></div></section>

      <section className="bg-[#CEFF50] px-5 py-24 text-[#080A07] sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto max-w-[1500px]"><p className="mb-7 text-[10px] font-black uppercase tracking-[.25em]">005 / HOW WE CAN WORK TOGETHER</p><h2 className="text-[clamp(3.8rem,9vw,10rem)] font-black uppercase leading-[.8] tracking-[-.09em]">CASH.<br />BARTER.<br /><span className="italic">OR BOTH.</span></h2><div className="mt-14 grid border-t border-black/30 lg:grid-cols-3">{partnerModels.map(([number, title, description, example]) => <div key={number} className="border-b border-black/30 py-8 lg:border-r lg:px-8 lg:last:border-r-0"><span className="text-xs font-black">{number}</span><h3 className="mt-8 text-3xl font-black uppercase tracking-[-.06em]">{title}</h3><p className="mt-5 max-w-sm text-sm leading-7 text-black/70">{description}</p><p className="mt-6 border-t border-black/20 pt-5 text-xs font-semibold">{example}</p></div>)}</div></div></section>

      <section className="px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-2"><div><Label number="006">WHO'S INVITED?</Label><h2 className="text-[clamp(3.2rem,6.5vw,7rem)] font-black uppercase leading-[.88] tracking-[-.075em]">EVERY<br />BRAND HAS<br /><span className="text-[#CEFF50]">A FREQUENCY.</span></h2><p className="mt-7 max-w-md text-sm leading-7 text-white/50">From local businesses to national brands, the best collaborations are the ones that feel natural to the audience.</p></div><div className="flex flex-wrap content-center gap-3">{categories.map(category => <span key={category} className="border border-white/20 px-5 py-3 text-xs font-black uppercase tracking-[.08em] text-white/75 transition-colors hover:border-[#CEFF50] hover:bg-[#CEFF50] hover:text-black">{category}</span>)}</div></div></section>

      <section className="border-y border-white/15 bg-[#10140F] px-5 py-24 sm:px-9 lg:px-14 lg:py-32"><div className="mx-auto max-w-[1500px]"><Label number="007">ACCOUNTABILITY</Label><div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><h2 className="text-[clamp(3.3rem,7vw,8rem)] font-black uppercase leading-[.85] tracking-[-.075em]">MAKE IT<br /><span className="text-[#CEFF50]">COUNT.</span></h2><p className="max-w-md text-sm leading-7 text-white/50">Where measurable and agreed in advance, campaigns can include a clear post-event summary.</p></div><div className="overflow-x-auto border-t border-white/20"><table className="w-full min-w-[660px] text-left"><thead><tr className="text-[10px] font-black uppercase tracking-[.2em] text-[#CEFF50]"><th className="py-5 pr-5">AREA</th><th className="py-5 pr-5">WHAT WE CAN TRACK</th><th className="py-5">OUTPUT</th></tr></thead><tbody>{measurements.map(([area, metric, report]) => <tr key={area} className="border-t border-white/15 text-sm"><th className="py-6 pr-5 font-black">{area}</th><td className="py-6 pr-5 leading-6 text-white/55">{metric}</td><td className="py-6 text-[#CEFF50]">{report}</td></tr>)}</tbody></table></div><p className="mt-7 max-w-4xl text-xs leading-6 text-white/40">All deliverables depend on event inventory, production feasibility, venue permissions and signed agreements. Artist endorsements, artist posts and meet-and-greets are not included unless explicitly approved in writing.</p></div></section>

      <section id="contact" className="scroll-mt-24 px-5 py-24 sm:px-9 lg:px-14 lg:py-36"><div className="relative mx-auto max-w-[1500px] overflow-hidden border border-[#CEFF50]/35 bg-[#182315] p-7 sm:p-12 lg:p-20"><div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 text-[330px] font-black leading-none text-[#CEFF50]/10">✳</div><div className="relative"><Label number="008">LET'S BUILD SOMETHING LOUD</Label><h2 className="text-[clamp(3.7rem,9vw,10rem)] font-black uppercase leading-[.83] tracking-[-.085em]">YOUR BRAND.<br /><span className="text-[#CEFF50]">OUR CHAOS.</span></h2><p className="mt-9 max-w-xl text-sm leading-7 text-white/60">Need a custom deal? We can explore category exclusivity, hospitality, mobility, production, technology, media or something completely new.</p><div className="mt-10 flex flex-wrap gap-4"><a href="mailto:daa.static.official@gmail.com?subject=STATIC%20Partnership%20Enquiry" className="inline-flex items-center gap-4 bg-[#CEFF50] px-7 py-4 text-xs font-black uppercase tracking-[.12em] text-black transition hover:bg-white">EMAIL THE TEAM ↗</a><a href="https://www.instagram.com/staticislive_/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 border border-white/30 px-7 py-4 text-xs font-black uppercase tracking-[.12em] transition hover:border-[#CEFF50] hover:text-[#CEFF50]">INSTAGRAM ↗</a></div><p className="mt-8 break-all text-xs text-white/45">daa.static.official@gmail.com · Bhilai, Chhattisgarh</p></div></div></section>

      <footer className="border-t border-white/15 bg-[#050705] px-5 pb-8 pt-16 sm:px-9 lg:px-14"><div className="mx-auto max-w-[1500px]"><Link href="/" className="block w-fit text-[clamp(5rem,15vw,16rem)] font-black uppercase leading-[.8] tracking-[-.11em]">STATIC<span className="text-[#CEFF50]">✳</span></Link><div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-white/15 pt-7 text-xs text-white/45"><p>© {new Date().getFullYear()} STATIC. NEVER STAY STILL.</p><div className="flex gap-6"><Link href="/">HOME</Link><Link href="/events">EVENTS</Link><Link href="/about">ABOUT</Link><Link href="/rules">RULES</Link></div></div></div></footer>
    </main>
  )
}
