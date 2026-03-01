import { useState } from 'react'
import type { TipCard } from '@/lib/api'
import { Copy } from 'lucide-react'
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
  const joinUrl = activeBookie?.signup_url ?? activeBookie?.deeplink_url ?? '#'
  const joinLabel = activeBookie?.signup_cta_label ?? `Join ${bookieName}`

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
      className={`mx-4 mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}
      style={{
        background: '#F2EEE9',
        border: '1px solid rgba(29,29,29,0.10)',
      }}
    >
      {/* Label */}
      <span
        className="text-[9px] uppercase tracking-widest whitespace-nowrap flex-shrink-0"
        style={{ color: '#777777' }}
      >
        Booking Code — {bookieName.toUpperCase()}
      </span>

      {/* Hairline divider */}
      <div className="h-4 w-px flex-shrink-0" style={{ background: 'rgba(29,29,29,0.15)' }} />

      {/* Code */}
      <span
        className={`text-[15px] font-medium tracking-widest leading-none flex-1 min-w-0 truncate ${disabled ? 'select-none' : 'select-text'}`}
        style={{ fontFamily: "'DM Mono', monospace", color: '#1D1D1D' }}
      >
        {code}
      </span>

      {/* Copy button */}
      <button
        type="button"
        onClick={onCopy}
        disabled={disabled}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-80 flex-shrink-0"
        style={{ background: copied ? '#3DB157' : '#080A2D' }}
      >
        <Copy className="w-3.5 h-3.5" />
        {copied ? '✓ Copied!' : 'Copy'}
      </button>

      {/* Join bookie link */}
      <a
        href={joinUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-80 flex-shrink-0 whitespace-nowrap"
        style={{ background: '#3DB157' }}
      >
        {joinLabel}
      </a>
    </div>
  )
}
