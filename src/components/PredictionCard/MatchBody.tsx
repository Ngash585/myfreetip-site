import type { TipCard } from '@/lib/api'
import { MatchRow } from './MatchRow'

interface MatchBodyProps {
  legs: TipCard['legs']
  showFull: boolean
  onWallTrigger: () => void
}

export function MatchBody({ legs, showFull, onWallTrigger }: MatchBodyProps) {
  return (
    <div>
      {legs.map((leg, i) => (
        <MatchRow
          key={i}
          leg={leg}
          variant={legs.length === 1 ? 'single' : 'multi'}
          showDivider={i < legs.length - 1}
          showFull={showFull}
          onWallTrigger={onWallTrigger}
        />
      ))}
    </div>
  )
}
