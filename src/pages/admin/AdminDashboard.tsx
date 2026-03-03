import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type Counts = { tips: number; news: number; winRate: number | null }

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ tips: 0, news: 0, winRate: null })
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    Promise.all([
      supabase.from('tip_cards').select('id', { count: 'exact', head: true }),
      supabase.from('news_articles').select('id', { count: 'exact', head: true }),
      supabase.from('analyst_stats').select('win_rate_pct').order('created_at', { ascending: false }).limit(1),
    ]).then(([tips, news, stats]) => {
      setCounts({
        tips: tips.count ?? 0,
        news: news.count ?? 0,
        winRate: stats.data?.[0]?.win_rate_pct ?? null,
      })
      setLoading(false)
    })
  }, [])

  const cards = [
    {
      label: 'Tip Cards',
      value: loading ? '—' : String(counts.tips),
      link: '/admin/tips',
      action: 'New Tip',
      actionTo: '/admin/tips/new',
      color: '#00c853',
    },
    {
      label: 'News Articles',
      value: loading ? '—' : String(counts.news),
      link: '/admin/news',
      action: 'New Article',
      actionTo: '/admin/news/new',
      color: '#2196f3',
    },
    {
      label: 'Win Rate',
      value: loading ? '—' : counts.winRate !== null ? `${counts.winRate}%` : 'N/A',
      link: '/admin/stats',
      action: 'Update Stats',
      actionTo: '/admin/stats',
      color: '#ff9800',
    },
  ]

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-[#8a9bb0] text-sm mb-6">Overview of your site content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
          >
            <p className="text-xs text-[#8a9bb0] font-medium uppercase tracking-wider">{c.label}</p>
            <p className="text-3xl font-bold" style={{ color: c.color }}>
              {c.value}
            </p>
            <div className="flex gap-2 mt-auto">
              <Link
                to={c.link}
                className="text-xs text-[#8a9bb0] hover:text-white transition-colors"
              >
                View all →
              </Link>
              <span className="text-[#2a3a4a]">·</span>
              <Link
                to={c.actionTo}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                {c.action}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-5" style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
        <p className="text-sm font-semibold text-white mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/tips/new"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
          >
            + New Tip Card
          </Link>
          <Link
            to="/admin/news/new"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-white/10"
            style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
          >
            + New Article
          </Link>
          <Link
            to="/admin/stats"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-white/10"
            style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
          >
            Update Win Rate
          </Link>
          <button
            onClick={() => queryClient.invalidateQueries()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-white/10"
            style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
          >
            Refresh Live Data
          </button>
        </div>
      </div>
    </div>
  )
}
