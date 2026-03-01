type Analyst = {
  name: string;
  avatar: string;
  winRate: number;
  totalTips: number;
  streak: number;
  specialty: string;
};

const ANALYSTS: Analyst[] = [
  {
    name: "TipMaster",
    avatar: "TM",
    winRate: 74,
    totalTips: 312,
    streak: 8,
    specialty: "Premier League",
  },
  {
    name: "GoalGuru",
    avatar: "GG",
    winRate: 68,
    totalTips: 245,
    streak: 5,
    specialty: "Champions League",
  },
  {
    name: "OddsKing",
    avatar: "OK",
    winRate: 71,
    totalTips: 198,
    streak: 3,
    specialty: "La Liga",
  },
];

export default function Analystwinningrate() {
  return (
    <section aria-label="Analyst winning rates" className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-heading font-bold text-white mb-6">Analyst Performance</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {ANALYSTS.map((a) => (
            <div
              key={a.name}
              className="rounded-2xl border border-[#2a3a4a] bg-[#1a2634] p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00c853]/15 text-[#00c853] font-bold text-sm">
                  {a.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{a.name}</p>
                  <p className="text-xs text-[#8a9bb0]">{a.specialty}</p>
                </div>
              </div>

              {/* Win rate bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#8a9bb0]">Win Rate</span>
                  <span className="font-bold text-[#00c853]">{a.winRate}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#2a3a4a]">
                  <div
                    className="h-2 rounded-full bg-[#00c853]"
                    style={{ width: `${a.winRate}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs">
                <div>
                  <p className="text-[#8a9bb0]">Total Tips</p>
                  <p className="font-semibold text-white">{a.totalTips}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#8a9bb0]">Current Streak</p>
                  <p className="font-semibold text-[#00c853]">🔥 {a.streak} wins</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
