import { useState } from "react";
import type { TipCard, Leg } from "@/lib/api";
import { useTimer } from "@/components/PredictionCard/useTimer";
import { formatCountdown } from "@/components/PredictionCard/timerUtils";

interface PickRowProps {
  card: TipCard;
  leg: Leg;
}

export function PickRow({ card, leg }: PickRowProps) {
  const [copied, setCopied] = useState(false);
  const bookie = card.bookies.find((b) => b.id === card.default_bookie_id) ?? card.bookies[0];
  const { secs, timerState } = useTimer(leg.kickoff_iso ?? card.expiresAt);

  const timerColor = {
    healthy:  "text-emerald-400",
    warning:  "text-amber-400",
    critical: "text-red-400",
    expired:  "text-[#8a9bb0]",
  }[timerState];

  const btnClass = {
    healthy:  "bg-emerald-500 hover:bg-emerald-400 text-white",
    warning:  "bg-amber-500 hover:bg-amber-400 text-black",
    critical: "bg-red-500 hover:bg-red-400 text-white",
    expired:  "bg-[#2a3a4a] text-[#8a9bb0] cursor-not-allowed",
  }[timerState];

  function copy() {
    if (timerState === "expired" || !bookie?.code) return;
    navigator.clipboard.writeText(bookie.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#2a3a4a] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {card.badge_label && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
              {card.badge_label}
            </span>
          )}
          <span className={`text-[10px] font-mono ${timerColor}`}>
            {timerState === "expired" ? "Expired" : formatCountdown(secs)}
          </span>
        </div>
        <p className="text-sm font-semibold text-white truncate">
          {leg.match_label ?? `${leg.homeTeam} vs ${leg.awayTeam}`}
        </p>
        <p className="text-xs text-[#8a9bb0] mt-0.5">
          {leg.pick_title ?? leg.prediction}
          {leg.odds ? ` · ${leg.odds}` : ""}
        </p>
      </div>

      {bookie?.code && (
        <button
          type="button"
          onClick={copy}
          disabled={timerState === "expired"}
          className={[
            "flex-shrink-0 px-3 rounded-lg text-xs font-bold transition-colors",
            "min-w-[44px] min-h-[44px] flex items-center justify-center",
            btnClass,
          ].join(" ")}
        >
          {copied ? "✓" : "Copy"}
        </button>
      )}
    </div>
  );
}
