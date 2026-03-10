import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { getSupabase } from '@/lib/supabase'
import { setNewsArchived } from '@/lib/api'

type ArticleRow = {
  id: string
  slug: string
  title: string
  category: string | null
  published_at: string
  archived: boolean
}

export default function NewsList() {
  const [articles, setArticles] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const queryClient = useQueryClient()

  async function load() {
    const sb = await getSupabase()
    if (!sb) { setLoading(false); return }
    const { data } = await sb
      .from('news_articles')
      .select('id, slug, title, category, published_at, archived')
      .order('published_at', { ascending: false })
    setArticles((data as ArticleRow[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    const sb = await getSupabase()
    await sb?.from('news_articles').delete().eq('id', id)
    setArticles((prev) => prev.filter((a) => a.id !== id))
    queryClient.invalidateQueries({ queryKey: ['news-articles'] })
  }

  async function handleToggleArchive(id: string, currentArchived: boolean) {
    setToggling(id)
    await setNewsArchived(id, !currentArchived)
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, archived: !currentArchived } : a))
    )
    queryClient.invalidateQueries({ queryKey: ['news-articles'] })
    setToggling(null)
  }

  const visible = showArchived ? articles : articles.filter((a) => !a.archived)
  const archivedCount = articles.filter((a) => a.archived).length

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">News Articles</h1>
          <p className="text-[#8a9bb0] text-sm">
            {articles.filter((a) => !a.archived).length} live
            {archivedCount > 0 && ` · ${archivedCount} archived`}
          </p>
        </div>
        <Link
          to="/admin/news/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Show archived toggle */}
      {archivedCount > 0 && (
        <button
          onClick={() => setShowArchived((v) => !v)}
          className="mb-4 text-xs text-[#8a9bb0] hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span
            className="w-3.5 h-3.5 border rounded flex items-center justify-center"
            style={{ borderColor: '#2a3a4a', background: showArchived ? '#2a3a4a' : 'transparent' }}
          >
            {showArchived && <span className="text-[8px] text-emerald-400">✓</span>}
          </span>
          Show {archivedCount} archived article{archivedCount !== 1 ? 's' : ''}
        </button>
      )}

      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          <div className="flex items-center gap-2 p-6 text-[#8a9bb0] text-sm">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : visible.length === 0 ? (
          <div className="p-6 text-center text-[#8a9bb0] text-sm rounded-xl" style={{ border: '1px solid #2a3a4a' }}>
            No articles yet.{' '}
            <Link to="/admin/news/new" className="text-emerald-400 hover:underline">Create the first one.</Link>
          </div>
        ) : (
          visible.map((a) => (
            <div
              key={a.id}
              className="rounded-xl p-4"
              style={{
                background: '#1a2634',
                border: `1px solid ${a.archived ? '#3a3030' : '#2a3a4a'}`,
                opacity: a.archived ? 0.7 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-white font-medium text-sm leading-snug flex-1 min-w-0">{a.title}</p>
                {a.archived && (
                  <span className="shrink-0 text-xs px-2 py-0.5 rounded-full" style={{ background: '#3a3030', color: '#8a9bb0' }}>
                    Archived
                  </span>
                )}
              </div>
              <p className="text-[#8a9bb0] text-xs mb-3">
                {a.category ?? '—'} · {new Date(a.published_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={toggling === a.id}
                  onClick={() => handleToggleArchive(a.id, a.archived)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  style={{
                    background: a.archived ? 'rgba(0,180,70,0.12)' : 'rgba(100,100,100,0.12)',
                    color: a.archived ? '#00b446' : '#8a9bb0',
                    border: a.archived ? '1px solid rgba(0,180,70,0.3)' : '1px solid #2a3a4a',
                  }}
                >
                  {toggling === a.id ? '…' : a.archived ? 'Unarchive' : 'Archive'}
                </button>
                <Link
                  to={`/admin/news/${a.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300"
                  style={{ border: '1px solid #2a3a4a' }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(a.id, a.title)}
                  className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300"
                  style={{ border: '1px solid #2a3a4a' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div
        className="hidden md:block rounded-xl overflow-hidden"
        style={{ border: '1px solid #2a3a4a' }}
      >
        {loading ? (
          <div className="flex items-center gap-2 p-6 text-[#8a9bb0] text-sm">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : visible.length === 0 ? (
          <div className="p-6 text-center text-[#8a9bb0] text-sm">
            No articles yet.{' '}
            <Link to="/admin/news/new" className="text-emerald-400 hover:underline">
              Create the first one.
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm" style={{ background: '#1a2634' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a3a4a' }}>
                {['Title', 'Category', 'Published', 'Status', 'Actions'].map((h) => (
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
              {visible.map((a, i) => (
                <tr
                  key={a.id}
                  style={{
                    borderBottom: i < visible.length - 1 ? '1px solid #2a3a4a' : undefined,
                    opacity: a.archived ? 0.65 : 1,
                  }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium max-w-[220px] truncate">{a.title}</td>
                  <td className="px-4 py-3 text-[#8a9bb0] text-xs">{a.category ?? '—'}</td>
                  <td className="px-4 py-3 text-[#8a9bb0] text-xs whitespace-nowrap">
                    {new Date(a.published_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={
                        a.archived
                          ? { background: '#3a3030', color: '#8a9bb0' }
                          : { background: 'rgba(0,180,70,0.1)', color: '#00b446' }
                      }
                    >
                      {a.archived ? 'Archived' : 'Live'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        disabled={toggling === a.id}
                        onClick={() => handleToggleArchive(a.id, a.archived)}
                        className="text-xs font-medium transition-colors disabled:opacity-50"
                        style={{ color: a.archived ? '#00b446' : '#8a9bb0' }}
                      >
                        {toggling === a.id ? '…' : a.archived ? 'Unarchive' : 'Archive'}
                      </button>
                      <Link
                        to={`/admin/news/${a.id}`}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
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
