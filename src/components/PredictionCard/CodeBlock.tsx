import { useState } from 'react'
import type { TipCard } from '@/lib/api'
import { Copy } from 'lucide-react'
import { BOOKMAKERS } from '@/constants/bookmakers'
import { type TimerState } from './timerUtils'

interface CodeBlockProps {
  activeBookie: TipCard['bookies'][0] | undefined
  timerState: TimerState
  /** When false, the block is blurred and clicking fires onWallTrigger. */
  showFull: boolean
  onWallTrigger: () => void
  onCopy: () => void
}

export function CodeBlock({ activeBookie, timerState, showFull, onWallTrigger, onCopy }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const disabled = timerState === 'expired'
  const code = activeBookie?.code ?? '—'
  const bookieName = activeBookie?.name ?? '—'
  const brand = BOOKMAKERS[activeBookie?.id ?? '']
  const bonusUrl = brand?.affiliateUrl ?? activeBookie?.signup_url ?? activeBookie?.deeplink_url ?? '#'
  const btnBg = brand?.activeBg ?? '#080A2D'
  const btnText = brand?.activeText ?? '#FFFFFF'
  const copyBg = copied ? '#3DB157' : btnBg

  async function handleCopy() {
    if (disabled || !activeBookie?.code) return
    try {
      await navigator.clipboard.writeText(activeBookie.code)
      setCopied(true)
      onCopy()
      window.setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }

  // ── Locked state ─────────────────────────────────────────────────────────────
  if (!showFull) {
    return (
      <div
        className="mx-[14px] mt-3 relative overflow-hidden rounded-xl"
        style={{
          background: '#F2EEE9',
          border: '1px solid rgba(29,29,29,0.10)',
          minHeight: 44,
        }}
      >
        {/* Fake blurred content behind the overlay */}
        <div
          style={{
            padding: '10px 12px',
            filter: 'blur(6px)',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: '#777777' }}>
            Code — {bookieName}
          </span>
          <span className="text-[13px] font-semibold tracking-widest" style={{ fontFamily: "'DM Mono', monospace", color: '#1D1D1D' }}>
            ●●●●●●●
          </span>
        </div>
        {/* Clickable lock overlay */}
        <button
          type="button"
          onClick={onWallTrigger}
          className="absolute inset-0 flex items-center justify-center gap-2"
          style={{ background: 'rgba(242,238,233,0.88)', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 14 }}>🔒</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#4F4841' }}>Tap to unlock code</span>
        </button>
      </div>
    )
  }

  // ── Unlocked state ────────────────────────────────────────────────────────────
  return (
    <div
      className={`mx-[14px] mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      style={{
        background: '#F2EEE9',
        border: '1px solid rgba(29,29,29,0.10)',
      }}
    >
      {/* Label */}
      <span
        className="text-[9px] font-semibold uppercase tracking-widest whitespace-nowrap flex-shrink"
        style={{ color: '#777777', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        Code — {bookieName}
      </span>

      {/* Hairline */}
      <div className="h-4 w-px flex-shrink-0" style={{ background: 'rgba(29,29,29,0.15)' }} />

      {/* Code + Copy */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className={`text-[13px] font-semibold tracking-widest leading-none ${disabled ? 'select-none' : 'select-text'}`}
          style={{ fontFamily: "'DM Mono', monospace", color: '#1D1D1D' }}
        >
          {code}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          disabled={disabled}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-medium flex-shrink-0 transition-opacity hover:opacity-80"
          style={{ background: copyBg, color: '#FFFFFF' }}
        >
          <Copy className="w-3 h-3" />
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Bonus link */}
      <a
        href={bonusUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="join-btn flex-shrink-0 rounded-lg px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap"
        style={{
          background: btnBg,
          color: btnText,
          textDecoration: 'none',
        }}
      >
        {bookieName} Bonus →
      </a>
    </div>
  )
}
