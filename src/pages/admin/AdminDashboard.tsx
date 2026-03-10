import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabase } from '@/lib/supabase'
import { getAnalystStats } from '@/lib/api'

async function getDashboardCounts() {
  const sb = await getSupabase()
  if (!sb) return { tips: 0, news: 0 }
  const [tips, news] = await Promise.all([
    sb.from('tip_cards').select('id', { count: 'exact', head: true }),
    sb.from('news_articles').select('id', { count: 'exact', head: true }),
  ])
  return { tips: tips.count ?? 0, news: news.count ?? 0 }
}

export default function AdminDashboard() {
  const queryClient = useQueryClient()

  const { data: counts, isLoading: countsLoading } = useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: getDashboardCounts,
    staleTime: 30_000,
  })

  const { data: statsPayload, isLoading: statsLoading } = useQuery({
    queryKey: ['analyst-stats'],
    queryFn: getAnalystStats,
    staleTime: 30_000,
  })

  const stats = statsPayload?.records[0]
  const loading = countsLoading || statsLoading

  function handleRefresh() {
    queryClient.invalidateQueries()
  }

  const cards = [
    {
      label: 'Tip Cards',
      value: loading ? '—' : String(counts?.tips ?? 0),
      link: '/admin/tips',
      action: 'New Tip',
      actionTo: '/admin/tips/new',
      color: '#00c853',
    },
    {
      label: 'News Articles',
      value: loading ? '—' : String(counts?.news ?? 0),
      link: '/admin/news',
      action: 'New Article',
      actionTo: '/admin/news/new',
      color: '#2196f3',
    },
    {
      label: 'Win Rate',
      value: loading ? '—' : stats ? `${stats.win_rate_pct}%` : 'N/A',
      sub: loading || !stats ? null : `${stats.won}W · ${stats.lost}L`,
      link: '/admin/tips',
      action: 'View Tips',
      actionTo: '/admin/tips',
      color: '#00c853',
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
            <div>
              <p className="text-3xl font-bold" style={{ color: c.color }}>{c.value}</p>
              {c.sub && <p className="text-xs mt-1" style={{ color: '#8a9bb0' }}>{c.sub}</p>}
            </div>
            <div className="flex gap-2 mt-auto">
              <Link to={c.link} className="text-xs text-[#8a9bb0] hover:text-white transition-colors">
                View all →
              </Link>
              <span className="text-[#2a3a4a]">·</span>
              <Link to={c.actionTo} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
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
          <button
            onClick={handleRefresh}
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
