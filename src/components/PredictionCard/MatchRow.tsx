import { useMemo, useState } from 'react'
import type { TipCard } from '@/lib/api'
import { mediaUrl } from '@/lib/api'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatKickoff } from './timerUtils'

interface MatchRowProps {
  leg: TipCard['legs'][0]
  variant: 'single' | 'multi'
  showDivider?: boolean
}

function Crest({ url, fallback }: { url: string | null | undefined; fallback: string }) {
  if (!url) {
    return (
      <div
        className="w-5 h-5 rounded-full grid place-items-center text-[10px] flex-shrink-0"
        style={{ background: '#F2EEE9', border: '1px solid rgba(29,29,29,0.10)' }}
      >
        {fallback}
      </div>
    )
  }
  return (
    <img
      src={mediaUrl(url)}
      alt=""
      className="w-5 h-5 rounded-full object-cover flex-shrink-0"
      style={{ border: '1px solid rgba(29,29,29,0.10)' }}
      loading="lazy"
    />
  )
}

export function MatchRow({ leg, variant, showDivider }: MatchRowProps) {
  const [open, setOpen] = useState(false)
  const kickoff = useMemo(() => formatKickoff(leg.kickoff_iso), [leg.kickoff_iso])

  return (
    <div style={variant === 'multi' && showDivider ? { borderBottom: '1px solid rgba(29,29,29,0.12)' } : {}}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center gap-2 px-4 py-2 transition-colors"
        style={{
          background: variant === 'single' ? '#FFFFFF' : 'transparent',
          borderRadius: variant === 'single' ? '8px' : undefined,
          border: variant === 'single' ? '1px solid rgba(29,29,29,0.08)' : 'none',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = variant === 'single' ? '#FAFAFA' : 'rgba(29,29,29,0.02)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = variant === 'single' ? '#FFFFFF' : 'transparent' }}
      >
        {/* Time */}
        <span
          className="text-[13px] font-bold leading-none flex-shrink-0"
          style={{ fontFamily: "'DM Mono', monospace", color: '#1D1D1D' }}
        >
          {kickoff.time}
        </span>

        {/* Crests */}
        <div className="flex items-center flex-shrink-0">
          <Crest url={leg.left_icon_url} fallback="⚽" />
          <div className="-ml-1">
            <Crest url={leg.right_icon_url} fallback="🛡" />
          </div>
        </div>

        {/* Pick · Match */}
        <div className="flex-1 flex items-baseline gap-1 min-w-0 overflow-hidden">
          <span
            className="text-[13px] font-medium leading-snug truncate"
            style={{ color: '#1D1D1D' }}
          >
            {leg.pick_title}
          </span>
          <span className="text-[11px] flex-shrink-0" style={{ color: 'rgba(29,29,29,0.25)' }}>·</span>
          <span
            className="text-[12px] leading-snug truncate"
            style={{ color: '#4F4841', fontWeight: 300 }}
          >
            {leg.match_label}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: '#777777' }}
        />
      </button>

      {/* Expandable reason */}
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
              className="px-4 pb-4 pt-3"
              style={{
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
    </div>
  )
}
