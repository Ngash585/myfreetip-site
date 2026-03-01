import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  'Premier League',
  'Champions League',
  'Football',
  'Betting Tips',
  'Betting Academy',
  'Big Wins',
]

const inputCls =
  'w-full rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 transition'
const inputStyle = { background: '#0f1923', border: '1px solid #2a3a4a' }
const labelCls = 'block text-xs text-[#8a9bb0] font-medium mb-1'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function NewsForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [coverUrl, setCoverUrl] = useState('')
  const [publishedAt, setPublishedAt] = useState(toDatetimeLocal(new Date().toISOString()))
  const [author, setAuthor] = useState('TipMaster')
  const [affiliateLabel, setAffiliateLabel] = useState('')
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Auto-generate slug from title (only on create, only until user edits slug manually)
  function handleTitleChange(v: string) {
    setTitle(v)
    if (!isEdit && !slugManuallyEdited) setSlug(slugify(v))
  }

  useEffect(() => {
    if (!isEdit || !supabase) { setLoading(false); return }
    supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) { setError('Article not found'); setLoading(false); return }
        setSlug(data.slug ?? '')
        setTitle(data.title ?? '')
        setExcerpt(data.excerpt ?? '')
        setBody(data.body ?? '')
        setCategory(data.category ?? CATEGORIES[0])
        setCoverUrl(data.cover_url ?? '')
        setPublishedAt(data.published_at ? toDatetimeLocal(data.published_at) : '')
        setAuthor(data.author ?? '')
        setAffiliateLabel(data.affiliate_label ?? '')
        setAffiliateUrl(data.affiliate_url ?? '')
        setLoading(false)
      })
  }, [id, isEdit])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError('')

    const payload = {
      slug,
      title,
      excerpt: excerpt || null,
      body: body || null,
      category: category || null,
      cover_url: coverUrl || null,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      author: author || null,
      affiliate_label: affiliateLabel || null,
      affiliate_url: affiliateUrl || null,
    }

    let err
    if (isEdit) {
      ;({ error: err } = await supabase.from('news_articles').update(payload).eq('id', id))
    } else {
      ;({ error: err } = await supabase.from('news_articles').insert(payload))
    }

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      navigate('/admin/news')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#8a9bb0] text-sm">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        Loading…
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-1">
        {isEdit ? 'Edit Article' : 'New Article'}
      </h1>
      <p className="text-[#8a9bb0] text-sm mb-6">
        {isEdit ? 'Update the article and save.' : 'Fill in the details and publish.'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* ── Core ── */}
        <section
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
        >
          <p className="text-sm font-semibold text-white">Article Details</p>

          <div>
            <label className={labelCls}>Title *</label>
            <input
              required
              className={inputCls}
              style={inputStyle}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Slug (URL) *</label>
            <input
              required
              className={inputCls}
              style={inputStyle}
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                setSlugManuallyEdited(true)
              }}
              placeholder="auto-generated-from-title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category</label>
              <select
                className={inputCls}
                style={inputStyle}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input
                className={inputCls}
                style={inputStyle}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Published At</label>
              <input
                type="datetime-local"
                className={inputCls}
                style={inputStyle}
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Cover Image URL</label>
              <input
                className={inputCls}
                style={inputStyle}
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="/images/cover.webp"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Excerpt</label>
            <textarea
              rows={2}
              className={inputCls}
              style={inputStyle}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary shown on the news listing page"
            />
          </div>

          <div>
            <label className={labelCls}>Body *</label>
            <textarea
              required
              rows={12}
              className={inputCls}
              style={{ ...inputStyle, fontFamily: 'monospace', lineHeight: '1.6' }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Article body. Separate paragraphs with a blank line."
            />
            <p className="text-xs text-[#8a9bb0] mt-1">Paragraphs are separated by blank lines (two newlines).</p>
          </div>
        </section>

        {/* ── Affiliate ── */}
        <section
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
        >
          <p className="text-sm font-semibold text-white">Affiliate CTA (optional)</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>CTA Label</label>
              <input
                className={inputCls}
                style={inputStyle}
                value={affiliateLabel}
                onChange={(e) => setAffiliateLabel(e.target.value)}
                placeholder="e.g. Get the Accumulator on 1xBet"
              />
            </div>
            <div>
              <label className={labelCls}>CTA URL</label>
              <input
                className={inputCls}
                style={inputStyle}
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="text-red-400 text-xs rounded-lg px-3 py-2" style={{ background: '#2a1a1a' }}>
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Article'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/news')}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#8a9bb0] hover:text-white transition-colors"
            style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function toDatetimeLocal(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
