import { useEffect, useState } from 'react'
import { getSecondsUntil, getTimerState, type TimerState } from './timerUtils'

export function useTimer(kickoffIso: string | null | undefined) {
  const [secs, setSecs] = useState(() => getSecondsUntil(kickoffIso))

  useEffect(() => {
    if (!kickoffIso) return
    setSecs(getSecondsUntil(kickoffIso))

    const id = setInterval(() => {
      setSecs((prev) => {
        const next = Math.max(0, prev - 1)
        if (next === 0) clearInterval(id)
        return next
      })
    }, 1000)

    return () => clearInterval(id)
  }, [kickoffIso])

  return { secs, timerState: getTimerState(secs) as TimerState }
}