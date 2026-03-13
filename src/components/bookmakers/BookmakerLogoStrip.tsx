import { Link } from 'react-router-dom'
import type { BookmakerEntry } from '@/lib/api'

type Props = {
  bookmakers: BookmakerEntry[]
  /** Where the "See all" circle links — defaults to /bookmakers */
  seeAllHref?: string
  /** If provided, clicking a logo scrolls to this element id prefix + slug */
  scrollTargetPrefix?: string
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="text-[10px] font-bold" style={{ color: '#F5A623' }}>
      ★ {value.toFixed(1)}
    </span>
  )
}

export function BookmakerLogoStrip({ bookmakers, seeAllHref = '/bookmakers', scrollTargetPrefix }: Props) {
  function handleLogoClick(slug: string) {
    if (scrollTargetPrefix) {
      const el = document.getElementById(`${scrollTargetPrefix}${slug}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div
      className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-1"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {bookmakers.map((bm) => {
        const inner = (
          <div className="relative shrink-0 flex flex-col items-center gap-1.5">
            {/* Circle */}
            <div
              className="relative w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: bm.logo_url ? (bm.logo_bg_color ?? bm.brand_color ?? '#E5E5E5') : '#E5E5E5',
                boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              }}
            >
              {bm.logo_url ? (
                <img
                  src={bm.logo_url}
                  alt={bm.name}
                  className="w-7 h-7 object-contain"
                />
              ) : (
                /* Placeholder until logo is uploaded — neutral grey, no competing colour */
                <span className="text-[10px] font-semibold" style={{ color: '#999999' }}>
                  {bm.name.slice(0, 1).toUpperCase()}
                </span>
              )}

            </div>

            {/* Name + rating below circle */}
            <div className="text-center">
              <p className="text-[11px] font-medium leading-tight" style={{ color: '#1D1D1D' }}>
                {bm.name}
              </p>
              {bm.star_rating && <StarRating value={bm.star_rating} />}
            </div>
          </div>
        )

        if (scrollTargetPrefix) {
          return (
            <button
              key={bm.slug}
              type="button"
              onClick={() => handleLogoClick(bm.slug)}
              className="focus:outline-none"
              aria-label={`View ${bm.name}`}
            >
              {inner}
            </button>
          )
        }

        return (
          <Link
            key={bm.slug}
            to={`/bookmakers/${bm.slug}`}
            aria-label={`${bm.name} review`}
          >
            {inner}
          </Link>
        )
      })}

      {/* See all circle */}
      <Link
        to={seeAllHref}
        className="shrink-0 flex flex-col items-center gap-1.5"
        aria-label="See all bookmakers"
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ background: '#E5E5E5' }}
        >
          <span className="text-[10px] font-semibold leading-tight text-center" style={{ color: '#777777' }}>
            All
          </span>
        </div>
        <p className="text-[11px] font-medium" style={{ color: '#777777' }}>See all</p>
      </Link>
    </div>
  )
}
