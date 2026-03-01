import { type TimerState, formatCountdown } from './timerUtils'

interface TimerRowProps {
  timerState: TimerState
  secs: number
  confidenceLabel?: string
}

function timerClasses(timerState: TimerState) {
  switch (timerState) {
    case 'healthy':
      return {
        border: 'border-white/20',
        text: 'text-[var(--text)]',
        icon: '⏱',
        labelPrefix: 'Valid for',
        extra: '',
      }
    case 'warning':
      return {
        border: 'border-amber-400',
        text: 'text-amber-400',
        icon: '⚡',
        labelPrefix: 'Expires in',
        extra: '',
      }
    case 'critical':
      return {
        border: 'border-red-500 animate-border-pulse',
        text: 'text-red-500',
        icon: '⚠',
        labelPrefix: 'Expires in',
        extra: '',
      }
    case 'expired':
    default:
      return {
        border: 'border-white/10',
        text: 'text-white/30',
        icon: '🔒',
        labelPrefix: 'Code Expired',
        extra: '',
      }
  }
}

export function TimerRow({ timerState, secs, confidenceLabel }: TimerRowProps) {
  const conf = confidenceLabel ?? 'High Confidence · 82%'
  const t = timerClasses(timerState)
  const countdown = formatCountdown(secs)

  return (
    <div className="flex gap-2 p-3">
      {/* Confidence pill */}
      <div className="flex-1 flex items-center gap-2 rounded-lg border border-emerald-500 bg-emerald-50 dark:bg-white/5 px-3 py-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-xs font-semibold text-emerald-500 whitespace-nowrap">
          {conf}
        </span>
      </div>

      {/* Timer pill */}
      <div
        className={[
          'flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 whitespace-nowrap',
          'bg-[var(--surface)]',
          t.border,
          t.text,
        ].join(' ')}
      >
        <span className="font-mono text-xs font-semibold">
          {timerState === 'expired' ? (
            <>
              {t.icon} {t.labelPrefix}
            </>
          ) : (
            <>
              {t.icon} {t.labelPrefix} <span>{countdown}</span>
            </>
          )}
        </span>
      </div>
    </div>
  )
}