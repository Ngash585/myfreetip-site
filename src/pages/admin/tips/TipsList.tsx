import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type TipRow = {
  id: string
  title: string
  type: string
  result: string
  expires_at: string | null
  created_at: string
}

const RESULT_COLOR: Record<string, string> = {
  win: '#00c853',
  loss: '#f44336',
  pending: '#ff9800',
}

export default function TipsList() {
  const [tips, setTips] = useState<TipRow[]>([])
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  async function load() {
    if (!supabase) { setLoading(false); return }
    const { data } = await supabase
      .from('tip_cards')
      .select('id, title, type, result, expires_at, created_at')
      .order('created_at', { ascending: false })
    setTips((data as TipRow[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    await supabase!.from('tip_cards').delete().eq('id', id)
    setTips((prev) => prev.filter((t) => t.id !== id))
    queryClient.invalidateQueries({ queryKey: ['tip-cards'] })
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Tip Cards</h1>
          <p className="text-[#8a9bb0] text-sm">{tips.length} total</p>
        </div>
        <Link
          to="/admin/tips/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
        >
          + New Tip
        </Link>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid #2a3a4a' }}
      >
        {loading ? (
          <div className="flex items-center gap-2 p-6 text-[#8a9bb0] text-sm">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : tips.length === 0 ? (
          <div className="p-6 text-center text-[#8a9bb0] text-sm">
            No tip cards yet.{' '}
            <Link to="/admin/tips/new" className="text-emerald-400 hover:underline">
              Create the first one.
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm" style={{ background: '#1a2634' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a3a4a' }}>
                {['Title', 'Type', 'Result', 'Expires', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: '#8a9bb0' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tips.map((tip, i) => (
                <tr
                  key={tip.id}
                  style={{
                    borderBottom: i < tips.length - 1 ? '1px solid #2a3a4a' : undefined,
                  }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium max-w-[200px] truncate">
                    {tip.title}
                  </td>
                  <td className="px-4 py-3 text-[#8a9bb0] capitalize">{tip.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium capitalize"
                      style={{
                        color: RESULT_COLOR[tip.result] ?? '#8a9bb0',
                        background: (RESULT_COLOR[tip.result] ?? '#8a9bb0') + '22',
                      }}
                    >
                      {tip.result}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#8a9bb0] text-xs">
                    {tip.expires_at
                      ? new Date(tip.expires_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/tips/${tip.id}`}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(tip.id, tip.title)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
