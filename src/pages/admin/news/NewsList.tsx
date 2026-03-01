import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

type ArticleRow = {
  id: string
  slug: string
  title: string
  category: string | null
  published_at: string
}

export default function NewsList() {
  const [articles, setArticles] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!supabase) { setLoading(false); return }
    const { data } = await supabase
      .from('news_articles')
      .select('id, slug, title, category, published_at')
      .order('published_at', { ascending: false })
    setArticles((data as ArticleRow[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    await supabase!.from('news_articles').delete().eq('id', id)
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">News Articles</h1>
          <p className="text-[#8a9bb0] text-sm">{articles.length} total</p>
        </div>
        <Link
          to="/admin/news/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors"
        >
          + New Article
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a3a4a' }}>
        {loading ? (
          <div className="flex items-center gap-2 p-6 text-[#8a9bb0] text-sm">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            Loading…
          </div>
        ) : articles.length === 0 ? (
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
                {['Title', 'Category', 'Published', 'Actions'].map((h) => (
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
              {articles.map((a, i) => (
                <tr
                  key={a.id}
                  style={{ borderBottom: i < articles.length - 1 ? '1px solid #2a3a4a' : undefined }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 text-white font-medium max-w-[220px] truncate">{a.title}</td>
                  <td className="px-4 py-3 text-[#8a9bb0] text-xs">{a.category ?? '—'}</td>
                  <td className="px-4 py-3 text-[#8a9bb0] text-xs">
                    {new Date(a.published_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
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
