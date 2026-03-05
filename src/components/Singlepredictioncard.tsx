type Confidence = "low" | "medium" | "high";
type Result = "win" | "loss" | "pending";

type Props = {
  homeTeam: string;
  awayTeam: string;
  league?: string;
  matchTime?: string;
  prediction: string;
  odds?: string | number;
  confidence?: Confidence;
  result?: Result;
  bookingCode?: string;
  bookmaker?: string;
};

const CONF_COLOR: Record<Confidence, string> = {
  low: "#f59e0b",
  medium: "#3b82f6",
  high: "#00c853",
};

const RESULT_BADGE: Record<Result, { label: string; color: string }> = {
  win: { label: "WON", color: "#00c853" },
  loss: { label: "LOST", color: "#ef4444" },
  pending: { label: "PENDING", color: "#8a9bb0" },
};

export default function Singlepredictioncard({
  homeTeam,
  awayTeam,
  league,
  matchTime,
  prediction,
  odds,
  confidence = "medium",
  result = "pending",
  bookingCode,
  bookmaker,
}: Props) {
  const badge = RESULT_BADGE[result];
  const confColor = CONF_COLOR[confidence];
  const confDots = confidence === "low" ? 1 : confidence === "medium" ? 2 : 3;

  return (
    <div className="rounded-2xl border border-[#2a3a4a] bg-[#1a2634] p-5 hover:border-[#00c853]/40 transition-colors">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        {league && (
          <span className="text-xs font-medium text-[#8a9bb0] uppercase tracking-wider">
            {league}
          </span>
        )}
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ color: badge.color, backgroundColor: `${badge.color}22` }}
        >
          {badge.label}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="font-semibold text-white text-sm flex-1">{homeTeam}</span>
        <span className="text-[#8a9bb0] text-xs font-mono">VS</span>
        <span className="font-semibold text-white text-sm flex-1 text-right">{awayTeam}</span>
      </div>

      {/* Prediction row */}
      <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-[#0f1923]">
        <div className="flex-1">
          <p className="text-xs text-[#8a9bb0] mb-0.5">Prediction</p>
          <p className="font-semibold text-white text-sm">{prediction}</p>
        </div>
        {odds && (
          <div className="text-right">
            <p className="text-xs text-[#8a9bb0] mb-0.5">Value</p>
            <p className="font-bold text-[#00c853]">{odds}</p>
          </div>
        )}
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        {matchTime && <span className="text-xs text-[#8a9bb0]">{matchTime}</span>}
        <div className="flex items-center gap-1 ml-auto" title={`${confidence} confidence`}>
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: i <= confDots ? confColor : "#2a3a4a" }}
            />
          ))}
        </div>
      </div>

      {/* Match code */}
      {bookingCode && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-[#2a3a4a] px-3 py-2">
          <span className="text-xs text-[#8a9bb0]">{bookmaker ?? "Code"}:</span>
          <span className="font-mono text-sm font-bold text-[#00c853] tracking-widest">
            {bookingCode}
          </span>
        </div>
      )}
    </div>
  );
}
