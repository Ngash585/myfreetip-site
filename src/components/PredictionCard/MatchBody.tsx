import type { TipCard } from '@/lib/api'
import { MatchRow } from './MatchRow'

export function MatchBody({ legs }: { legs: TipCard['legs'] }) {
  if (legs.length === 1) {
    return (
      <div className="mx-4 my-2">
        <MatchRow leg={legs[0]} variant="single" />
      </div>
    )
  }

  return (
    <div
      className="mx-4 my-2 rounded-lg overflow-hidden"
      style={{
        background: '#F8F4EF',
        borderLeft: '3px solid #3DB157',
        border: '1px solid rgba(29,29,29,0.08)',
        borderLeftWidth: '3px',
        borderLeftColor: '#3DB157',
      }}
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
