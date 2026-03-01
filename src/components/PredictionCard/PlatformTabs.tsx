import React from 'react'
import type { TipCard } from '@/lib/api'
import { mediaUrl } from '@/lib/api'

interface PlatformTabsProps {
  bookies: TipCard['bookies']
  selectedId: string | number
  onSelect: (id: string | number) => void
}

export function PlatformTabs({ bookies, selectedId, onSelect }: PlatformTabsProps) {
  return (
    <div className="flex gap-2 px-3 pt-3 overflow-x-auto scrollbar-hide">
      {bookies.map((b) => {
        const active = b.id === selectedId
        return (
          <button
            key={String(b.id)}
            type="button"
            onClick={() => onSelect(b.id)}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full border',
              'text-sm font-semibold whitespace-nowrap cursor-pointer transition-all',
              active
                ? 'border-emerald-500 text-[var(--text)] bg-emerald-500/10'
                : 'border-white/15 text-[var(--muted)] bg-transparent',
            ].join(' ')}
          >
            {/* If you later add logo_url to API, swap dot for <img>. For now use brand_hex dot */}
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: b.brand_hex ?? 'rgba(255,255,255,0.3)' }}
            />
            <span>{b.name}</span>
          </button>
        )
      })}
    </div>
  )
}