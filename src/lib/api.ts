// API utilities and shared types

export type Confidence = "low" | "medium" | "high";
export type Result = "win" | "loss" | "pending";

export type Match = {
  homeTeam: string;
  awayTeam: string;
  league?: string;
  matchTime?: string;
  prediction: string;
  odds?: string | number;
};

export type PlatformCode = {
  platform: string;
  logo?: string;
  code: string;
  url?: string;
};

export type Prediction = {
  id: string;
  title: string;
  matches: Match[];
  totalOdds?: string | number;
  confidence: Confidence;
  result: Result;
  expiresAt?: string;
  platformCodes?: PlatformCode[];
  analyst?: string;
  date?: string;
};

export function mediaUrl(path: string): string {
  return path.startsWith("http") ? path : `/${path.replace(/^\//, "")}`;
}

export type BookieReturn = {
  stake_amount: number;
  stake_label?: string;
  return_label: string;
  return_amount?: number;
};

export type Bookie = {
  id: string;
  name: string;
  logo?: string;
  code?: string;
  url?: string;
  signup_url?: string;
  deeplink_url?: string;
  signup_cta_label?: string;
  brand_hex?: string;
  returns?: BookieReturn[];
  /** Marks the default/featured bookie for this card */
  default?: boolean;
};

export type Leg = {
  homeTeam: string;
  awayTeam: string;
  league?: string;
  matchTime?: string;
  kickoff_iso?: string;
  /** Human-readable kickoff label e.g. "La Liga · 22:00" */
  kickoff_label?: string;
  prediction: string;
  odds?: string | number;
  pick_title?: string;
  /** Display label for the match e.g. "Real Madrid vs Barcelona" */
  match_label?: string;
  short_reason?: string;
  left_icon_url?: string;
  right_icon_url?: string;
};

export type OddsOption = {
  id?: string;
  stake_amount: string | number;
  stake_label?: string;
  returns?: string;
};

// TipCard — primary data shape used by all card components
export type TipCard = {
  id: string;
  title: string;
  type?: "single" | "accumulator";
  badge_label?: string;
  /** Combined odds as display string — e.g. "4.62" or "4.62 | High" */
  total_odds_label?: string;
  // match legs — always an array (empty if unused)
  legs: Leg[];
  matches?: Match[];
  totalOdds?: OddsOption[];
  confidence: Confidence;
  result: Result;
  expiresAt?: string;
  bookies: Bookie[];
  default_bookie_id?: string;
  platformCodes?: PlatformCode[];
  analyst?: string;
  date?: string;
  category?: string;
};

// ─── Analyst Win Rate types ───────────────────────────────────────────────────

export type AnalystStatRecord = {
  title: string;
  subtitle?: string | null;
  win_rate_pct: number;
  won: number;
  lost: number;
  void?: number | null;
  total: number;
  period_from?: string | null;
  period_label?: string | null;
};

export type AnalystStatsPayload = {
  records: AnalystStatRecord[];
  generatedAt: string;
};

/**
 * Fetch analyst stat records.
 * Mock data — swap body for Supabase when ready:
 *   const { data } = await supabase.from('analyst_stats').select('*').order('created_at', { ascending: false }).limit(10)
 *   return { records: data ?? [], generatedAt: new Date().toISOString() }
 */
export async function getAnalystStats(): Promise<AnalystStatsPayload> {
  return {
    records: [
      {
        title: "Overall Win Rate",
        subtitle: "Based on all predictions to date",
        win_rate_pct: 73,
        won: 44,
        lost: 16,
        void: 3,
        total: 63,
        period_label: "all time",
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

// ─── TipCards API ─────────────────────────────────────────────────────────────

/**
 * Fetch tip cards.
 * Mock data — swap body for Supabase when ready:
 *   const { data } = await supabase
 *     .from('tip_cards')
 *     .select('*, legs(*), bookies(*, bookie_returns(*))')
 *     .order('created_at', { ascending: false })
 *     .limit(10)
 *   return data ?? []
 */
export async function getTipCards(): Promise<TipCard[]> {
  const now = new Date();
  const todayKickoff    = new Date(now.getTime() + 6  * 60 * 60 * 1000).toISOString();
  const tomorrowKickoff = new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString();
  const upcomingKickoff = new Date(now.getTime() + 4  * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: "1",
      title: "Weekend Accumulator",
      type: "accumulator",
      badge_label: "Best Bet",
      total_odds_label: "4.62 | High",
      legs: [
        {
          homeTeam: "Man City", awayTeam: "Arsenal",
          match_label: "Man City vs Arsenal",
          league: "Premier League", kickoff_iso: todayKickoff,
          kickoff_label: "Premier League · 20:00",
          prediction: "Both Teams to Score", pick_title: "Both Teams to Score",
          odds: "1.85",
        },
        {
          homeTeam: "Real Madrid", awayTeam: "Barcelona",
          match_label: "Real Madrid vs Barcelona",
          league: "La Liga", kickoff_iso: todayKickoff,
          kickoff_label: "La Liga · 22:00",
          prediction: "Over 2.5 Goals", pick_title: "Over 2.5 Goals",
          odds: "1.72",
        },
        {
          homeTeam: "PSG", awayTeam: "Lyon",
          match_label: "PSG vs Lyon",
          league: "Ligue 1", kickoff_iso: todayKickoff,
          kickoff_label: "Ligue 1 · 21:00",
          prediction: "PSG Win", pick_title: "PSG Win",
          odds: "1.45",
        },
      ],
      totalOdds: [
        { id: "low",  stake_amount: 5,  stake_label: "$5",  returns: "23.15" },
        { id: "mid",  stake_amount: 10, stake_label: "$10", returns: "46.30" },
        { id: "high", stake_amount: 20, stake_label: "$20", returns: "92.60" },
      ],
      confidence: "high",
      result: "pending",
      expiresAt: todayKickoff,
      bookies: [
        {
          id: "1xbet", name: "1xBet", logo: "/1xbet.png", code: "XB12345",
          url: "https://1xbet.com", signup_url: "https://1xbet.com/register",
          deeplink_url: "https://1xbet.com/line", signup_cta_label: "Join 1xBet",
          brand_hex: "#1a6fc4", default: true,
          returns: [
            { stake_amount: 5,  stake_label: "$5",  return_label: "$23.15", return_amount: 23.15 },
            { stake_amount: 10, stake_label: "$10", return_label: "$46.30", return_amount: 46.30 },
            { stake_amount: 20, stake_label: "$20", return_label: "$92.60", return_amount: 92.60 },
          ],
        },
        {
          id: "melbet", name: "Melbet", logo: "/melbet.png", code: "MB67890",
          url: "https://melbet.com", signup_url: "https://melbet.com/register",
          deeplink_url: "https://melbet.com/line", signup_cta_label: "Join Melbet",
          brand_hex: "#d4aa00",
          returns: [
            { stake_amount: 5,  stake_label: "$5",  return_label: "$23.15", return_amount: 23.15 },
            { stake_amount: 10, stake_label: "$10", return_label: "$46.30", return_amount: 46.30 },
            { stake_amount: 20, stake_label: "$20", return_label: "$92.60", return_amount: 92.60 },
          ],
        },
      ],
      default_bookie_id: "1xbet",
      analyst: "TipMaster",
      date: new Date().toLocaleDateString("en-GB"),
    },
    {
      id: "2",
      title: "Safe Single — Home Win",
      type: "single",
      badge_label: "Safe Pick",
      total_odds_label: "1.55 | High",
      legs: [
        {
          homeTeam: "Liverpool", awayTeam: "Wolves",
          match_label: "Liverpool vs Wolves",
          league: "Premier League", kickoff_iso: tomorrowKickoff,
          kickoff_label: "Premier League · 15:00",
          prediction: "Liverpool Win", pick_title: "Liverpool Win",
          odds: "1.55",
          short_reason: "Liverpool unbeaten in last 8 home games. Wolves without 3 key defenders.",
        },
      ],
      confidence: "medium",
      result: "pending",
      expiresAt: tomorrowKickoff,
      bookies: [
        {
          id: "paripesa", name: "Paripesa", logo: "/paripesa.png", code: "PP11223",
          url: "https://paripesa.com", signup_url: "https://paripesa.com/register",
          deeplink_url: "https://paripesa.com/line", signup_cta_label: "Join Paripesa",
          brand_hex: "#e6000a", default: true,
          returns: [
            { stake_amount: 5,  stake_label: "$5",  return_label: "$7.75",  return_amount: 7.75  },
            { stake_amount: 10, stake_label: "$10", return_label: "$15.50", return_amount: 15.50 },
            { stake_amount: 20, stake_label: "$20", return_label: "$31.00", return_amount: 31.00 },
          ],
        },
        {
          id: "1xbet", name: "1xBet", logo: "/1xbet.png", code: "XB99001",
          url: "https://1xbet.com", signup_url: "https://1xbet.com/register",
          deeplink_url: "https://1xbet.com/line", signup_cta_label: "Join 1xBet",
          brand_hex: "#1a6fc4",
          returns: [
            { stake_amount: 5,  stake_label: "$5",  return_label: "$7.75",  return_amount: 7.75  },
            { stake_amount: 10, stake_label: "$10", return_label: "$15.50", return_amount: 15.50 },
            { stake_amount: 20, stake_label: "$20", return_label: "$31.00", return_amount: 31.00 },
          ],
        },
      ],
      default_bookie_id: "paripesa",
      analyst: "TipMaster",
      date: new Date(now.getTime() + 86_400_000).toLocaleDateString("en-GB"),
    },
    {
      id: "3",
      title: "Champions League Double",
      type: "accumulator",
      badge_label: "Upcoming",
      total_odds_label: "2.81 | Medium",
      legs: [
        {
          homeTeam: "Bayern Munich", awayTeam: "Inter Milan",
          match_label: "Bayern Munich vs Inter Milan",
          league: "Champions League", kickoff_iso: upcomingKickoff,
          kickoff_label: "UCL · 21:00",
          prediction: "Both Teams to Score", pick_title: "Both Teams to Score",
          odds: "1.70",
        },
        {
          homeTeam: "Atletico Madrid", awayTeam: "Dortmund",
          match_label: "Atletico Madrid vs Dortmund",
          league: "Champions League", kickoff_iso: upcomingKickoff,
          kickoff_label: "UCL · 19:00",
          prediction: "Over 2.5 Goals", pick_title: "Over 2.5 Goals",
          odds: "1.65",
        },
      ],
      confidence: "medium",
      result: "pending",
      expiresAt: upcomingKickoff,
      bookies: [
        {
          id: "melbet", name: "Melbet", logo: "/melbet.png", code: "MB55443",
          url: "https://melbet.com", signup_url: "https://melbet.com/register",
          deeplink_url: "https://melbet.com/line", signup_cta_label: "Join Melbet",
          brand_hex: "#d4aa00", default: true,
          returns: [
            { stake_amount: 5,  stake_label: "$5",  return_label: "$14.03", return_amount: 14.03 },
            { stake_amount: 10, stake_label: "$10", return_label: "$28.05", return_amount: 28.05 },
            { stake_amount: 20, stake_label: "$20", return_label: "$56.10", return_amount: 56.10 },
          ],
        },
      ],
      default_bookie_id: "melbet",
      analyst: "TipMaster",
      date: new Date(upcomingKickoff).toLocaleDateString("en-GB"),
    },
  ];
}
