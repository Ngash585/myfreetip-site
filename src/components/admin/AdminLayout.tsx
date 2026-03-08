import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/tips', label: 'Tips', icon: '⚽' },
  { to: '/admin/news', label: 'News', icon: '📰' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await supabase!.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const navItems = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-[#8a9bb0] hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <span>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f1923', color: '#e2e8f0' }}>
      {/* Top header bar */}
      <header
        className="flex items-center justify-between px-4 h-14 border-b shrink-0"
        style={{ background: '#1a2634', borderColor: '#2a3a4a' }}
      >
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-1.5 rounded text-[#8a9bb0] hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <span className="text-emerald-400 font-bold tracking-wide text-sm">MyFreeTip</span>
          <span className="text-[#2a3a4a]">|</span>
          <span className="text-[#8a9bb0] text-sm">Admin Panel</span>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-xs px-3 py-1.5 rounded bg-white/5 text-[#8a9bb0] hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — desktop */}
        <aside
          className="hidden md:flex flex-col w-48 shrink-0 border-r"
          style={{ background: '#1a2634', borderColor: '#2a3a4a' }}
        >
          {navItems}
        </aside>

        {/* Sidebar — mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <aside
              className="absolute left-0 top-14 bottom-0 w-48"
              style={{ background: '#1a2634', borderRight: '1px solid #2a3a4a' }}
            >
              {navItems}
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
