type Affiliate = {
  name: string;
  logo: string;
  tagline: string;
  bonus: string;
  url: string;
  accent: string;
};

const AFFILIATES: Affiliate[] = [
  {
    name: "1xBet",
    logo: "/1xbet.png",
    tagline: "Huge markets, live betting & great odds",
    bonus: "100% up to $100",
    url: "https://1xbet.com",
    accent: "#1a6fc4",
  },
  {
    name: "Melbet",
    logo: "/melbet.png",
    tagline: "Fast payouts & 1000+ betting markets",
    bonus: "130% up to $130",
    url: "https://melbet.com",
    accent: "#d4aa00",
  },
  {
    name: "Paripesa",
    logo: "/paripesa.png",
    tagline: "Best odds in African markets",
    bonus: "150% up to $150",
    url: "https://paripesa.com",
    accent: "#00a859",
  },
  {
    name: "SportsBet",
    logo: "/sportsbet.png",
    tagline: "Australia's favourite sports betting",
    bonus: "Up to $50 back",
    url: "https://sportsbet.com.au",
    accent: "#ff6200",
  },
];

export default function AffiliateCards() {
  return (
    <section aria-label="Affiliate partners" className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-heading font-bold text-white mb-6">
          Recommended Bookmakers
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AFFILIATES.map((a) => (
            <div
              key={a.name}
              className="flex flex-col rounded-2xl border border-[#2a3a4a] bg-[#1a2634] p-5 hover:border-[#00c853]/40 transition-colors"
            >
              <img
                src={a.logo}
                alt={a.name}
                className="h-10 w-auto object-contain mb-4"
              />
              <p className="text-sm text-[#8a9bb0] flex-1 mb-4">{a.tagline}</p>
              <div
                className="mb-4 rounded-lg px-3 py-2 text-center text-sm font-semibold text-white"
                style={{
                  backgroundColor: `${a.accent}33`,
                  border: `1px solid ${a.accent}55`,
                }}
              >
                Bonus: {a.bonus}
              </div>
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer sponsored"
                className="block w-full rounded-xl bg-[#00c853] hover:bg-[#00b849] text-[#0f1923] font-semibold text-sm text-center py-2 transition-colors"
              >
                Get Bonus →
              </a>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#8a9bb0]">
          * 18+ only. Bet responsibly. This site may earn commission from affiliate links.
        </p>
      </div>
    </section>
  );
}
