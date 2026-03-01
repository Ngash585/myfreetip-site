export function AnalystWinRateCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-6"
      style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px' }}
    >
      <div className="flex items-center gap-5">
        <div className="h-[100px] w-[100px] rounded-full animate-pulse flex-shrink-0" style={{ background: '#F2EEE9' }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 w-3/4 rounded-lg animate-pulse" style={{ background: '#F2EEE9' }} />
          <div className="h-3.5 w-1/2 rounded-md animate-pulse" style={{ background: '#F8F4EF' }} />
        </div>
      </div>
      <div className="flex gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 h-[68px] rounded-xl animate-pulse" style={{ background: '#F8F4EF' }} />
        ))}
      </div>
    </div>
  );
}
