import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already signed in
  useEffect(() => {
    if (!isSupabaseConfigured) return
    getSupabase().then((sb) => {
      if (!sb) return
      sb.auth.getSession().then(({ data }) => {
        if (data.session) navigate('/admin', { replace: true })
      })
    })
  }, [navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const sb = await getSupabase()
    if (!sb) {
      setError('Supabase is not configured. Set env vars in .env.local')
      return
    }
    setLoading(true)
    setError('')
    const { error: err } = await sb.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0f1923' }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
      >
        <div className="mb-8 text-center">
          <p className="text-emerald-400 font-bold text-lg tracking-wide">MyFreeTip</p>
          <p className="text-[#8a9bb0] text-sm mt-1">Admin Panel — Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#8a9bb0] font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none transition focus:ring-2 focus:ring-emerald-500"
              style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#8a9bb0] font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none transition focus:ring-2 focus:ring-emerald-500"
              style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs rounded-lg px-3 py-2" style={{ background: '#2a1a1a' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#8a9bb0]">
          Team members are added via the Supabase dashboard.
        </p>
      </div>
    </div>
  )
}
