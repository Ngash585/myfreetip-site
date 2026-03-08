import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getResults, getAnalystStats } from '@/lib/api'
import { PredictionCard, PredictionCardSkeleton } from '@/components/PredictionCard'

type Filter = 'all' | 'win' | 'loss'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',  label: 'All Results' },
  { value: 'win',  label: 'Won' },
  { value: 'loss', label: 'Lost' },
]

export default function Results() {
  const [filter, setFilter] = useState<Filter>('all')

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['results'],
    queryFn: getResults,
    staleTime: 60_000,
  })

  const { data: statsPayload } = useQuery({
    queryKey: ['analyst-stats'],
    queryFn: getAnalystStats,
    staleTime: 60_000,
  })

  const stats = statsPayload?.records[0]
  const wonCount  = stats?.won  ?? 0
  const lostCount = stats?.lost ?? 0
  const winRate   = stats?.win_rate_pct ?? 0
  const total     = stats?.total ?? 0

  const filtered =
    filter === 'all'
      ? cards
      : cards.filter((c) => c.result === filter)

  return (
    <div className="min-h-screen" style={{ background: '#F3F2EC' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-6">
          <h1
            className="font-bold mb-1"
            style={{ fontSize: '22px', color: '#1D1D1D' }}
          >
            Results
          </h1>
          <p style={{ fontSize: '13px', color: '#8a9bb0' }}>
            All-time record · last 7 days shown below
          </p>
        </div>

        {/* Stats bar */}
        {!isLoading && total > 0 && (
          <div
            className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden mb-6"
            style={{ background: '#d4cfc8' }}
          >
            <StatCell label="Won" value={wonCount} color="#00b446" />
            <StatCell label="Lost" value={lostCount} color="#dc2626" />
            <StatCell label="Win Rate" value={`${winRate}%`} color="#00b446" />
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {FILTERS.map(({ value, label }) => {
            const isActive = filter === value
            const count = value === 'win'
              ? cards.filter((c) => c.result === 'win').length
              : value === 'loss'
              ? cards.filter((c) => c.result === 'loss').length
              : cards.length
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: isActive ? '#1D1D1D' : 'white',
                  color: isActive ? 'white' : '#555',
                  border: isActive ? '1px solid #1D1D1D' : '1px solid #d4cfc8',
                }}
              >
                {label}
                {!isLoading && (
                  <span
                    className="text-xs rounded-full px-1.5 py-0.5 font-semibold"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.15)' : '#F3F2EC',
                      color: isActive ? 'white' : '#8a9bb0',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Cards — single column mobile, same PredictionCard as homepage */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => <PredictionCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((card) => (
              <PredictionCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCell({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color: string
}) {
  return (
    <div
      className="flex flex-col items-center py-4 px-3"
      style={{ background: 'white' }}
    >
      <span className="text-xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-xs mt-0.5" style={{ color: '#8a9bb0' }}>
        {label}
      </span>
    </div>
  )
}

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div
      className="rounded-2xl px-6 py-16 text-center"
      style={{ background: 'white', border: '1px solid #d4cfc8' }}
    >
      <p className="text-3xl mb-3">📊</p>
      <p className="font-semibold mb-1" style={{ color: '#1D1D1D' }}>
        {filter === 'all'
          ? 'No results yet this week'
          : filter === 'win'
          ? 'No wins this week'
          : 'No losses this week'}
      </p>
      <p className="text-sm" style={{ color: '#8a9bb0' }}>
        {filter === 'all'
          ? 'Completed picks appear here once marked by the analyst.'
          : 'Change the filter to see other results.'}
      </p>
    </div>
  )
}
