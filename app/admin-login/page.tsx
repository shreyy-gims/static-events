'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Unable to log in.')
        return
      }

      setPassword('')
      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Unable to reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080A07] px-5 py-16 text-[#F5F6EE]">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-widest text-white/50 transition hover:text-[#CEFF50]"
        >
          ← Back to STATIC
        </Link>

        <section className="mt-8 border border-white/15 bg-[#11160F] p-7 sm:p-10">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#CEFF50]">
            STATIC / PRIVATE ACCESS
          </p>

          <h1 className="mt-5 text-4xl font-black uppercase tracking-tight">
            Admin login
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/50">
            Sign in to manage guests, payments and entry codes.
          </p>

          <form onSubmit={handleLogin} className="mt-8">
            <fieldset disabled={loading} className="space-y-6">
              <div>
                <label
                  htmlFor="admin-username"
                  className="text-xs font-bold uppercase tracking-wider text-white/65"
                >
                  Username
                </label>

                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={100}
                  required
                  className="mt-3 min-h-12 w-full border border-white/20 bg-[#080A07] px-4 py-3 text-base outline-none focus:border-[#CEFF50]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="text-xs font-bold uppercase tracking-wider text-white/65"
                >
                  Password
                </label>

                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  maxLength={512}
                  required
                  className="mt-3 min-h-12 w-full border border-white/20 bg-[#080A07] px-4 py-3 text-base outline-none focus:border-[#CEFF50]"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="border border-red-400/40 bg-red-950/30 p-4 text-sm leading-6 text-red-200"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="min-h-12 w-full bg-[#CEFF50] px-6 py-4 text-sm font-black uppercase tracking-wider text-[#080A07] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Sign in ↗'}
              </button>
            </fieldset>
          </form>
        </section>
      </div>
    </main>
  )
}