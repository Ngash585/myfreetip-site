import { useMemo, useState } from 'react'
import type { TipCard } from '@/lib/api'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatKickoff } from './timerUtils'

interface MatchRowProps {
  leg: TipCard['legs'][0]
  variant: 'single' | 'multi'
  showDivider?: boolean
  /** When false, pick_title and reason are blurred; clicking fires onWallTrigger. */
  showFull: boolean
  onWallTrigger: () => void
}

export function MatchRow({ leg, showDivider, showFull, onWallTrigger }: MatchRowProps) {
  const [open, setOpen] = useState(false)
  const kickoff = useMemo(() => formatKickoff(leg.kickoff_iso), [leg.kickoff_iso])

  function handleButtonClick() {
    if (!showFull) {
      onWallTrigger()
      return
    }
    setOpen((v) => !v)
  }

  return (
    <div style={showDivider ? { borderBottom: '1px solid rgba(29,29,29,0.07)' } : {}}>
      <button
        type="button"
        onClick={handleButtonClick}
        className="w-full text-left flex items-center transition-colors"
        style={{ padding: '8px 14px', gap: '10px', background: 'transparent' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(29,29,29,0.02)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        {/* Time — fixed 40px column, always visible */}
        <span
          style={{
            flex: '0 0 40px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '13px',
            fontWeight: 500,
            color: '#1D1D1D',
            paddingTop: '1px',
          }}
        >
          {kickoff.time}
        </span>

        {/* Content column: pick_title (blurred) on top, match_label (always visible) below */}
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* pick_title — blurred when locked */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <span
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1D1D1D',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                filter: showFull ? 'none' : 'blur(5px)',
                userSelect: showFull ? 'auto' : 'none',
                pointerEvents: 'none',
              }}
            >
              {leg.pick_title}
            </span>
            {!showFull && (
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 2,
                  fontSize: 13,
                }}
                aria-hidden
              >
                🔒
              </span>
            )}
          </div>

          {/* match_label — always visible */}
          <span
            style={{
              fontSize: '12px',
              fontWeight: 400,
              color: '#777777',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {leg.match_label}
          </span>
        </div>

        {/* Final score — shown when set and unlocked */}
        {showFull && leg.final_score && (
          <span
            style={{
              flex: '0 0 auto',
              fontFamily: "'DM Mono', monospace",
              fontSize: '13px',
              fontWeight: 700,
              color: '#1D1D1D',
              background: 'rgba(29,29,29,0.05)',
              borderRadius: '6px',
              padding: '2px 7px',
              whiteSpace: 'nowrap',
            }}
          >
            {leg.final_score}
          </span>
        )}

        {/* Chevron — only shown when content is accessible */}
        {showFull && (
          <ChevronDown
            className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
            style={{ width: 16, height: 16, color: '#777777' }}
          />
        )}
      </button>

      {/* Expandable reason — only renders when showFull */}
      {showFull && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div
                style={{
                  padding: '12px 14px 16px',
                  background: '#F8F4EF',
                  borderTop: '1px solid rgba(29,29,29,0.06)',
                }}
              >
                <div
                  className="text-[11px] uppercase tracking-wider font-medium mb-1"
                  style={{ color: '#777777' }}
                >
                  Reason for Tip
                </div>
                <div className="text-[13px] leading-relaxed" style={{ color: '#4F4841', fontWeight: 300 }}>
                  {leg.short_reason ?? '—'}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
