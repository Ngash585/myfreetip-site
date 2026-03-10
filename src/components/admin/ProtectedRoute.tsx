import { useState, useEffect, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    let unsubscribe: (() => void) | null = null
    getSupabase().then((sb) => {
      if (!sb) { setLoading(false); return }
      sb.auth.getSession().then(({ data }) => {
        setSession(data.session)
        setLoading(false)
      })
      const { data: sub } = sb.auth.onAuthStateChange((_, s) => setSession(s))
      unsubscribe = () => sub.subscription.unsubscribe()
    })
    return () => { if (unsubscribe) unsubscribe() }
  }, [])

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f1923', color: '#8a9bb0' }}>
        <p className="text-center">Supabase is not configured.<br />Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f1923' }}>
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
