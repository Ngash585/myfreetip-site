import type { TipCard } from '@/lib/api'
import { MatchRow } from './MatchRow'

export function MatchBody({ legs }: { legs: TipCard['legs'] }) {
  return (
    <div>
      {legs.map((leg, i) => (
        <MatchRow
          key={i}
          leg={leg}
          variant={legs.length === 1 ? 'single' : 'multi'}
          showDivider={i < legs.length - 1}
        />
      ))}
    </div>
  )
}
