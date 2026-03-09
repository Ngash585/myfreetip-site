import { type TimerState, formatCountdown } from './timerUtils'

export type ResultBadgeType = 'pending-expired' | 'win' | 'loss'

interface CardHeaderProps {
  title: string
  timerState: TimerState
  secs: number
  confidenceLabel?: string
  totalOddsLabel?: string
  /** When set, replaces Total Value on the right with a result badge */
  result?: ResultBadgeType
}

export function CardHeader({ title, timerState, secs, confidenceLabel, totalOddsLabel, result }: CardHeaderProps) {
  const conf = confidenceLabel ?? 'Confidence'

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
      {/* Title */}
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

      {/* Hairline */}
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

      {/* Second hairline — desktop only */}
      {(result || odds) && (
        <div
          className="hidden md:block"
          style={{ width: 1, height: 12, background: 'rgba(29,29,29,0.15)', flex: '0 0 auto' }}
        />
      )}

      {/* Right side: result badge OR total odds */}
      <div style={{ marginLeft: 'auto', flex: '0 0 auto' }}>
        {result ? (
          <ResultPill type={result} />
        ) : odds ? (
          <div className="flex items-baseline" style={{ gap: '4px' }}>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#4F4841',
                whiteSpace: 'nowrap',
              }}
            >
              Total Value
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#1D1D1D',
              }}
            >
              {odds}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ResultPill({ type }: { type: ResultBadgeType }) {
  const config = {
    win: {
      label: 'WON',
      bg: 'rgba(0,180,70,0.12)',
      border: 'rgba(0,180,70,0.4)',
      color: '#00b446',
      icon: (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2 6.5l3 3L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    loss: {
      label: 'LOST',
      bg: 'rgba(220,38,38,0.1)',
      border: 'rgba(220,38,38,0.35)',
      color: '#dc2626',
      icon: (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    'pending-expired': {
      label: 'PENDING',
      bg: 'rgba(217,119,6,0.1)',
      border: 'rgba(217,119,6,0.35)',
      color: '#d97706',
      icon: (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
  }[type]

  return (
    <span
      className="inline-flex items-center gap-1 font-bold"
      style={{
        fontSize: '10px',
        letterSpacing: '0.06em',
        padding: '3px 8px',
        borderRadius: '20px',
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        whiteSpace: 'nowrap',
      }}
    >
      {config.icon}
      {config.label}
    </span>
  )
}
