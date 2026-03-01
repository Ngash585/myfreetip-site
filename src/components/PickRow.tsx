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

  const timerColor: Record<string, string> = {
    healthy:  "#777777",
    warning:  "#B8860B",
    critical: "#C0392B",
    expired:  "#BBBBBB",
  };

  function copy() {
    if (timerState === "expired" || !bookie?.code) return;
    navigator.clipboard.writeText(bookie.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const isExpired = timerState === "expired";

  return (
    <div
      className="flex items-center gap-3 py-4"
      style={{ borderBottom: '1px solid rgba(29,29,29,0.07)' }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          {card.badge_label && (
            <span
              className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ background: '#EAF7EE', color: '#2D9A47', border: '1px solid rgba(61,177,87,0.25)' }}
            >
              {card.badge_label}
            </span>
          )}
          <span
            className="text-[11px]"
            style={{ fontFamily: "'DM Mono', monospace", color: timerColor[timerState] ?? '#777777' }}
          >
            {isExpired ? "Expired" : formatCountdown(secs)}
          </span>
        </div>
        <p className="text-sm font-medium truncate" style={{ color: '#1D1D1D' }}>
          {leg.match_label ?? `${leg.homeTeam} vs ${leg.awayTeam}`}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#4F4841' }}>
          {leg.pick_title ?? leg.prediction}
          {leg.odds ? (
            <> · <span style={{ color: '#B8860B', fontWeight: 500 }}>{leg.odds}</span></>
          ) : null}
        </p>
      </div>

      {bookie?.code && (
        <button
          type="button"
          onClick={copy}
          disabled={isExpired}
          className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-opacity text-white"
          style={{
            background: isExpired ? '#DDDDDD' : '#080A2D',
            color: isExpired ? '#999' : '#FFFFFF',
            cursor: isExpired ? 'not-allowed' : 'pointer',
            minHeight: '40px',
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}
