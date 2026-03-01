type Confidence = "low" | "medium" | "high";
type Result = "win" | "loss" | "pending";

type Leg = {
  homeTeam: string;
  awayTeam: string;
  league?: string;
  prediction: string;
  odds?: string | number;
};

type Props = {
  title?: string;
  legs: Leg[];
  totalOdds?: string | number;
  confidence?: Confidence;
  result?: Result;
  bookingCode?: string;
  bookmaker?: string;
  matchDate?: string;
};

const RESULT_BADGE: Record<Result, { label: string; color: string }> = {
  win: { label: "WON", color: "#00c853" },
  loss: { label: "LOST", color: "#ef4444" },
  pending: { label: "PENDING", color: "#8a9bb0" },
};

export default function Multipredictioncard({
  title = "Accumulator",
  legs,
  totalOdds,
  result = "pending",
  bookingCode,
  bookmaker,
  matchDate,
}: Props) {
  const badge = RESULT_BADGE[result];

  return (
    <div className="rounded-2xl border border-[#2a3a4a] bg-[#1a2634] p-5">
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-bold text-white">{title}</h3>
          {matchDate && <p className="text-xs text-[#8a9bb0] mt-0.5">{matchDate}</p>}
        </div>
        <div className="text-right">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full block mb-1"
            style={{ color: badge.color, backgroundColor: `${badge.color}22` }}
          >
            {badge.label}
          </span>
          {totalOdds && (
            <p className="text-xl font-bold text-[#00c853]">{totalOdds}</p>
          )}
          {totalOdds && <p className="text-xs text-[#8a9bb0]">total odds</p>}
        </div>
      </div>

      {/* Legs */}
      <div className="space-y-2">
        {legs.map((leg, i) => (
          <div key={i} className="rounded-xl border border-[#2a3a4a] bg-[#0f1923] p-3">
            {leg.league && (
              <p className="text-xs text-[#8a9bb0] mb-1 uppercase tracking-wider">
                {leg.league}
              </p>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-white flex-1">
                {leg.homeTeam} vs {leg.awayTeam}
              </span>
              <span className="text-sm font-semibold text-[#00c853] whitespace-nowrap">
                {leg.prediction}
              </span>
              {leg.odds && (
                <span className="text-sm text-[#8a9bb0] font-mono ml-2">{leg.odds}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Booking code */}
      {bookingCode && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-[#00c853]/30 bg-[#00c853]/5 px-4 py-3">
          <span className="text-sm text-[#8a9bb0]">{bookmaker ?? "Booking Code"}</span>
          <span className="font-mono font-bold text-[#00c853] tracking-widest text-base">
            {bookingCode}
          </span>
        </div>
      )}
    </div>
  );
}
