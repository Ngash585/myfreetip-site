import { type TimerState, formatCountdown } from './timerUtils'

interface CardHeaderProps {
  title: string
  type?: string | null
  timerState: TimerState
  secs: number
  confidenceLabel?: string
}

export function CardHeader({ title, type, timerState, secs, confidenceLabel }: CardHeaderProps) {
  const typeLabel = (type && type.trim()) ? type.trim() : null
  const conf = confidenceLabel ?? 'High Confidence · 82%'
  const countdown = formatCountdown(secs)

  const timerLabel =
    timerState === 'expired'
      ? '🔒 Code Expired'
      : timerState === 'critical'
      ? `⚠ Expires in ${countdown}`
      : timerState === 'warning'
      ? `⚡ Expires in ${countdown}`
      : `⏱ Valid for ${countdown}`

  const timerColor =
    timerState === 'critical' ? '#C0392B'
    : timerState === 'warning' ? '#B8860B'
    : timerState === 'expired' ? '#BBBBBB'
    : '#777777'

  return (
    <div
      className="flex items-center px-4 pt-4 pb-3 overflow-x-auto"
      style={{ borderBottom: '1px solid rgba(29,29,29,0.06)' }}
    >
      {/* Title · Type */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.10em] whitespace-nowrap"
          style={{ color: '#777777' }}
        >
          {title}
        </span>
        {typeLabel && (
          <>
            <span className="text-[11px]" style={{ color: 'rgba(29,29,29,0.25)' }}>·</span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded capitalize whitespace-nowrap"
              style={{
                background: '#EAF7EE',
                color: '#2D9A47',
                border: '1px solid rgba(61,177,87,0.25)',
              }}
            >
              {typeLabel}
            </span>
          </>
        )}
      </div>

      {/* Hairline divider */}
      <div className="mx-3 h-3 w-px flex-shrink-0" style={{ background: 'rgba(29,29,29,0.18)' }} />

      {/* Confidence */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#3DB157' }} />
        <span
          className="text-[11px] font-medium whitespace-nowrap"
          style={{ fontFamily: "'DM Mono', monospace", color: '#2D9A47' }}
        >
          {conf}
        </span>
      </div>

      {/* Hairline divider */}
      <div className="mx-3 h-3 w-px flex-shrink-0" style={{ background: 'rgba(29,29,29,0.18)' }} />

      {/* Timer */}
      <span
        className="text-[11px] font-medium whitespace-nowrap"
        style={{ fontFamily: "'DM Mono', monospace", color: timerColor }}
      >
        {timerLabel}
      </span>
    </div>
  )
}
