import { Link } from "react-router-dom";
import Singlepredictioncard from "@/components/Singlepredictioncard";

const SAMPLE = [
  {
    homeTeam: "Man City",
    awayTeam: "Arsenal",
    league: "Premier League",
    matchTime: "Today 20:45",
    prediction: "Both Teams to Score",
    odds: "1.85",
    confidence: "high" as const,
    result: "pending" as const,
  },
  {
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    league: "La Liga",
    matchTime: "Today 21:00",
    prediction: "Over 2.5 Goals",
    odds: "1.72",
    confidence: "high" as const,
    result: "pending" as const,
  },
  {
    homeTeam: "PSG",
    awayTeam: "Lyon",
    league: "Ligue 1",
    matchTime: "Today 20:00",
    prediction: "PSG Win",
    odds: "1.45",
    confidence: "medium" as const,
    result: "pending" as const,
  },
];

export default function Featuredpredictions() {
  return (
    <section aria-label="Featured predictions" className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-white">Today's Free Tips</h2>
          <Link to="/predictions" className="text-sm text-[#00c853] hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE.map((p, i) => (
            <Singlepredictioncard key={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
