import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { setTipResult } from '@/lib/api'

type TipRow = {
  id: string
  title: string
  type: string
  result: string
  expires_at: string | null
  created_at: string
}

type LegScore = {
  id: string
  match_label: string
  final_score: string
}

const RESULT_COLOR: Record<string, string> = {
  win:     '#00b446',
  loss:    '#dc2626',
  pending: '#d97706',
}

export default function TipsList() {
  const [tips, setTips] = useState<TipRow[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // inline score editing
  const [scoringId, setScoringId] = useState<string | null>(null)
  const [legScores, setLegScores] = useState<LegScore[]>([])
  const [savingScores, setSavingScores] = useState(false)

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
    if (scoringId === id) setScoringId(null)
    queryClient.invalidateQueries({ queryKey: ['tip-cards'] })
    queryClient.invalidateQueries({ queryKey: ['results'] })
  }

  async function handleSetResult(id: string, result: 'win' | 'loss') {
    setUpdating(id + result)
    await setTipResult(id, result)
    setTips((prev) =>
      prev.map((t) => t.id === id ? { ...t, result } : t)
    )
    queryClient.invalidateQueries({ queryKey: ['tip-cards'] })
    queryClient.invalidateQueries({ queryKey: ['results'] })
    setUpdating(null)
    // auto-open score entry after marking result
    openScores(id)
  }

  async function openScores(id: string) {
    if (!supabase) return
    if (scoringId === id) { setScoringId(null); return }
    const { data } = await supabase
      .from('legs')
      .select('id, match_label, home_team, away_team, final_score')
      .eq('card_id', id)
      .order('sort_order')
    if (data) {
      setLegScores(
        (data as { id: string; match_label: string | null; home_team: string; away_team: string; final_score: string | null }[])
          .map((l) => ({
            id: l.id,
            match_label: l.match_label ?? `${l.home_team} vs ${l.away_team}`,
            final_score: l.final_score ?? '',
          }))
      )
    }
    setScoringId(id)
  }

  async function saveScores() {
    if (!supabase || !legScores.length) return
    setSavingScores(true)
    await Promise.all(
      legScores.map((l) =>
        supabase!.from('legs').update({ final_score: l.final_score || null }).eq('id', l.id)
      )
    )
    setSavingScores(false)
    setScoringId(null)
    queryClient.invalidateQueries({ queryKey: ['tip-cards'] })
    queryClient.invalidateQueries({ queryKey: ['results'] })
  }


  // ─── Shared score panel ──────────────────────────────────────────────────────
  function ScorePanel() {
    if (!scoringId || !legScores.length) return null
    return (
      <div
        className="rounded-xl p-4 flex flex-col gap-3"
        style={{ background: '#0f1923', border: '1px solid #2a3a4a' }}
      >
        <p className="text-xs font-semibold text-[#8a9bb0] uppercase tracking-wider">Final Scores</p>
        {legScores.map((leg, i) => (
          <div key={leg.id} className="flex items-center gap-3">
            <span className="text-xs text-white flex-1 min-w-0 truncate">{leg.match_label}</span>
            <input
              className="w-24 rounded-lg px-3 py-1.5 text-sm text-white text-center font-mono outline-none focus:ring-2 focus:ring-emerald-500"
              style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
              placeholder="e.g. 2 - 1"
              value={leg.final_score}
              onChange={(e) => {
                const val = e.target.value
                setLegScores((prev) => prev.map((l, j) => j === i ? { ...l, final_score: val } : l))
              }}
            />
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <button
            onClick={saveScores}
            disabled={savingScores}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors disabled:opacity-60"
          >
            {savingScores ? 'Saving…' : 'Save Scores'}
          </button>
          <button
            onClick={() => setScoringId(null)}
            className="px-4 py-1.5 rounded-lg text-xs text-[#8a9bb0] hover:text-white transition-colors"
            style={{ border: '1px solid #2a3a4a' }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
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

      {/* ── Mobile card list ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          <LoadingRow />
        ) : tips.length === 0 ? (
          <EmptyRow />
        ) : (
          tips.map((tip) => (
            <div key={tip.id} className="flex flex-col gap-2">
              <div
                className="rounded-xl p-4"
                style={{ background: '#1a2634', border: '1px solid #2a3a4a' }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{tip.title}</p>
                    <p className="text-[#8a9bb0] text-xs mt-0.5 capitalize">{tip.type}</p>
                  </div>
                  <ResultBadgePill result={tip.result} />
                </div>

                {tip.expires_at && (
                  <p className="text-xs text-[#8a9bb0] mb-3">
                    Kickoff: {new Date(tip.expires_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {tip.result === 'pending' && (
                    <>
                      <button
                        disabled={!!updating}
                        onClick={() => handleSetResult(tip.id, 'win')}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        style={{ background: 'rgba(0,180,70,0.15)', color: '#00b446', border: '1px solid rgba(0,180,70,0.3)' }}
                      >
                        {updating === tip.id + 'win' ? '…' : '✓ Mark Won'}
                      </button>
                      <button
                        disabled={!!updating}
                        onClick={() => handleSetResult(tip.id, 'loss')}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        style={{ background: 'rgba(220,38,38,0.12)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' }}
                      >
                        {updating === tip.id + 'loss' ? '…' : '✗ Mark Lost'}
                      </button>
                    </>
                  )}
                  {tip.result !== 'pending' && (
                    <button
                      onClick={() => openScores(tip.id)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        background: scoringId === tip.id ? '#2a3a4a' : 'rgba(100,100,100,0.1)',
                        color: scoringId === tip.id ? 'white' : '#8a9bb0',
                        border: '1px solid #2a3a4a',
                      }}
                    >
                      {scoringId === tip.id ? 'Close Scores' : 'Set Scores'}
                    </button>
                  )}
                  <Link
                    to={`/admin/tips/${tip.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300"
                    style={{ border: '1px solid #2a3a4a' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tip.id, tip.title)}
                    className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300"
                    style={{ border: '1px solid #2a3a4a' }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Score panel inline below the card */}
              {scoringId === tip.id && <ScorePanel />}
            </div>
          ))
        )}
      </div>

      {/* ── Desktop table ────────────────────────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a3a4a' }}>
          {loading ? (
            <LoadingRow />
          ) : tips.length === 0 ? (
            <EmptyRow />
          ) : (
            <table className="w-full text-sm" style={{ background: '#1a2634' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a3a4a' }}>
                  {['Title', 'Type', 'Result', 'Kickoff', 'Actions'].map((h) => (
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
                  <>
                    <tr
                      key={tip.id}
                      style={{ borderBottom: scoringId === tip.id ? 'none' : i < tips.length - 1 ? '1px solid #2a3a4a' : undefined }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium max-w-[180px] truncate">
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
                      <td className="px-4 py-3 text-[#8a9bb0] text-xs whitespace-nowrap">
                        {tip.expires_at
                          ? new Date(tip.expires_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {tip.result === 'pending' && (
                            <>
                              <button
                                disabled={!!updating}
                                onClick={() => handleSetResult(tip.id, 'win')}
                                className="text-xs font-bold px-2 py-0.5 rounded transition-colors disabled:opacity-50"
                                style={{ background: 'rgba(0,180,70,0.12)', color: '#00b446', border: '1px solid rgba(0,180,70,0.3)' }}
                              >
                                {updating === tip.id + 'win' ? '…' : 'Won'}
                              </button>
                              <button
                                disabled={!!updating}
                                onClick={() => handleSetResult(tip.id, 'loss')}
                                className="text-xs font-bold px-2 py-0.5 rounded transition-colors disabled:opacity-50"
                                style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' }}
                              >
                                {updating === tip.id + 'loss' ? '…' : 'Lost'}
                              </button>
                            </>
                          )}
                          {tip.result !== 'pending' && (
                            <button
                              onClick={() => openScores(tip.id)}
                              className="text-xs font-medium transition-colors"
                              style={{ color: scoringId === tip.id ? 'white' : '#8a9bb0' }}
                            >
                              {scoringId === tip.id ? 'Close' : 'Scores'}
                            </button>
                          )}
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

                    {/* Score panel as an extra row */}
                    {scoringId === tip.id && (
                      <tr key={tip.id + '-scores'} style={{ borderBottom: i < tips.length - 1 ? '1px solid #2a3a4a' : undefined }}>
                        <td colSpan={5} className="px-4 pb-4 pt-0">
                          <ScorePanel />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Small helpers ──────────────────────────────────────────────────────────────

function ResultBadgePill({ result }: { result: string }) {
  const cfg = RESULT_COLOR[result] ?? '#8a9bb0'
  return (
    <span
      className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full capitalize"
      style={{ background: cfg + '22', color: cfg, border: `1px solid ${cfg}44` }}
    >
      {result}
    </span>
  )
}

function LoadingRow() {
  return (
    <div className="flex items-center gap-2 p-6 text-[#8a9bb0] text-sm">
      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      Loading…
    </div>
  )
}

function EmptyRow() {
  return (
    <div className="p-6 text-center text-[#8a9bb0] text-sm">
      No tip cards yet.{' '}
      <Link to="/admin/tips/new" className="text-emerald-400 hover:underline">
        Create the first one.
      </Link>
    </div>
  )
}
