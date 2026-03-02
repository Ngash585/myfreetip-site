import type { TipCard } from '@/lib/api'
import { BOOKMAKERS } from '@/constants/bookmakers'

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
        const brand = BOOKMAKERS[String(b.id)]
        return (
          <button
            key={String(b.id)}
            type="button"
            onClick={() => onSelect(b.id)}
            className="flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            style={active ? {
              background: brand?.activeBg ?? '#1D1D1D',
              color: brand?.activeText ?? '#FFFFFF',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'background 200ms ease, color 200ms ease, box-shadow 200ms ease',
            } : {
              background: '#F2EEE9',
              color: '#4F4841',
              border: '1px solid rgba(29,29,29,0.10)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '14px',
              fontWeight: 400,
              transition: 'background 200ms ease, color 200ms ease, box-shadow 200ms ease',
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: active
                  ? 'rgba(255,255,255,0.75)'
                  : (brand?.dot ?? b.brand_hex ?? 'rgba(29,29,29,0.20)'),
              }}
            />
            <span>{b.name}</span>
          </button>
        )
      })}
    </div>
  )
}
