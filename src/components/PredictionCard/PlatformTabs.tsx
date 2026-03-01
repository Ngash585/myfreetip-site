import type { TipCard } from '@/lib/api'

interface PlatformTabsProps {
  bookies: TipCard['bookies']
  selectedId: string | number
  onSelect: (id: string | number) => void
}

export function PlatformTabs({ bookies, selectedId, onSelect }: PlatformTabsProps) {
  return (
    <div className="flex gap-2 px-4 pt-4 overflow-x-auto scrollbar-hide">
      {bookies.map((b) => {
        const active = b.id === selectedId
        return (
          <button
            key={String(b.id)}
            type="button"
            onClick={() => onSelect(b.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap cursor-pointer transition-all"
            style={{
              background: active ? '#FFFFFF' : '#F2EEE9',
              border: `1px solid ${active ? 'rgba(29,29,29,0.20)' : 'rgba(29,29,29,0.10)'}`,
              color: active ? '#1D1D1D' : '#4F4841',
              fontWeight: active ? 500 : 400,
              boxShadow: active ? 'rgba(29,29,29,0.08) 2px 4px 8px' : 'none',
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: b.brand_hex ?? 'rgba(29,29,29,0.20)' }}
            />
            <span>{b.name}</span>
          </button>
        )
      })}
    </div>
  )
}
