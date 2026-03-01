export type TimerState = 'healthy' | 'warning' | 'critical' | 'expired'

export function getSecondsUntil(isoString: string | null | undefined): number {
  if (!isoString) return 0
  return Math.max(0, Math.floor((new Date(isoString).getTime() - Date.now()) / 1000))
}

export function getTimerState(secs: number): TimerState {
  if (secs <= 0) return 'expired'
  if (secs <= 900) return 'critical' // < 15 min
  if (secs <= 3600) return 'warning' // < 60 min
  return 'healthy'
}

export function formatCountdown(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

// User's local timezone kickoff display
// Returns e.g. { time: "23:00", tz: "EAT" }
export function formatKickoff(isoString: string | null | undefined) {
  if (!isoString) return { time: '--:--', tz: '' }
  const date = new Date(isoString)
  const time = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

  const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(date)
  const tz = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
  return { time, tz }
}