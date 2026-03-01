import { type TimerState, formatCountdown } from './timerUtils'

interface TimerRowProps {
  timerState: TimerState
  secs: number
  confidenceLabel?: string
}

export function TimerRow({ timerState, secs, confidenceLabel }: TimerRowProps) {
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
    <div className="flex gap-2 px-4 py-3">
      {/* Confidence pill */}
      <div
        className="flex-1 flex items-center gap-2 rounded-lg px-3 py-2"
        style={{ background: '#EAF7EE', border: '1px solid rgba(61,177,87,0.30)' }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: '#3DB157' }} />
        <span
          className="text-xs font-medium whitespace-nowrap"
          style={{ fontFamily: "'DM Mono', monospace", color: '#2D9A47' }}
        >
          {conf}
        </span>
      </div>

      {/* Timer pill */}
      <div
        className={`flex-1 flex items-center justify-center gap-1 rounded-lg px-3 py-2 whitespace-nowrap ${timerState === 'critical' ? 'animate-border-pulse' : ''}`}
        style={{
          background: '#F2EEE9',
          border: `1px solid ${timerState === 'critical' ? 'rgba(192,57,43,0.30)' : 'rgba(29,29,29,0.10)'}`,
        }}
      >
        <span
          className="text-xs font-medium"
          style={{ fontFamily: "'DM Mono', monospace", color: timerColor }}
        >
          {timerLabel}
        </span>
      </div>
    </div>
  )
}

