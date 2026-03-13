import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'
import type { BookmakerEntry } from '@/lib/api'
import { deleteBookmaker } from '@/lib/api'

export default function BookmakersList() {
  const [bookmakers, setBookmakers] = useState<BookmakerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const sb = await getSupabase()
    if (!sb) { setLoading(false); return }
    const { data } = await sb
      .from('bookmakers')
      .select('*')
      .order('rank', { ascending: true })
    setBookmakers((data as BookmakerEntry[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    await deleteBookmaker(id)
    await load()
    setDeletingId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Bookmakers</h1>
          <p className="text-[#8a9bb0] text-sm mt-0.5">Manage review pages, promo codes, and bonuses.</p>
        </div>
        <Link
          to="/admin/bookmakers/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
        >
          + Add Bookmaker
        </Link>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[#8a9bb0] text-sm">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Loading…
        </div>
      )}

      {!loading && bookmakers.length === 0 && (
        <div
          className="rounded-xl p-6 text-center text-[#8a9bb0] text-sm"
          style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
        >
          No bookmakers yet.{' '}
          <Link to="/admin/bookmakers/new" className="text-emerald-400 hover:underline">
            Add the first one →
          </Link>
        </div>
      )}

      {!loading && bookmakers.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #2a3a4a' }}>
                {['#', 'Name', 'Slug', 'Rating', 'Pages', 'Active', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8a9bb0] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookmakers.map((bm) => (
                <tr
                  key={bm.id}
                  style={{ borderBottom: '1px solid #2a3a4a' }}
                  className="hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-mono text-[#8a9bb0]">{bm.rank}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    <div className="flex items-center gap-2">
                      {bm.brand_color && (
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: bm.brand_color }}
                        />
                      )}
                      {bm.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#8a9bb0] text-xs">{bm.slug}</td>
                  <td className="px-4 py-3 text-[#F5A623] font-semibold">
                    {bm.star_rating ? `★ ${bm.star_rating.toFixed(1)}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {bm.show_promo_codes && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">Promos</span>
                      )}
                      {bm.show_sign_up_bonuses && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">Bonuses</span>
                      )}
                      {bm.show_homepage_widget && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-medium">Home</span>
                      )}
                      {bm.featured && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-medium">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${bm.active ? 'text-emerald-400' : 'text-[#8a9bb0]'}`}>
                      {bm.active ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/bookmakers/${bm.id}`}
                        className="text-xs px-2.5 py-1 rounded bg-white/5 text-[#8a9bb0] hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(bm.id, bm.name)}
                        disabled={deletingId === bm.id}
                        className="text-xs px-2.5 py-1 rounded text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        {deletingId === bm.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
