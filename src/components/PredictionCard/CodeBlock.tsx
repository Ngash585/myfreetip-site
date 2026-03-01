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
  // Handles "KES 2,630.00" and also "2,630.00" etc.
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
    } catch {
      // silent: no toasts in spec
    }
  }

  return (
    <div
      className={[
        'mx-3 mt-2 rounded-lg border border-white/10 bg-[var(--surface)]',
        'p-3',
        'grid grid-cols-[auto_1fr_auto] items-center gap-3',
        disabled ? 'opacity-40 pointer-events-none' : '',
      ].join(' ')}
    >
      {/* Col 1: code */}
      <div className="flex flex-col gap-1">
        <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--muted)] whitespace-nowrap">
          BOOKING CODE — {bookieName.toUpperCase()}
        </div>
        <div
          className={[
            'font-mono text-[24px] font-bold text-white tracking-widest leading-none',
            disabled ? 'select-none' : 'select-text',
          ].join(' ')}
        >
          {code}
        </div>
      </div>

      {/* Col 2: stake + return */}
      <div className="flex flex-col items-center gap-2 relative">
        <button
          type="button"
          onClick={() => setDdOpen((v) => !v)}
          className="bg-white border border-gray-300 rounded-md px-2 py-1 text-[12px] font-semibold text-blue-600 whitespace-nowrap"
        >
          {selectedStakeLabel} <span className="text-[10px]">▾</span>
        </button>

        {ddOpen && (
          <div className="absolute top-[34px] z-50 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {returns.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500">No stakes available</div>
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
                    className={[
                      'w-full px-3 py-2 text-left text-xs text-gray-700 flex items-center justify-between',
                      'hover:bg-gray-50',
                      isSel ? 'font-bold text-gray-900' : '',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-2">
                      {isSel && <span className="text-emerald-700">✓</span>}
                      <span>{r.stake_label}</span>
                    </span>
                    <span className="text-gray-500">{r.return_label}</span>
                  </button>
                )
              })
            )}
          </div>
        )}

        <div className="flex items-baseline gap-1">
          <span className="font-mono text-xl font-bold text-white">{big}</span>
          <span className="font-mono text-xs text-[var(--muted)]">{dec}</span>
        </div>
      </div>

      {/* Col 3: actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onCopy}
          disabled={disabled}
          className={[
            'min-h-[40px] rounded-lg px-4 py-2',
            'text-sm font-bold text-white',
            copied ? 'bg-emerald-700' : 'bg-red-700',
            disabled ? 'opacity-40 cursor-not-allowed' : '',
            'flex items-center justify-center gap-2',
          ].join(' ')}
        >
          <Copy className="w-4 h-4" />
          {copied ? '✓ Copied!' : 'Copy Code'}
        </button>

        <a
          href={activeBookie?.signup_url ?? activeBookie?.deeplink_url ?? '#'}
          className="min-h-[40px] rounded-lg px-4 py-2 bg-emerald-700 text-white text-xs font-bold flex items-center justify-center"
        >
          {activeBookie?.signup_cta_label ?? 'Claim Free Bets'}
        </a>
      </div>
    </div>
  )
}