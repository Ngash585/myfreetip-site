import { type TimerState, formatCountdown } from './timerUtils'

interface CardHeaderProps {
  title: string
  timerState: TimerState
  secs: number
  confidenceLabel?: string
  totalOddsLabel?: string
}

export function CardHeader({ title, timerState, secs, confidenceLabel, totalOddsLabel }: CardHeaderProps) {
  const conf = confidenceLabel ?? 'Confidence · 82%'

  // Extract numeric odds from e.g. "4.62 | High" → "4.62"
  const odds = totalOddsLabel ? totalOddsLabel.split(' |')[0].trim() : null

  const timerText = timerState === 'expired'
    ? '🔒 Expired'
    : `⏱ ${formatCountdown(secs)}`

  const timerColor =
    timerState === 'critical' ? '#C0392B'
    : timerState === 'warning'  ? '#B8860B'
    : timerState === 'expired'  ? '#BBBBBB'
    : '#777777'

  return (
    <div
      className="flex items-center"
      style={{
        padding: '10px 14px',
        borderBottom: '1px solid rgba(29,29,29,0.06)',
        gap: '8px',
        flexWrap: 'nowrap',
      }}
    >
      {/* Title — "STAKE HIGH" etc. */}
      <span
        style={{
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#777777',
          flex: '0 0 auto',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>

      {/* · separator */}
      <span style={{ color: 'rgba(29,29,29,0.25)', fontSize: '10px', flex: '0 0 auto' }}>·</span>

      {/* Confidence dot + label */}
      <div className="flex items-center" style={{ gap: '4px', flex: '0 0 auto' }}>
        <span
          className="rounded-full"
          style={{ width: 6, height: 6, background: '#3DB157', display: 'inline-block', flexShrink: 0 }}
        />
        <span style={{ fontSize: '12px', color: '#3DB157', flex: '0 0 auto', whiteSpace: 'nowrap' }}>
          {conf}
        </span>
      </div>

      {/* Hairline — always visible */}
      <div style={{ width: 1, height: 12, background: 'rgba(29,29,29,0.15)', flex: '0 0 auto' }} />

      {/* Timer — hidden on mobile, visible md+ */}
      <div
        className="hidden md:flex items-center"
        style={{ gap: 4, flex: '0 0 auto' }}
      >
        <span
          style={{
            fontSize: '12px',
            fontFamily: "'DM Mono', monospace",
            color: timerColor,
            whiteSpace: 'nowrap',
          }}
        >
          {timerText}
        </span>
      </div>

      {/* Second hairline — desktop only, sits between timer and odds */}
      {odds && (
        <div
          className="hidden md:block"
          style={{ width: 1, height: 12, background: 'rgba(29,29,29,0.15)', flex: '0 0 auto' }}
        />
      )}

      {/* Odds — pushed to far right */}
      {odds && (
        <span
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#1D1D1D',
            marginLeft: 'auto',
            flex: '0 0 auto',
          }}
        >
          {odds}
        </span>
      )}
    </div>
  )
}
