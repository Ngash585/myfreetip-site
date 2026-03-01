import type { TipCard } from '@/lib/api'
import { MatchRow } from './MatchRow'

export function MatchBody({ legs }: { legs: TipCard['legs'] }) {
  if (legs.length === 1) {
    return (
      <div className="mx-3 my-2">
        <MatchRow leg={legs[0]} variant="single" />
      </div>
    )
  }

  return (
    <div
      className={[
        'mx-3 my-2 rounded-lg overflow-hidden',
        'border border-black/[0.06] border-l-4 border-l-blue-600',
        'bg-white dark:bg-white/5',
      ].join(' ')}
    >
      {legs.map((leg, i) => (
        <MatchRow
          key={i}
          leg={leg}
          variant="multi"
          showDivider={i < legs.length - 1}
        />
      ))}
    </div>
  )
}