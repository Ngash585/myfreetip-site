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

function Crest({
  url,
  fallback,
}: {
  url: string | null | undefined
  fallback: string
}) {
  if (!url) {
    return (
      <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 grid place-items-center text-[10px]">
        {fallback}
      </div>
    )
  }
  return (
    <img
      src={mediaUrl(url)}
      alt=""
      className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 object-cover"
      loading="lazy"
    />
  )
}

export function MatchRow({ leg, variant, showDivider }: MatchRowProps) {
  const [open, setOpen] = useState(false)
  const kickoff = useMemo(() => formatKickoff(leg.kickoff_iso), [leg.kickoff_iso])

  const hover =
    variant === 'multi'
      ? 'hover:bg-blue-50/50 dark:hover:bg-white/5'
      : 'hover:bg-gray-50'

  const divider =
    variant === 'multi' && showDivider
      ? 'border-b border-gray-100 dark:border-white/10'
      : ''

  return (
    <div className={variant === 'single' ? '' : divider}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          'w-full text-left flex items-center gap-3 px-3 py-3',
          variant === 'single'
            ? 'rounded-lg bg-white border border-black/[0.06]'
            : 'bg-transparent',
          hover,
        ].join(' ')}
      >
        {/* time + tz + crests */}
        <div className="min-w-[42px] flex flex-col items-center gap-1">
          <div className="font-mono text-[14px] font-bold text-gray-900 leading-none">
            {kickoff.time}
          </div>
          <div className="font-mono text-[8px] text-gray-400 leading-none">
            {kickoff.tz}
          </div>

          <div className="flex mt-1">
            <div>
              <Crest url={leg.left_icon_url} fallback="⚽" />
            </div>
            <div className="-ml-1">
              <Crest url={leg.right_icon_url} fallback="🛡" />
            </div>
          </div>
        </div>

        {/* pick + match */}
        <div className="flex-1">
          <div className="font-semibold text-[14px] text-gray-900 leading-tight">
            {leg.pick_title}
          </div>
          <div className="text-[12px] text-gray-500 mt-0.5">{leg.match_label}</div>
        </div>

        {/* chevron */}
        <ChevronDown
          className={[
            'w-5 h-5 text-gray-500 flex-shrink-0 transition-transform',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {/* expandable reasoning */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={[
              'overflow-hidden',
              variant === 'single' ? 'rounded-b-lg' : '',
            ].join(' ')}
          >
            <div
              className={[
                'px-3 pb-3 pt-2',
                variant === 'single'
                  ? 'bg-white border border-t-0 border-black/[0.06] rounded-b-lg'
                  : 'bg-blue-50/60 dark:bg-white/5',
              ].join(' ')}
            >
              <div className="text-[11px] uppercase tracking-wide font-bold text-gray-400 mb-1">
                Reason for Tip
              </div>
              <div className="text-[13px] text-gray-600 leading-relaxed">
                {leg.short_reason ?? '—'}
              </div>

              {variant === 'single' && (
                <a
                  href="#"
                  className="inline-block mt-2 text-[12px] font-semibold text-blue-600"
                >
                  View Full Preview ›
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}