import { useMemo, useState } from 'react'
import type { TipCard } from '@/lib/api'
import { Surface } from '@/components/Surface'
import { CardHeader, type ResultBadgeType } from './CardHeader'
import { MatchBody } from './MatchBody'
import { BookingSection } from './BookingSection'
import { useTimer } from './useTimer'
import { type TimerState } from './timerUtils'

interface PredictionCardProps {
  card: TipCard
  /** Show the header row. Defaults to true. */
  showHeader?: boolean
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

  const kickoffIso = card.legs[0]?.kickoff_iso
  const { secs, timerState } = useTimer(kickoffIso)

  // Build confidence label from card data
  const confidenceLabel =
    card.confidence === 'high' ? 'High Confidence'
    : card.confidence === 'medium' ? 'Medium Confidence'
    : 'Low Confidence'

  // Derive what badge (if any) to show in the card header
  const resultBadge: ResultBadgeType | undefined =
    card.result === 'win' ? 'win' :
    card.result === 'loss' ? 'loss' :
    timerState === 'expired' ? 'pending-expired' :
    undefined

  return (
    <Surface noPadding rounded="rounded-2xl" className="overflow-hidden">
      {showHeader && (
        <CardHeader
          title={card.badge_label ?? card.title}
          timerState={timerState as TimerState}
          secs={secs}
          confidenceLabel={confidenceLabel}
          totalOddsLabel={card.total_odds_label}
          result={resultBadge}
        />
      )}

      <MatchBody legs={card.legs} />

      <BookingSection
        bookies={card.bookies}
        selectedBookieId={selectedBookieId}
        onBookieChange={setSelectedBookieId}
        activeBookie={activeBookie}
        timerState={timerState as TimerState}
      />
    </Surface>
  )
}

export function PredictionCardSkeleton() {
  return (
    <Surface noPadding rounded="rounded-2xl" className="overflow-hidden">
      <div className="h-10 animate-pulse" style={{ background: '#F2EEE9' }} />
      <div className="flex gap-2 p-3">
        <div className="h-9 flex-1 rounded-lg animate-pulse" style={{ background: '#F8F4EF' }} />
        <div className="h-9 flex-1 rounded-lg animate-pulse" style={{ background: '#F8F4EF' }} />
      </div>
      <div className="mx-3 h-10 rounded-lg animate-pulse" style={{ background: '#F2EEE9' }} />
      <div className="flex gap-2 px-3 pt-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-7 w-20 rounded-full animate-pulse"
            style={{ background: '#F8F4EF' }}
          />
        ))}
      </div>
      <div className="mx-3 mt-2 h-10 rounded-xl animate-pulse" style={{ background: '#F2EEE9' }} />
      <div className="mx-3 mt-2 mb-3 h-12 rounded-xl animate-pulse" style={{ background: '#EAF7EE' }} />
    </Surface>
  )
}
