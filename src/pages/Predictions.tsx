import { useState, useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { TipCard } from "@/lib/api";
import { getTipCards } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PredictionCard, PredictionCardSkeleton } from "@/components/PredictionCard";
import { fbEvent } from "@/lib/fbpixel";

const TABS = ["today", "tomorrow", "weekend", "upcoming"] as const;
type Tab = typeof TABS[number];

const TAB_LABELS: Record<Tab, string> = {
  today:    "Today",
  tomorrow: "Tomorrow",
  weekend:  "Weekend",
  upcoming: "Upcoming",
};

function getCardTab(card: TipCard): Tab {
  const iso = card.legs[0]?.kickoff_iso ?? card.expiresAt;
  if (!iso) return "today";
  const dayOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (dayOnly(new Date(iso)).getTime() - dayOnly(new Date()).getTime()) / 86_400_000
  );
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "tomorrow";
  const dow = dayOnly(new Date(iso)).getDay();
  if (dow === 0 || dow === 6) return "weekend";
  if (dow === 5 && new Date(iso).getHours() >= 18) return "weekend";
  return "upcoming";
}

export default function Predictions() {
  useEffect(() => {
    fbEvent('ViewContent', { content_name: 'Predictions', content_category: 'football-predictions' });
  }, []);

  usePageMeta({
    title: "Today\u2019s Football Predictions \u2014 MyFreeTip",
    description:
      "Today\u2019s football match analysis and predictions. Confidence scores, form data, and match context updated daily across Premier League, La Liga, Champions League and more.",
    canonical: "https://myfreetip.com/predictions",
  });
  const { data: cards = [], isLoading: loading } = useQuery({
    queryKey: ['tip-cards'],
    queryFn: getTipCards,
  });
  const [active, setActive] = useState<Tab>("today");

  const filtered = cards.filter((c) => getCardTab(c) === active);

  return (
    <div style={{ color: '#1D1D1D' }}>
      {/* Tab bar */}
      <div style={{ borderBottom: '1px solid rgba(29,29,29,0.08)' }}>
        <div className="flex px-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className="px-4 py-4 text-sm font-semibold transition-colors relative"
              style={{ color: active === tab ? '#1D1D1D' : '#777777' }}
              onMouseEnter={(e) => { if (active !== tab) (e.currentTarget as HTMLElement).style.color = '#1D1D1D' }}
              onMouseLeave={(e) => { if (active !== tab) (e.currentTarget as HTMLElement).style.color = '#777777' }}
            >
              {TAB_LABELS[tab]}
              {active === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: '#3DB157' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-6">
        {loading && <><PredictionCardSkeleton /><PredictionCardSkeleton /></>}

        {!loading && filtered.map((card) => (
          <PredictionCard key={card.id} card={card} />
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-sm py-6 text-center" style={{ color: '#777777' }}>
            {active === "tomorrow"
              ? "Tomorrow's picks drop at 9:00 AM — check back soon."
              : `No picks available for ${TAB_LABELS[active].toLowerCase()} yet.`}
          </p>
        )}
      </div>
    </div>
  );
}
