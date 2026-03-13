import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'
import type { BookmakerEntry } from '@/lib/api'

const inputCls =
  'w-full rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 transition'
const inputStyle = { background: '#0f1923', border: '1px solid #2a3a4a' }
const labelCls = 'block text-xs text-[#8a9bb0] font-medium mb-1'
const checkboxCls = 'w-4 h-4 rounded accent-emerald-500'

function ColorField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded cursor-pointer border-0 p-0.5"
          style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
        />
        <input
          className={inputCls}
          style={inputStyle}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#1A56DB"
        />
      </div>
    </div>
  )
}

function ListEditor({
  label, items, onChange,
}: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputCls}
              style={inputStyle}
              value={item}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
              placeholder={`${label} item…`}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-300 px-2 shrink-0 text-sm"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="text-xs text-emerald-400 hover:text-emerald-300 text-left"
        >
          + Add item
        </button>
      </div>
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" className={checkboxCls} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-white">{label}</span>
    </label>
  )
}

const EMPTY: Omit<BookmakerEntry, 'id'> = {
  rank: 99,
  name: '',
  slug: '',
  logo_url: '',
  logo_bg_color: '',
  brand_color: '',
  active: true,
  star_rating: undefined,
  offer_headline: '',
  offer_subheadline: '',
  promo_code: '',
  claim_url: '',
  last_used_text: '',
  terms: '',
  show_promo_codes: false,
  show_sign_up_bonuses: false,
  show_homepage_widget: false,
  featured: false,
  review_body: '',
  pros: [],
  cons: [],
  our_score: undefined,
  screenshot_url: '',
  meta_title: '',
  meta_description: '',
}

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export default function BookmakerForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState<Omit<BookmakerEntry, 'id'>>(EMPTY)
  const [slugManual, setSlugManual] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) { setLoading(false); return }
    getSupabase().then((sb) => {
      if (!sb) { setLoading(false); return }
      sb.from('bookmakers').select('*').eq('id', id).single().then(({ data, error: err }) => {
        if (err || !data) { setError('Bookmaker not found'); setLoading(false); return }
        const bm = data as BookmakerEntry
        setForm({
          rank: bm.rank,
          name: bm.name,
          slug: bm.slug,
          logo_url: bm.logo_url ?? '',
          logo_bg_color: bm.logo_bg_color ?? '',
          brand_color: bm.brand_color ?? '',
          active: bm.active,
          star_rating: bm.star_rating,
          offer_headline: bm.offer_headline ?? '',
          offer_subheadline: bm.offer_subheadline ?? '',
          promo_code: bm.promo_code ?? '',
          claim_url: bm.claim_url ?? '',
          last_used_text: bm.last_used_text ?? '',
          terms: bm.terms ?? '',
          show_promo_codes: bm.show_promo_codes,
          show_sign_up_bonuses: bm.show_sign_up_bonuses,
          show_homepage_widget: bm.show_homepage_widget,
          featured: bm.featured,
          review_body: bm.review_body ?? '',
          pros: bm.pros ?? [],
          cons: bm.cons ?? [],
          our_score: bm.our_score,
          screenshot_url: bm.screenshot_url ?? '',
          meta_title: bm.meta_title ?? '',
          meta_description: bm.meta_description ?? '',
        })
        setSlugManual(true)
        setLoading(false)
      })
    })
  }, [id, isEdit])

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleNameChange(v: string) {
    set('name', v)
    if (!isEdit && !slugManual) set('slug', slugify(v))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const sb = await getSupabase()
    if (!sb) return
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      star_rating: form.star_rating ?? null,
      our_score: form.our_score ?? null,
      logo_url: form.logo_url || null,
      logo_bg_color: form.logo_bg_color || null,
      brand_color: form.brand_color || null,
      offer_headline: form.offer_headline || null,
      offer_subheadline: form.offer_subheadline || null,
      promo_code: form.promo_code || null,
      claim_url: form.claim_url || null,
      last_used_text: form.last_used_text || null,
      terms: form.terms || null,
      review_body: form.review_body || null,
      pros: (form.pros ?? []).length > 0 ? form.pros : null,
      cons: (form.cons ?? []).length > 0 ? form.cons : null,
      screenshot_url: form.screenshot_url || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    }

    let err
    if (isEdit) {
      ;({ error: err } = await sb.from('bookmakers').update(payload).eq('id', id))
    } else {
      ;({ error: err } = await sb.from('bookmakers').insert(payload))
    }

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      navigate('/admin/bookmakers')
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
        {isEdit ? 'Edit Bookmaker' : 'New Bookmaker'}
      </h1>
      <p className="text-[#8a9bb0] text-sm mb-6">
        {isEdit ? 'Update bookmaker details and save.' : 'Fill in all sections and publish.'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* ── Identity ── */}
        <section className="rounded-xl p-5 flex flex-col gap-4" style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
          <p className="text-sm font-semibold text-white">Identity</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Rank *</label>
              <input
                type="number" required min={1}
                className={inputCls} style={inputStyle}
                value={form.rank}
                onChange={(e) => set('rank', parseInt(e.target.value, 10) || 99)}
              />
            </div>
            <div className="flex items-end">
              <Toggle label="Active (visible)" checked={form.active} onChange={(v) => set('active', v)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Bookmaker Name *</label>
            <input
              required className={inputCls} style={inputStyle}
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>URL Slug * (e.g. "paripesa")</label>
            <input
              required className={inputCls} style={inputStyle}
              value={form.slug}
              onChange={(e) => { set('slug', e.target.value); setSlugManual(true) }}
              placeholder="auto-generated-from-name"
            />
            <p className="text-xs text-[#8a9bb0] mt-1">
              Page will be live at <span className="text-emerald-400">/bookmakers/{form.slug || '…'}</span>
            </p>
          </div>

          <div>
            <label className={labelCls}>Logo URL</label>
            <input
              className={inputCls} style={inputStyle}
              value={form.logo_url ?? ''}
              onChange={(e) => set('logo_url', e.target.value)}
              placeholder="https://… or /logos/paripesa.png"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Logo Background Colour" value={form.logo_bg_color ?? ''} onChange={(v) => set('logo_bg_color', v)} />
            <ColorField label="Brand Primary Colour" value={form.brand_color ?? ''} onChange={(v) => set('brand_color', v)} />
          </div>
        </section>

        {/* ── Offer Content ── */}
        <section className="rounded-xl p-5 flex flex-col gap-4" style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
          <p className="text-sm font-semibold text-white">Offer Content</p>

          <div>
            <label className={labelCls}>Star Rating (e.g. 9.8)</label>
            <input
              type="number" step="0.1" min="0" max="10"
              className={inputCls} style={inputStyle}
              value={form.star_rating ?? ''}
              onChange={(e) => set('star_rating', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>

          <div>
            <label className={labelCls}>Offer Headline</label>
            <input
              className={inputCls} style={inputStyle}
              value={form.offer_headline ?? ''}
              onChange={(e) => set('offer_headline', e.target.value)}
              placeholder="e.g. Deposit KES 1,000 Get KES 3,000"
            />
          </div>

          <div>
            <label className={labelCls}>Offer Sub-headline</label>
            <input
              className={inputCls} style={inputStyle}
              value={form.offer_subheadline ?? ''}
              onChange={(e) => set('offer_subheadline', e.target.value)}
              placeholder="e.g. Use code MYFREETIP for your welcome bonus"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Promo Code</label>
              <input
                className={inputCls} style={inputStyle}
                value={form.promo_code ?? ''}
                onChange={(e) => set('promo_code', e.target.value)}
                placeholder="MYFREETIP"
              />
            </div>
            <div>
              <label className={labelCls}>Last Used Text (optional)</label>
              <input
                className={inputCls} style={inputStyle}
                value={form.last_used_text ?? ''}
                onChange={(e) => set('last_used_text', e.target.value)}
                placeholder="Last used 4 mins ago"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Claim / Affiliate URL</label>
            <input
              type="url"
              className={inputCls} style={inputStyle}
              value={form.claim_url ?? ''}
              onChange={(e) => set('claim_url', e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div>
            <label className={labelCls}>Terms & Conditions</label>
            <textarea
              rows={3}
              className={inputCls} style={inputStyle}
              value={form.terms ?? ''}
              onChange={(e) => set('terms', e.target.value)}
              placeholder="New customers only. Min deposit KES 1,000. …"
            />
          </div>
        </section>

        {/* ── Page Visibility ── */}
        <section className="rounded-xl p-5 flex flex-col gap-3" style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
          <p className="text-sm font-semibold text-white">Page Visibility</p>
          <Toggle label="Show on Promo Codes page (/promo-codes)" checked={form.show_promo_codes} onChange={(v) => set('show_promo_codes', v)} />
          <Toggle label="Show on Sign Up Bonuses page (/sign-up-bonuses)" checked={form.show_sign_up_bonuses} onChange={(v) => set('show_sign_up_bonuses', v)} />
          <Toggle label="Show on Homepage widget" checked={form.show_homepage_widget} onChange={(v) => set('show_homepage_widget', v)} />
          <Toggle label="Featured (appears in homepage top slot)" checked={form.featured} onChange={(v) => set('featured', v)} />
        </section>

        {/* ── Review Content ── */}
        <section className="rounded-xl p-5 flex flex-col gap-4" style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
          <p className="text-sm font-semibold text-white">Review Content</p>
          <p className="text-xs text-[#8a9bb0]">Used on the individual review page (/bookmakers/{form.slug || '…'})</p>

          <div>
            <label className={labelCls}>Review Body</label>
            <textarea
              rows={10}
              className={inputCls}
              style={{ ...inputStyle, fontFamily: 'monospace', lineHeight: '1.6' }}
              value={form.review_body ?? ''}
              onChange={(e) => set('review_body', e.target.value)}
              placeholder="Write the full review here. Separate paragraphs with a blank line (two newlines). Aim for 400–600 words."
            />
            <p className="text-xs text-[#8a9bb0] mt-1">Paragraphs are separated by blank lines.</p>
          </div>

          <ListEditor
            label="Pros (3–5 items)"
            items={form.pros ?? []}
            onChange={(v) => set('pros', v)}
          />

          <ListEditor
            label="Cons (2–4 items)"
            items={form.cons ?? []}
            onChange={(v) => set('cons', v)}
          />

          <div>
            <label className={labelCls}>Our Score (out of 10, e.g. 9.8)</label>
            <input
              type="number" step="0.1" min="0" max="10"
              className={inputCls} style={inputStyle}
              value={form.our_score ?? ''}
              onChange={(e) => set('our_score', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>

          <div>
            <label className={labelCls}>Platform Screenshot URL</label>
            <input
              className={inputCls} style={inputStyle}
              value={form.screenshot_url ?? ''}
              onChange={(e) => set('screenshot_url', e.target.value)}
              placeholder="https://… or /images/paripesa-screenshot.webp"
            />
          </div>
        </section>

        {/* ── SEO ── */}
        <section className="rounded-xl p-5 flex flex-col gap-4" style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
          <p className="text-sm font-semibold text-white">SEO</p>

          <div>
            <label className={labelCls}>Meta Title</label>
            <input
              className={inputCls} style={inputStyle}
              value={form.meta_title ?? ''}
              onChange={(e) => set('meta_title', e.target.value)}
              placeholder="Paripesa Review 2026 — Honest Assessment | MyFreeTip"
            />
            <p className="text-xs text-[#8a9bb0] mt-1">{(form.meta_title ?? '').length} / 60 chars recommended</p>
          </div>

          <div>
            <label className={labelCls}>Meta Description</label>
            <textarea
              rows={2}
              className={inputCls} style={inputStyle}
              value={form.meta_description ?? ''}
              onChange={(e) => set('meta_description', e.target.value)}
              placeholder="Honest Paripesa review for 2026. Welcome bonus, odds, M-Pesa payments assessed."
            />
            <p className="text-xs text-[#8a9bb0] mt-1">{(form.meta_description ?? '').length} / 160 chars recommended</p>
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
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Bookmaker'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/bookmakers')}
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
