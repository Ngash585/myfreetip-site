export function AnalystWinRateCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5"
      style={{
        background: 'linear-gradient(145deg, #0D1E30 0%, #0B1A28 100%)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Ring + title skeleton */}
      <div className="flex items-center gap-5">
        <div className="h-[100px] w-[100px] rounded-full bg-white/[0.06] animate-pulse flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 w-3/4 rounded-lg bg-white/[0.08] animate-pulse" />
          <div className="h-3.5 w-1/2 rounded-md bg-white/[0.05] animate-pulse" />
        </div>
      </div>

      {/* Stat tiles skeleton */}
      <div className="flex gap-2.5">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="flex-1 h-[68px] rounded-xl animate-pulse"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
    </div>
  );
}
