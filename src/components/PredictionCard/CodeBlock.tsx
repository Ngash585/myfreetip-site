import { useMemo, useState } from 'react'
import type { TipCard } from '@/lib/api'
import { Copy } from 'lucide-react'
import { type TimerState } from './timerUtils'

interface CodeBlockProps {
  activeBookie: TipCard['bookies'][0] | undefined
  selectedStake: number
  onStakeChange: (s: number) => void
  activeReturn: { stake_label: string; return_label: string } | undefined
  timerState: TimerState
}

function splitMoneyLabel(label: string | undefined) {
  if (!label) return { big: '–', dec: '' }
  const parts = label.split('.')
  if (parts.length === 1) return { big: parts[0], dec: '' }
  return { big: parts[0], dec: `.${parts.slice(1).join('.')}` }
}

export function CodeBlock({
  activeBookie,
  selectedStake,
  onStakeChange,
  activeReturn,
  timerState,
}: CodeBlockProps) {
  const [ddOpen, setDdOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const disabled = timerState === 'expired'
  const code = activeBookie?.code ?? '—'
  const bookieName = activeBookie?.name ?? '—'

  const returns = activeBookie?.returns ?? []
  const selectedStakeLabel =
    returns.find((r) => r.stake_amount === selectedStake)?.stake_label ??
    activeReturn?.stake_label ??
    returns[0]?.stake_label ??
    '—'

  const { big, dec } = useMemo(
    () => splitMoneyLabel(activeReturn?.return_label),
    [activeReturn?.return_label]
  )

  async function onCopy() {
    if (disabled || !activeBookie?.code) return
    try {
      await navigator.clipboard.writeText(activeBookie.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }

  return (
    <div
      className={`mx-4 mt-3 rounded-xl p-4 grid grid-cols-[auto_1fr_auto] items-center gap-3 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      style={{
        background: '#F2EEE9',
        border: '1px solid rgba(29,29,29,0.10)',
      }}
    >
      {/* Col 1: code */}
      <div className="flex flex-col gap-1">
        <div
          className="text-[9px] uppercase tracking-widest whitespace-nowrap"
          style={{ color: '#777777' }}
        >
          BOOKING CODE — {bookieName.toUpperCase()}
        </div>
        <div
          className={`text-[24px] font-medium tracking-widest leading-none ${disabled ? 'select-none' : 'select-text'}`}
          style={{ fontFamily: "'DM Mono', monospace", color: '#1D1D1D' }}
        >
          {code}
        </div>
      </div>

      {/* Col 2: stake + return */}
      <div className="flex flex-col items-center gap-2 relative">
        <button
          type="button"
          onClick={() => setDdOpen((v) => !v)}
          className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(29,29,29,0.15)',
            color: '#1D1D1D',
          }}
        >
          {selectedStakeLabel} <span className="text-[10px]">▾</span>
        </button>

        {ddOpen && (
          <div
            className="absolute top-[38px] z-50 w-44 rounded-xl overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid rgba(29,29,29,0.12)', boxShadow: 'rgba(29,29,29,0.10) 0 8px 24px' }}
          >
            {returns.length === 0 ? (
              <div className="px-3 py-2 text-xs" style={{ color: '#777777' }}>No stakes available</div>
            ) : (
              returns.map((r, idx) => {
                const isSel =
                  (r.stake_amount != null && r.stake_amount === selectedStake) ||
                  (r.stake_label && r.stake_label === selectedStakeLabel)
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (r.stake_amount != null) onStakeChange(r.stake_amount)
                      setDdOpen(false)
                    }}
                    className="w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors hover:bg-[#F8F4EF]"
                    style={{
                      color: isSel ? '#1D1D1D' : '#4F4841',
                      fontWeight: isSel ? 600 : 400,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {isSel && <span style={{ color: '#3DB157' }}>✓</span>}
                      <span>{r.stake_label}</span>
                    </span>
                    <span style={{ color: '#777777' }}>{r.return_label}</span>
                  </button>
                )
              })
            )}
          </div>
        )}

        <div className="flex items-baseline gap-0.5">
          <span
            className="text-xl font-medium"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#B8860B' }}
          >
            {big}
          </span>
          <span className="text-xs" style={{ color: '#777777', fontWeight: 300 }}>{dec}</span>
        </div>
      </div>

      {/* Col 3: actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onCopy}
          disabled={disabled}
          className="min-h-[40px] rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-80"
          style={{ background: copied ? '#3DB157' : '#080A2D', borderRadius: '10px' }}
        >
          <Copy className="w-4 h-4" />
          {copied ? '✓ Copied!' : 'Copy'}
        </button>

        <a
          href={activeBookie?.signup_url ?? activeBookie?.deeplink_url ?? '#'}
          className="min-h-[40px] rounded-lg px-4 py-2 text-xs font-medium flex items-center justify-center text-white transition-opacity hover:opacity-80"
          style={{ background: '#3DB157', borderRadius: '10px' }}
        >
          {activeBookie?.signup_cta_label ?? 'Claim Free Bets'}
        </a>
      </div>
    </div>
  )
}
