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
        className="w-5 h-5 rounded-full grid place-items-center text-[10px]"
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
      className="w-5 h-5 rounded-full object-cover"
      style={{ border: '1px solid rgba(29,29,29,0.10)' }}
      loading="lazy"
    />
  )
}

export function MatchRow({ leg, variant, showDivider }: MatchRowProps) {
  const [open, setOpen] = useState(false)
  const kickoff = useMemo(() => formatKickoff(leg.kickoff_iso), [leg.kickoff_iso])

  return (
    <div style={variant === 'multi' && showDivider ? { borderBottom: '1px solid rgba(29,29,29,0.08)' } : {}}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center gap-3 px-4 py-3 transition-colors"
        style={{
          background: variant === 'single' ? '#FFFFFF' : 'transparent',
          borderRadius: variant === 'single' ? '8px' : undefined,
          border: variant === 'single' ? '1px solid rgba(29,29,29,0.08)' : 'none',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = variant === 'single' ? '#FAFAFA' : 'rgba(29,29,29,0.02)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = variant === 'single' ? '#FFFFFF' : 'transparent' }}
      >
        {/* Time + crests */}
        <div className="min-w-[42px] flex flex-col items-center gap-1">
          <div
            className="text-[14px] font-bold leading-none"
            style={{ fontFamily: "'DM Mono', monospace", color: '#1D1D1D' }}
          >
            {kickoff.time}
          </div>
          <div
            className="text-[8px] leading-none"
            style={{ fontFamily: "'DM Mono', monospace", color: '#777777' }}
          >
            {kickoff.tz}
          </div>
          <div className="flex mt-1">
            <Crest url={leg.left_icon_url} fallback="⚽" />
            <div className="-ml-1">
              <Crest url={leg.right_icon_url} fallback="🛡" />
            </div>
          </div>
        </div>

        {/* Pick + match */}
        <div className="flex-1">
          <div className="text-[14px] font-medium leading-tight" style={{ color: '#1D1D1D' }}>
            {leg.pick_title}
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: '#4F4841', fontWeight: 300 }}>
            {leg.match_label}
          </div>
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
