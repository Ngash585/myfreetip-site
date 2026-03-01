import React, { useMemo, useState } from 'react'
import type { TipCard } from '@/lib/api'
import { Surface } from '@/components/Surface'
import { CardHeader } from './CardHeader'
import { TimerRow } from './TimerRow'
import { MatchBody } from './MatchBody'
import { BookingSection } from './BookingSection'
import { useTimer } from './useTimer'
import { type TimerState } from './timerUtils'

interface PredictionCardProps {
  card: TipCard
  /** Show the blue gradient header bar. Defaults to true. */
  showHeader?: boolean
}

function findClosestReturn(
  returns: NonNullable<TipCard['bookies'][0]['returns']>,
  stake: number
) {
  if (!returns || returns.length === 0) return undefined
  let best = returns[0]
  let bestDiff = Math.abs((best.stake_amount ?? 0) - stake)
  for (const r of returns) {
    const diff = Math.abs((r.stake_amount ?? 0) - stake)
    if (diff < bestDiff) {
      best = r
      bestDiff = diff
    }
  }
  return best
}

export function PredictionCard({ card, showHeader = true }: PredictionCardProps) {
  const defaultBookieId =
    card.default_bookie_id ?? (card.bookies[0]?.id ?? '0')

  const [selectedBookieId, setSelectedBookieId] = useState<string | number>(
    defaultBookieId
  )

  const activeBookie = useMemo(
    () => card.bookies.find((b) => b.id === selectedBookieId) ?? card.bookies[0],
    [card.bookies, selectedBookieId]
  )

  const initialStake = activeBookie?.returns?.[0]?.stake_amount ?? 0
  const [selectedStake, setSelectedStake] = useState<number>(initialStake)

  // earliest leg: backend should already order, but we pick the first per your spec
  const kickoffIso = card.legs[0]?.kickoff_iso
  const { secs, timerState } = useTimer(kickoffIso)

  const activeReturn = useMemo(() => {
    const returns = activeBookie?.returns ?? []
    // exact match or closest
    const exact = returns.find((r) => r.stake_amount === selectedStake)
    if (exact) return exact
    return findClosestReturn(returns, selectedStake)
  }, [activeBookie?.returns, selectedStake])

  // keep stake sane when switching bookies
  React.useEffect(() => {
    const returns = activeBookie?.returns ?? []
    if (returns.length === 0) return
    const exists = returns.some((r) => r.stake_amount === selectedStake)
    if (exists) return
    const closest = findClosestReturn(returns, selectedStake)
    if (closest?.stake_amount != null) setSelectedStake(closest.stake_amount)
  }, [activeBookie, selectedStake])

  return (
    <Surface noPadding rounded="rounded-2xl" className="overflow-hidden">
      {showHeader && (
        <CardHeader
          title={card.badge_label ?? card.title}
          type={card.type}
        />
      )}

      {/* Non-negotiable order: timer ABOVE match body ABOVE code */}
      <TimerRow timerState={timerState as TimerState} secs={secs} />

      <MatchBody legs={card.legs} />

      <BookingSection
        bookies={card.bookies}
        selectedBookieId={selectedBookieId}
        onBookieChange={setSelectedBookieId}
        activeBookie={activeBookie}
        activeReturn={activeReturn}
        selectedStake={selectedStake}
        onStakeChange={setSelectedStake}
        timerState={timerState as TimerState}
      />
    </Surface>
  )
}

export function PredictionCardSkeleton() {
  return (
    <Surface noPadding rounded="rounded-2xl" className="overflow-hidden">
      <div className="h-10 bg-[#0B2545] animate-pulse" />
      <div className="flex gap-2 p-3">
        <div className="h-9 flex-1 rounded-lg bg-[var(--surface)] animate-pulse" />
        <div className="h-9 flex-1 rounded-lg bg-[var(--surface)] animate-pulse" />
      </div>
      <div className="mx-3 h-16 rounded-lg bg-white/80 dark:bg-white/5 animate-pulse" />
      <div className="flex gap-2 px-3 pt-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-7 w-20 rounded-full bg-[var(--surface)] animate-pulse"
          />
        ))}
      </div>
      <div className="mx-3 mt-2 h-16 rounded-lg bg-[var(--surface)] animate-pulse" />
      <div className="mx-3 mt-2 mb-3 h-14 rounded-xl bg-emerald-500/30 animate-pulse" />
    </Surface>
  )
}