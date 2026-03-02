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
      className={`${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      style={{ margin: '0 14px', marginTop: '8px' }}
    >
      {/* Licence plate row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: '10px',
          border: '1.5px dashed rgba(29,29,29,0.20)',
          overflow: 'hidden',
          background: '#F8F4EF',
        }}
      >
        {/* Code */}
        <span
          style={{
            flex: '1 1 0',
            fontFamily: "'DM Mono', monospace",
            fontSize: '20px',
            fontWeight: 700,
            color: '#1D1D1D',
            letterSpacing: '0.08em',
            padding: '10px 14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            userSelect: disabled ? 'none' : 'text',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {code}
        </span>

        {/* Copy button — flush right, no border-radius */}
        <button
          type="button"
          onClick={onCopy}
          disabled={disabled}
          style={{
            flex: '0 0 auto',
            padding: '10px 16px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#FFFFFF',
            background: copyBg,
            border: 'none',
            borderRadius: 0,
            cursor: disabled ? 'default' : 'pointer',
            transition: 'background 150ms ease',
          }}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Bonus link */}
      <a
        href={bonusUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="bookie-link"
        style={{
          display: 'block',
          fontSize: '11px',
          color: '#3DB157',
          textDecoration: 'underline',
          textAlign: 'center',
          padding: '4px 0 8px',
          cursor: 'pointer',
        }}
      >
        {bookieName} Bonus →
      </a>
    </div>
  )
}
