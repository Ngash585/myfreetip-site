import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'

type StatsRow = {
  id?: string
  title: string
  subtitle: string
  win_rate_pct: number
  won: number
  lost: number
  void: number
  total: number
  period_label: string
}

const EMPTY: StatsRow = {
  title: 'Overall Win Rate',
  subtitle: 'Based on all predictions to date',
  win_rate_pct: 0,
  won: 0,
  lost: 0,
  void: 0,
  total: 0,
  period_label: 'all time',
}

export default function StatsEditor() {
  const [form, setForm] = useState<StatsRow>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase
      .from('analyst_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const r = data[0]
          setForm({
            id: r.id,
            title: r.title ?? '',
            subtitle: r.subtitle ?? '',
            win_rate_pct: r.win_rate_pct ?? 0,
            won: r.won ?? 0,
            lost: r.lost ?? 0,
            void: r.void ?? 0,
            total: r.total ?? 0,
            period_label: r.period_label ?? '',
          })
        }
        setLoading(false)
      })
  }, [])

  function set<K extends keyof StatsRow>(key: K, value: StatsRow[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setMessage('')

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      win_rate_pct: Number(form.win_rate_pct),
      won: Number(form.won),
      lost: Number(form.lost),
      void: Number(form.void),
      total: Number(form.total),
      period_label: form.period_label,
    }

    let err
    if (form.id) {
      ;({ error: err } = await supabase.from('analyst_stats').update(payload).eq('id', form.id))
    } else {
      const { data, error } = await supabase.from('analyst_stats').insert(payload).select().single()
      err = error
      if (data) setForm((f) => ({ ...f, id: data.id }))
    }

    setSaving(false)
    setMessage(err ? `Error: ${err.message}` : 'Stats saved successfully!')
  }

  const labelClass = 'block text-xs text-[#8a9bb0] font-medium mb-1'
  const inputClass =
    'w-full rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500 transition'
  const inputStyle = { background: '#0f1923', border: '1px solid #2a3a4a' }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#8a9bb0] text-sm">
        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        Loading…
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold text-white mb-1">Analyst Stats</h1>
      <p className="text-[#8a9bb0] text-sm mb-6">Update win rate displayed on the public site.</p>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl p-6 flex flex-col gap-4"
        style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
      >
        <div>
          <label className={labelClass}>Title</label>
          <input
            className={inputClass}
            style={inputStyle}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Subtitle</label>
          <input
            className={inputClass}
            style={inputStyle}
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Period Label (e.g. "all time")</label>
          <input
            className={inputClass}
            style={inputStyle}
            value={form.period_label}
            onChange={(e) => set('period_label', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Win Rate %</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              className={inputClass}
              style={inputStyle}
              value={form.win_rate_pct}
              onChange={(e) => set('win_rate_pct', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Total</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              style={inputStyle}
              value={form.total}
              onChange={(e) => set('total', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Won</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              style={inputStyle}
              value={form.won}
              onChange={(e) => set('won', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Lost</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              style={inputStyle}
              value={form.lost}
              onChange={(e) => set('lost', Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Void</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              style={inputStyle}
              value={form.void}
              onChange={(e) => set('void', Number(e.target.value))}
            />
          </div>
        </div>

        {message && (
          <p
            className={`text-xs rounded-lg px-3 py-2 ${
              message.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'
            }`}
            style={{ background: '#0f1923' }}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors disabled:opacity-60 mt-1"
        >
          {saving ? 'Saving…' : 'Save Stats'}
        </button>
      </form>
    </div>
  )
}
