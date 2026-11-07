'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw, Search, Users } from 'lucide-react'
import type { GroupOffer, OfferStatus } from '@/lib/offer-types'

const statuses: OfferStatus[] = [
  'pending',
  'contacted',
  'paid',
  'cancelled',
]

function money(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

export function AdminGroupOffers() {
  const [offers, setOffers] = useState<GroupOffer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const actionLock = useRef(false)

  const load = useCallback(async () => {
    const response = await fetch('/api/raat-offers?action=admin', {
      credentials: 'same-origin',
      cache: 'no-store',
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Unable to load offers.')

    setOffers(data.offers)
  }, [])

  useEffect(() => {
    void load()
      .catch(error =>
        setError(error instanceof Error ? error.message : 'Unable to load offers.'),
      )
      .finally(() => setLoading(false))
  }, [load])

  async function refresh() {
    if (actionLock.current) return

    setLoading(true)
    setError('')

    try {
      await load()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Refresh failed.')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(offer: GroupOffer, status: OfferStatus) {
    if (actionLock.current || status === offer.status) return

    if (
      status === 'paid' &&
      !window.confirm(
        `Confirm you received the full group payment of ${money(offer.group_total)}? This does not issue entry passes.`,
      )
    ) {
      return
    }

    actionLock.current = true
    setBusyId(offer.id)
    setError('')

    try {
      const response = await fetch('/api/raat-offers?action=status', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: offer.id,
          previous_status: offer.status,
          status,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to update offer.')

      await load()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Update failed.')
    } finally {
      actionLock.current = false
      setBusyId(null)
    }
  }

  const query = search.trim().toLowerCase()

  const visible = offers.filter(offer =>
    [
      offer.promoter_name,
      offer.promoter_phone,
      offer.id,
      ...offer.guest_names,
    ]
      .join(' ')
      .toLowerCase()
      .includes(query),
  )

  return (
    <section className="rounded-2xl border border-white/10 bg-[#11160F] p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black">
            <Users size={23} className="text-[#CEFF50]" />
            Group offers
          </h2>
          <p className="mt-2 text-xs leading-6 text-white/45">
            Latest 500 offers. Each group contains 10 listed guests.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading || Boolean(busyId)}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-bold text-white/70 hover:text-[#CEFF50] disabled:opacity-40"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="relative mt-6">
        <Search size={17} className="absolute left-4 top-4 text-white/35" />
        <input
          aria-label="Search group offers"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Promoter, phone, guest name, or offer ID"
          className="min-h-12 w-full rounded-xl border border-white/15 bg-[#080A07] py-3 pl-11 pr-4 text-base outline-none focus:border-[#CEFF50]"
        />
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-red-400/25 bg-red-950/20 p-4 text-sm text-red-100">
          {error}
        </p>
      )}

      {!loading && !visible.length && (
        <p className="py-10 text-sm text-white/40">No matching group offers.</p>
      )}

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-2">
        {visible.map(offer => (
          <article key={offer.id} className="rounded-2xl border border-white/10 bg-[#080A07] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#CEFF50]">
                  Promoter
                </p>
                <h3 className="mt-2 break-words text-xl font-black">
                  {offer.promoter_name}
                </h3>
                <a
                  href={`tel:+91${offer.promoter_phone}`}
                  className="mt-2 inline-block text-sm text-white/55"
                >
                  {offer.promoter_phone}
                </a>
              </div>

              <div className="rounded-xl bg-[#CEFF50]/10 px-4 py-3 text-right">
                <p className="text-2xl font-black text-[#CEFF50]">
                  −{money(offer.discount)}
                </p>
                <p className="mt-1 text-[9px] uppercase text-white/40">
                  Per person
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-y border-white/10 py-4">
              <div>
                <p className="text-[10px] text-white/35">Price per guest</p>
                <p className="mt-1 font-black">{money(offer.price_per_person)}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/35">Group total</p>
                <p className="mt-1 font-black text-[#CEFF50]">{money(offer.group_total)}</p>
              </div>
            </div>

            <details className="mt-5">
              <summary className="cursor-pointer text-xs font-bold text-white/70">
                View all 10 guest names
              </summary>

              <ol className="mt-4 grid list-inside list-decimal gap-3 text-sm text-white/55 sm:grid-cols-2">
                {offer.guest_names.map((name, index) => (
                  <li key={`${offer.id}-${index}`} className="break-words">
                    {name}
                  </li>
                ))}
              </ol>
            </details>

            <label className="mt-6 block">
              <span className="mb-2 block text-[10px] font-bold uppercase text-white/40">
                Group status
              </span>
              <select
                value={offer.status}
                disabled={Boolean(busyId)}
                onChange={event =>
                  updateStatus(offer, event.target.value as OfferStatus)
                }
                className="min-h-12 w-full rounded-xl border border-white/15 bg-[#11160F] px-4 text-sm outline-none focus:border-[#CEFF50] disabled:opacity-40"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'paid' ? 'Full group payment received' : status}
                  </option>
                ))}
              </select>
            </label>

            <p className="mt-4 text-[10px] leading-6 text-white/35">
              {new Date(offer.created_at).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
              })}
            </p>
            <p className="break-all font-mono text-[10px] text-white/25">
              {offer.id}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-white/40">
        Offers are separate from guest registrations. Marking a group paid
        does not create guest records, mark individual passes paid, or issue
        QR codes. Process each attendee through your existing guest workflow
        and apply their agreed offer price.
      </p>
    </section>
  )
}