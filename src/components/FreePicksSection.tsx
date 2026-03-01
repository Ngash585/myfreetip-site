import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { TipCard } from "@/lib/api";
import { getTipCards } from "@/lib/api";
import { PickRow } from "./PickRow";

type Tab = "today" | "tomorrow";

const TAB_LABELS: Record<Tab, string> = {
  today:    "Today",
  tomorrow: "Tomorrow",
};

function getCardTab(card: TipCard): "today" | "tomorrow" | "upcoming" {
  const iso = card.legs[0]?.kickoff_iso ?? card.expiresAt;
  if (!iso) return "today";
  const dayOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round(
    (dayOnly(new Date(iso)).getTime() - dayOnly(new Date()).getTime()) / 86_400_000
  );
  if (diff <= 0) return "today";
  if (diff === 1) return "tomorrow";
  return "upcoming";
}

export function FreePicksSection() {
  const [cards, setCards]     = useState<TipCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive]   = useState<Tab>("today");

  useEffect(() => {
    getTipCards()
      .then(setCards)
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = cards.filter((c) => getCardTab(c) === active);

  return (
    <div className="bg-[#1a2634] rounded-2xl overflow-hidden">
      {/* Header + tabs */}
      <div className="flex items-center justify-between px-4 border-b border-[#2a3a4a]">
        <h2 className="text-xs font-bold text-white uppercase tracking-widest py-3">
          Free Picks
        </h2>
        <div className="flex">
          {(["today", "tomorrow"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={[
                "px-3 py-3 text-xs font-semibold relative transition-colors",
                active === tab ? "text-emerald-400" : "text-[#8a9bb0] hover:text-white",
              ].join(" ")}
            >
              {TAB_LABELS[tab]}
              {active === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="px-4">
        {loading && (
          <p className="py-6 text-center text-xs text-[#8a9bb0]">Loading picks…</p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="py-6 text-center text-xs text-[#8a9bb0]">
            {active === "tomorrow"
              ? "Tomorrow's picks drop at 9 AM — check back soon."
              : "No picks today."}
          </p>
        )}
        {!loading &&
          filtered.flatMap((card) =>
            card.legs.map((leg, i) => (
              <PickRow key={`${card.id}-${i}`} card={card} leg={leg} />
            ))
          )}
      </div>

      {/* Footer link */}
      <div className="px-4 py-3 border-t border-[#2a3a4a]">
        <Link
          to="/predictions"
          className="block text-center text-xs text-emerald-400 font-semibold hover:underline"
        >
          View all predictions →
        </Link>
      </div>
    </div>
  );
}
