export { PredictionCard } from "./PredictionCard";

// Loading skeleton shown while tip cards are fetching
export function PredictionCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2a3a4a] bg-[#1a2634] overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[#2a3a4a]">
        <div className="flex justify-between mb-3">
          <div className="h-5 w-16 rounded-full bg-[#2a3a4a]" />
          <div className="h-5 w-28 rounded-full bg-[#2a3a4a]" />
        </div>
        <div className="h-5 w-48 rounded bg-[#2a3a4a] mb-2" />
        <div className="h-3 w-32 rounded bg-[#2a3a4a]" />
      </div>
      {/* Matches */}
      <div className="p-5 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-[#0f1923] border border-[#2a3a4a] p-3 space-y-2">
            <div className="h-3 w-24 rounded bg-[#2a3a4a]" />
            <div className="flex justify-between">
              <div className="h-4 w-28 rounded bg-[#2a3a4a]" />
              <div className="h-4 w-28 rounded bg-[#2a3a4a]" />
            </div>
          </div>
        ))}
        <div className="h-12 w-full rounded-xl bg-[#2a3a4a]" />
        <div className="h-10 w-full rounded-xl bg-[#2a3a4a]" />
      </div>
    </div>
  );
}
