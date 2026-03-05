import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// ─── Sub-types ────────────────────────────────────────────────────────────────

type LegDraft = {
  _key: string
  home_team: string
  away_team: string
  match_label: string
  league: string
  kickoff_iso: string
  kickoff_label: string
  prediction: string
  pick_title: string
  odds: string
  short_reason: string
  sort_order: number
}

type BookieDraft = {
  _key: string
  bookie_id: string
  code: string
  is_default: boolean
  return_5: string
  return_10: string
  return_20: string
}

type BookieOption = { id: string; name: string }

function makeLeg(sort_order = 0): LegDraft {
  return {
    _key: crypto.randomUUID(),
    home_team: '', away_team: '', match_label: '', league: '',
    kickoff_iso: '', kickoff_label: '', prediction: '', pick_title: '',
    odds: '', short_reason: '', sort_order,
  }
}

function makeBookie(): BookieDraft {
  return {
    _key: crypto.randomUUID(),
    bookie_id: '', code: '', is_default: false,
    return_5: '', return_10: '', return_20: '',
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputCls = 'w-full rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 transition'
const inputStyle = { background: '#0f1923', border: '1px solid #2a3a4a' }
const labelCls = 'block text-xs text-[#8a9bb0] font-medium mb-1'
const sectionCls = 'rounded-xl p-5 flex flex-col gap-4'

// ─── Component ────────────────────────────────────────────────────────────────

export default function TipForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = Boolean(id)

  // core fields
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'single' | 'accumulator'>('single')
  const [badgeLabel, setBadgeLabel] = useState('')
  const [totalOddsLabel, setTotalOddsLabel] = useState('')
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium')
  const [result, setResult] = useState<'pending' | 'win' | 'loss'>('pending')
  const [expiresAt, setExpiresAt] = useState('')
  const [analyst, setAnalyst] = useState('')
  const [category, setCategory] = useState('')
  const [defaultBookieId, setDefaultBookieId] = useState('')

  // legs + bookies
  const [legs, setLegs] = useState<LegDraft[]>([makeLeg()])
  const [bookieDrafts, setBookieDrafts] = useState<BookieDraft[]>([makeBookie()])
  const [bookieOptions, setBookieOptions] = useState<BookieOption[]>([])

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Load bookie options
  useEffect(() => {
    if (!supabase) return
    supabase.from('bookies').select('id, name').order('name').then(({ data }) => {
      if (data) setBookieOptions(data as BookieOption[])
    })
  }, [])

  // Load existing tip if editing
  useEffect(() => {
    if (!isEdit || !supabase) { setLoading(false); return }
    supabase
      .from('tip_cards')
      .select(`*, legs(*), card_bookies(*)`)
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) { setError('Tip not found'); setLoading(false); return }
        setTitle(data.title ?? '')
        setType(data.type ?? 'single')
        setBadgeLabel(data.badge_label ?? '')
        setTotalOddsLabel(data.total_odds_label ?? '')
        setConfidence(data.confidence ?? 'medium')
        setResult(data.result ?? 'pending')
        setExpiresAt(data.expires_at ? toDatetimeLocal(data.expires_at) : '')
        setAnalyst(data.analyst ?? '')
        setCategory(data.category ?? '')
        setDefaultBookieId(data.default_bookie_id ?? '')
        if (data.legs?.length) {
          setLegs(
            [...data.legs]
              .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
              .map((l: Record<string, unknown>, i: number) => ({
                _key: String(l.id ?? crypto.randomUUID()),
                home_team: String(l.home_team ?? ''),
                away_team: String(l.away_team ?? ''),
                match_label: String(l.match_label ?? ''),
                league: String(l.league ?? ''),
                kickoff_iso: l.kickoff_iso ? toDatetimeLocal(String(l.kickoff_iso)) : '',
                kickoff_label: String(l.kickoff_label ?? ''),
                prediction: String(l.prediction ?? ''),
                pick_title: String(l.pick_title ?? ''),
                odds: String(l.odds ?? ''),
                short_reason: String(l.short_reason ?? ''),
                sort_order: i,
              }))
          )
        }
        if (data.card_bookies?.length) {
          setBookieDrafts(
            data.card_bookies.map((cb: Record<string, unknown>) => ({
              _key: String(cb.id ?? crypto.randomUUID()),
              bookie_id: String(cb.bookie_id ?? ''),
              code: String(cb.code ?? ''),
              is_default: Boolean(cb.is_default),
              return_5: cb.return_5 != null ? String(cb.return_5) : '',
              return_10: cb.return_10 != null ? String(cb.return_10) : '',
              return_20: cb.return_20 != null ? String(cb.return_20) : '',
            }))
          )
        }
        setLoading(false)
      })
  }, [id, isEdit])

  // ─── Leg helpers ────────────────────────────────────────────────────────────

  function updateLeg(key: string, field: keyof LegDraft, value: string | number) {
    setLegs((prev) => prev.map((l) => (l._key === key ? { ...l, [field]: value } : l)))
  }
  function addLeg() { setLegs((prev) => [...prev, makeLeg(prev.length)]) }
  function removeLeg(key: string) { setLegs((prev) => prev.filter((l) => l._key !== key)) }

  // ─── Bookie helpers ─────────────────────────────────────────────────────────

  function updateBookie(key: string, field: keyof BookieDraft, value: string | boolean) {
    setBookieDrafts((prev) =>
      prev.map((b) => (b._key === key ? { ...b, [field]: value } : b))
    )
  }
  function addBookieDraft() { setBookieDrafts((prev) => [...prev, makeBookie()]) }
  function removeBookieDraft(key: string) {
    setBookieDrafts((prev) => prev.filter((b) => b._key !== key))
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError('')

    const cardPayload = {
      title,
      type,
      badge_label: badgeLabel || null,
      total_odds_label: totalOddsLabel || null,
      confidence,
      result,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      analyst: analyst || null,
      category: category || null,
      default_bookie_id: defaultBookieId || null,
    }

    let cardId = id ?? ''

    if (isEdit) {
      const { error: err } = await supabase.from('tip_cards').update(cardPayload).eq('id', cardId)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { data, error: err } = await supabase.from('tip_cards').insert(cardPayload).select().single()
      if (err || !data) { setError(err?.message ?? 'Insert failed'); setSaving(false); return }
      cardId = data.id
    }

    // Re-insert legs
    await supabase.from('legs').delete().eq('card_id', cardId)
    if (legs.length > 0) {
      const legsPayload = legs.map((l, i) => ({
        card_id: cardId,
        home_team: l.home_team,
        away_team: l.away_team,
        match_label: l.match_label || `${l.home_team} vs ${l.away_team}`,
        league: l.league || null,
        kickoff_iso: l.kickoff_iso ? new Date(l.kickoff_iso).toISOString() : null,
        kickoff_label: l.kickoff_label || null,
        prediction: l.prediction || null,
        pick_title: l.pick_title || null,
        odds: l.odds || null,
        short_reason: l.short_reason || null,
        sort_order: i,
      }))
      const { error: legsErr } = await supabase.from('legs').insert(legsPayload)
      if (legsErr) { setError(legsErr.message); setSaving(false); return }
    }

    // Re-insert card_bookies
    await supabase.from('card_bookies').delete().eq('card_id', cardId)
    const validBookies = bookieDrafts.filter((b) => b.bookie_id)
    if (validBookies.length > 0) {
      const bookiesPayload = validBookies.map((b) => ({
        card_id: cardId,
        bookie_id: b.bookie_id,
        code: b.code || null,
        is_default: b.is_default,
        return_5: b.return_5 ? Number(b.return_5) : null,
        return_10: b.return_10 ? Number(b.return_10) : null,
        return_20: b.return_20 ? Number(b.return_20) : null,
      }))
      const { error: bookiesErr } = await supabase.from('card_bookies').insert(bookiesPayload)
      if (bookiesErr) { setError(bookiesErr.message); setSaving(false); return }
    }

    setSaving(false)
    queryClient.invalidateQueries({ queryKey: ['tip-cards'] })
    navigate('/admin/tips')
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

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
        {isEdit ? 'Edit Tip Card' : 'New Tip Card'}
      </h1>
      <p className="text-[#8a9bb0] text-sm mb-6">
        {isEdit ? 'Update the details below and save.' : 'Fill in the details and publish.'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* ── Core Fields ── */}
        <section className={sectionCls} style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
          <p className="text-sm font-semibold text-white">Core Details</p>

          <div>
            <label className={labelCls}>Title *</label>
            <input required className={inputCls} style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Type *</label>
              <select
                className={inputCls} style={inputStyle}
                value={type} onChange={(e) => setType(e.target.value as 'single' | 'accumulator')}
              >
                <option value="single">Single</option>
                <option value="accumulator">Accumulator</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Confidence *</label>
              <select
                className={inputCls} style={inputStyle}
                value={confidence} onChange={(e) => setConfidence(e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Result</label>
              <select
                className={inputCls} style={inputStyle}
                value={result} onChange={(e) => setResult(e.target.value as 'pending' | 'win' | 'loss')}
              >
                <option value="pending">Pending</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Expires At</label>
              <input
                type="datetime-local" className={inputCls} style={inputStyle}
                value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Badge Label</label>
              <input className={inputCls} style={inputStyle} value={badgeLabel} onChange={(e) => setBadgeLabel(e.target.value)} placeholder="e.g. Best Pick" />
            </div>
            <div>
              <label className={labelCls}>Total Odds Label</label>
              <input className={inputCls} style={inputStyle} value={totalOddsLabel} onChange={(e) => setTotalOddsLabel(e.target.value)} placeholder="e.g. 4.62 | High" />
            </div>
            <div>
              <label className={labelCls}>Analyst</label>
              <input className={inputCls} style={inputStyle} value={analyst} onChange={(e) => setAnalyst(e.target.value)} placeholder="e.g. TipMaster" />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input className={inputCls} style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Premier League" />
            </div>
          </div>
        </section>

        {/* ── Legs ── */}
        <section className={sectionCls} style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Match Legs</p>
            <button
              type="button"
              onClick={addLeg}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors font-medium"
            >
              + Add Leg
            </button>
          </div>

          {legs.map((leg, idx) => (
            <div
              key={leg._key}
              className="rounded-lg p-4 flex flex-col gap-3"
              style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#8a9bb0]">Leg {idx + 1}</p>
                {legs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLeg(leg._key)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Home Team *</label>
                  <input required className={inputCls} style={inputStyle} value={leg.home_team} onChange={(e) => updateLeg(leg._key, 'home_team', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Away Team *</label>
                  <input required className={inputCls} style={inputStyle} value={leg.away_team} onChange={(e) => updateLeg(leg._key, 'away_team', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>League</label>
                  <input className={inputCls} style={inputStyle} value={leg.league} onChange={(e) => updateLeg(leg._key, 'league', e.target.value)} placeholder="e.g. Premier League" />
                </div>
                <div>
                  <label className={labelCls}>Kickoff</label>
                  <input type="datetime-local" className={inputCls} style={inputStyle} value={leg.kickoff_iso} onChange={(e) => updateLeg(leg._key, 'kickoff_iso', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Kickoff Label</label>
                  <input className={inputCls} style={inputStyle} value={leg.kickoff_label} onChange={(e) => updateLeg(leg._key, 'kickoff_label', e.target.value)} placeholder="e.g. Premier League · 20:00" />
                </div>
                <div>
                  <label className={labelCls}>Odds</label>
                  <input className={inputCls} style={inputStyle} value={leg.odds} onChange={(e) => updateLeg(leg._key, 'odds', e.target.value)} placeholder="e.g. 1.85" />
                </div>
                <div>
                  <label className={labelCls}>Prediction *</label>
                  <input required className={inputCls} style={inputStyle} value={leg.prediction} onChange={(e) => updateLeg(leg._key, 'prediction', e.target.value)} placeholder="e.g. Both Teams to Score" />
                </div>
                <div>
                  <label className={labelCls}>Pick Title</label>
                  <input className={inputCls} style={inputStyle} value={leg.pick_title} onChange={(e) => updateLeg(leg._key, 'pick_title', e.target.value)} placeholder="Same as prediction if blank" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Short Reason (optional)</label>
                <textarea
                  rows={2}
                  className={inputCls} style={inputStyle}
                  value={leg.short_reason}
                  onChange={(e) => updateLeg(leg._key, 'short_reason', e.target.value)}
                  placeholder="Brief analyst note shown on card"
                />
              </div>
            </div>
          ))}
        </section>

        {/* ── Bookies ── */}
        <section className={sectionCls} style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Bookmakers</p>
            <button
              type="button"
              onClick={addBookieDraft}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors font-medium"
            >
              + Add Bookie
            </button>
          </div>

          {bookieDrafts.map((b) => (
            <div
              key={b._key}
              className="rounded-lg p-4 flex flex-col gap-3"
              style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <select
                    className="rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    style={inputStyle}
                    value={b.bookie_id}
                    onChange={(e) => updateBookie(b._key, 'bookie_id', e.target.value)}
                  >
                    <option value="">Select bookie…</option>
                    {bookieOptions.map((bo) => (
                      <option key={bo.id} value={bo.id}>{bo.name}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1.5 text-xs text-[#8a9bb0] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={b.is_default}
                      onChange={(e) => updateBookie(b._key, 'is_default', e.target.checked)}
                      className="accent-emerald-500"
                    />
                    Default
                  </label>
                </div>
                {bookieDrafts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBookieDraft(b._key)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Match Code</label>
                  <input className={inputCls} style={inputStyle} value={b.code} onChange={(e) => updateBookie(b._key, 'code', e.target.value)} placeholder="e.g. XB12345" />
                </div>
                <div>
                  <label className={labelCls}>Return for KES 5</label>
                  <input type="number" step="0.01" className={inputCls} style={inputStyle} value={b.return_5} onChange={(e) => updateBookie(b._key, 'return_5', e.target.value)} placeholder="e.g. 23.15" />
                </div>
                <div>
                  <label className={labelCls}>Return for KES 10</label>
                  <input type="number" step="0.01" className={inputCls} style={inputStyle} value={b.return_10} onChange={(e) => updateBookie(b._key, 'return_10', e.target.value)} placeholder="e.g. 46.30" />
                </div>
                <div>
                  <label className={labelCls}>Return for KES 20</label>
                  <input type="number" step="0.01" className={inputCls} style={inputStyle} value={b.return_20} onChange={(e) => updateBookie(b._key, 'return_20', e.target.value)} placeholder="e.g. 92.60" />
                </div>
              </div>
            </div>
          ))}

          {bookieDrafts.some((b) => b.bookie_id) && (
            <div>
              <label className={labelCls}>Default Bookie ID (shown first)</label>
              <select
                className={inputCls} style={inputStyle}
                value={defaultBookieId}
                onChange={(e) => setDefaultBookieId(e.target.value)}
              >
                <option value="">None</option>
                {bookieDrafts
                  .filter((b) => b.bookie_id)
                  .map((b) => {
                    const opt = bookieOptions.find((o) => o.id === b.bookie_id)
                    return (
                      <option key={b.bookie_id} value={b.bookie_id}>
                        {opt?.name ?? b.bookie_id}
                      </option>
                    )
                  })}
              </select>
            </div>
          )}
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
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Tip'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/tips')}
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDatetimeLocal(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
