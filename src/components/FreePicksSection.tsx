import { useState } from "react";
import { Link } from "react-router-dom";
import type { TipCard } from "@/lib/api";
import { getTipCards } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
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
  const { data: cards = [], isLoading: loading } = useQuery({
    queryKey: ['tip-cards'],
    queryFn: getTipCards,
  });
  const [active, setActive] = useState<Tab>("today");

  const filtered = cards.filter((c) => getCardTab(c) === active);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#FFFFFF', boxShadow: 'rgba(29, 29, 29, 0.08) 4px 16px 32px 0px' }}
    >
      {/* Header + tabs */}
      <div
        className="flex items-center justify-between px-6"
        style={{ borderBottom: '1px solid rgba(29,29,29,0.08)' }}
      >
        <h2
          className="text-xs font-medium uppercase tracking-widest py-4"
          style={{ color: '#777777' }}
        >
          Free Picks
        </h2>
        <div className="flex">
          {(["today", "tomorrow"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className="px-3 py-4 text-sm relative transition-colors"
              style={{
                color: active === tab ? '#1D1D1D' : '#777777',
                fontWeight: active === tab ? 500 : 400,
              }}
            >
              {TAB_LABELS[tab]}
              {active === tab && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: '#3DB157' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="px-6">
        {loading && (
          <p className="py-6 text-center text-sm" style={{ color: '#777777' }}>Loading picks…</p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="py-6 text-center text-sm" style={{ color: '#777777' }}>
            {active === "tomorrow"
              ? "Tomorrow's picks drop at 9 AM — check back soon."
              : "No picks today."}
          </p>
        )}
        {!loading && (() => {
          let rowIndex = 0;
          return filtered.flatMap((card) =>
            card.legs.map((leg, i) => {
              const idx = rowIndex++;
              return <PickRow key={`${card.id}-${i}`} card={card} leg={leg} rowIndex={idx} />;
            })
          );
        })()}
      </div>

      {/* Footer link */}
      <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(29,29,29,0.08)' }}>
        <Link
          to="/predictions"
          className="block text-center text-sm font-medium transition-colors hover:opacity-70"
          style={{ color: '#3DB157' }}
        >
          View all predictions →
        </Link>
      </div>
    </div>
  );
}
