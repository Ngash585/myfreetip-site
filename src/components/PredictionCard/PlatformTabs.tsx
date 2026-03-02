import type { TipCard } from '@/lib/api'
import { BOOKMAKERS } from '@/constants/bookmakers'

interface PlatformTabsProps {
  bookies: TipCard['bookies']
  selectedId: string | number
  onSelect: (id: string | number) => void
}

export function PlatformTabs({ bookies, selectedId, onSelect }: PlatformTabsProps) {
  return (
    <div
      className="flex overflow-x-auto scrollbar-hide"
      style={{ gap: '6px', padding: '8px 14px', flexWrap: 'nowrap' }}
    >
      {bookies.map((b) => {
        const active = b.id === selectedId
        const brand = BOOKMAKERS[String(b.id)]
        return (
          <button
            key={String(b.id)}
            type="button"
            onClick={() => onSelect(b.id)}
            className="inline-flex items-center whitespace-nowrap cursor-pointer"
            style={active ? {
              height: '28px',
              padding: '0 10px',
              borderRadius: '14px',
              fontSize: '12px',
              fontWeight: 500,
              gap: '5px',
              background: brand?.activeBg ?? '#1D1D1D',
              color: brand?.activeText ?? '#FFFFFF',
              border: 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
              transition: 'background 200ms ease, color 200ms ease',
            } : {
              height: '28px',
              padding: '0 10px',
              borderRadius: '14px',
              fontSize: '12px',
              fontWeight: 500,
              gap: '5px',
              background: '#F2EEE9',
              color: '#4F4841',
              border: '1px solid rgba(29,29,29,0.10)',
              transition: 'background 200ms ease, color 200ms ease',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                flexShrink: 0,
                background: active
                  ? 'rgba(255,255,255,0.75)'
                  : (brand?.dot ?? b.brand_hex ?? 'rgba(29,29,29,0.20)'),
                display: 'inline-block',
              }}
            />
            <span>{b.name}</span>
          </button>
        )
      })}
    </div>
  )
}
