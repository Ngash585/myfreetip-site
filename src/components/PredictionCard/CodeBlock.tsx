import { useState } from 'react'
import type { TipCard } from '@/lib/api'
import { BOOKMAKERS } from '@/constants/bookmakers'
import { type TimerState } from './timerUtils'

interface CodeBlockProps {
  activeBookie: TipCard['bookies'][0] | undefined
  timerState: TimerState
}

export function CodeBlock({ activeBookie, timerState }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const disabled = timerState === 'expired'
  const code = activeBookie?.code ?? '—'
  const bookieName = activeBookie?.name ?? '—'
  const brand = BOOKMAKERS[activeBookie?.id ?? '']
  const bonusUrl = brand?.affiliateUrl ?? activeBookie?.signup_url ?? activeBookie?.deeplink_url ?? '#'
  const copyBg = copied ? '#3DB157' : (brand?.activeBg ?? '#080A2D')
  const copyText = brand?.activeText ?? '#FFFFFF'

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
      className={disabled ? 'opacity-40 pointer-events-none' : ''}
      style={{ margin: '0 14px', marginTop: '8px' }}
    >
      {/* Single row: CODE — BOOKIE | code Copy | Bookie Bonus → */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '10px',
          border: '1.5px dashed rgba(29,29,29,0.20)',
          background: '#F8F4EF',
          padding: '8px 10px',
          gap: '8px',
          minWidth: 0,
        }}
      >
        {/* Label — "CODE — PARIPESA", shrinks first if space is tight */}
        <span
          style={{
            fontSize: '9px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#777777',
            flex: '0 1 auto',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          CODE — {bookieName.toUpperCase()}
        </span>

        {/* Hairline */}
        <div style={{ width: 1, height: 12, background: 'rgba(29,29,29,0.15)', flexShrink: 0 }} />

        {/* Code — mono, bold, never truncates */}
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '14px',
            fontWeight: 700,
            color: '#1D1D1D',
            letterSpacing: '0.06em',
            flex: '1 1 0',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            userSelect: disabled ? 'none' : 'text',
          }}
        >
          {code}
        </span>

        {/* Copy button */}
        <button
          type="button"
          onClick={onCopy}
          disabled={disabled}
          style={{
            flexShrink: 0,
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: copyText,
            background: copyBg,
            border: 'none',
            borderRadius: '6px',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'background 150ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>

        {/* Hairline */}
        <div style={{ width: 1, height: 12, background: 'rgba(29,29,29,0.15)', flexShrink: 0 }} />

        {/* Bonus link */}
        <a
          href={bonusUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="bookie-link"
          style={{
            flexShrink: 0,
            fontSize: '11px',
            color: '#3DB157',
            textDecoration: 'underline',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          {bookieName} Bonus →
        </a>
      </div>
    </div>
  )
}
