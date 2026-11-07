'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { OFFER_DISCOUNTS } from '@/lib/offer-types'

export function AdminWheelOdds() {
  const [values, setValues] = useState<string[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch('/api/raat-offers?action=config', {
          cache: 'no-store',
          signal: controller.signal,
        })
        const data = await response.json()

        if (!response.ok || !Array.isArray(data.odds)) {
          throw new Error(data.error || 'Could not load wheel odds.')
        }

        setValues(data.odds.map(String))
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Could not load wheel odds.')
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  const total = values?.reduce((sum, value) => sum + Number(value), 0) ?? 0
  const valid =
    total === 100 &&
    values?.every(value => /^\d{1,3}$/.test(value) && Number(value) <= 100)

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!values || !valid || saving) return

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/raat-offers?action=odds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ odds: values.map(Number) }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not save wheel odds.')
      }

      setValues(data.odds.map(String))
      setMessage('Wheel odds saved for new spins.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save wheel odds.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={save}
      className="rounded-2xl border border-white/10 bg-[#11160F] p-6"
    >
      <h2 className="text-xl font-black">Wheel odds</h2>
      <p className="mt-2 text-sm text-white/60">
        Enter whole percentages that add up to 100%. Set a prize to 0% to disable it.
      </p>

      {values && (
        <>
          <fieldset
            disabled={saving}
            className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {OFFER_DISCOUNTS.map((discount, index) => (
              <label key={discount} className="block text-sm">
                ₹{discount} off (%)
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  required
                  value={values[index]}
                  onChange={event => {
                    const next = [...values]
                    next[index] = event.target.value
                    setValues(next)
                    setMessage('')
                  }}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
                />
              </label>
            ))}
          </fieldset>

          <p className="mt-4 text-sm">Total: {total}%</p>
          <button
            type="submit"
            disabled={!valid || saving}
            className="mt-4 rounded-full bg-[#CEFF50] px-5 py-2 text-sm font-black text-black disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save wheel odds'}
          </button>
        </>
      )}

      {!values && !error && <p className="mt-4 text-sm">Loading odds…</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
      {message && <p role="status" className="mt-4 text-sm text-[#CEFF50]">{message}</p>}
    </form>
  )
}