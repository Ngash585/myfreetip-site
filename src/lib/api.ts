// API utilities and shared types
// Data layer: all components call these functions only.
// To migrate a function to Supabase, replace the mock body —
// components require zero changes.

import { supabase } from './supabase'
import { BOOKMAKERS } from '@/constants/bookmakers'

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

// ─── Analyst Stats ────────────────────────────────────────────────────────────

export async function getAnalystStats(): Promise<AnalystStatsPayload> {
  if (supabase) {
    const { data, error } = await supabase
      .from('analyst_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    if (!error && data) {
      return { records: data, generatedAt: new Date().toISOString() }
    }
  }

  // Mock fallback
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

// ─── TipCards ─────────────────────────────────────────────────────────────────

/** Shape returned by Supabase for card_bookies rows */
type RawCardBookie = {
  bookie_id: string
  code: string | null
  is_default: boolean
  return_5: number | null
  return_10: number | null
  return_20: number | null
  bookies: {
    name: string
    logo_url: string | null
    brand_hex: string | null
    signup_url: string | null
    deeplink_url: string | null
    signup_cta_label: string | null
  } | null
}

/** Shape returned by Supabase for tip_cards with nested relations */
type RawTipCard = {
  id: string
  title: string
  type: string
  badge_label: string | null
  total_odds_label: string | null
  confidence: string
  result: string
  expires_at: string | null
  default_bookie_id: string | null
  analyst: string | null
  category: string | null
  created_at: string
  legs: Array<{
    id: string
    home_team: string
    away_team: string
    match_label: string | null
    league: string | null
    kickoff_iso: string | null
    kickoff_label: string | null
    prediction: string | null
    pick_title: string | null
    odds: string | null
    short_reason: string | null
    left_icon_url: string | null
    right_icon_url: string | null
    sort_order: number
  }>
  card_bookies: RawCardBookie[]
}

function rawToTipCard(raw: RawTipCard): TipCard {
  const legs: Leg[] = (raw.legs ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((l) => ({
      homeTeam: l.home_team,
      awayTeam: l.away_team,
      match_label: l.match_label ?? `${l.home_team} vs ${l.away_team}`,
      league: l.league ?? undefined,
      kickoff_iso: l.kickoff_iso ?? undefined,
      kickoff_label: l.kickoff_label ?? undefined,
      prediction: l.prediction ?? '',
      pick_title: l.pick_title ?? l.prediction ?? undefined,
      odds: l.odds ?? undefined,
      short_reason: l.short_reason ?? undefined,
      left_icon_url: l.left_icon_url ?? undefined,
      right_icon_url: l.right_icon_url ?? undefined,
    }))

  const bookies: Bookie[] = (raw.card_bookies ?? []).map((cb) => {
    const b = cb.bookies
    const returns: BookieReturn[] = []
    if (cb.return_5 != null)  returns.push({ stake_amount: 5,  stake_label: 'KES 5',  return_label: `KES ${cb.return_5.toFixed(2)}`,  return_amount: cb.return_5  })
    if (cb.return_10 != null) returns.push({ stake_amount: 10, stake_label: 'KES 10', return_label: `KES ${cb.return_10.toFixed(2)}`, return_amount: cb.return_10 })
    if (cb.return_20 != null) returns.push({ stake_amount: 20, stake_label: 'KES 20', return_label: `KES ${cb.return_20.toFixed(2)}`, return_amount: cb.return_20 })
    return {
      id: cb.bookie_id,
      name: b?.name ?? cb.bookie_id,
      logo: b?.logo_url ?? undefined,
      code: cb.code ?? undefined,
      signup_url: b?.signup_url ?? undefined,
      deeplink_url: b?.deeplink_url ?? undefined,
      signup_cta_label: b?.signup_cta_label ?? undefined,
      brand_hex: b?.brand_hex ?? undefined,
      default: cb.is_default,
      returns,
    }
  })

  return {
    id: raw.id,
    title: raw.title,
    type: raw.type as TipCard['type'],
    badge_label: raw.badge_label ?? undefined,
    total_odds_label: raw.total_odds_label ?? undefined,
    legs,
    confidence: raw.confidence as Confidence,
    result: raw.result as Result,
    expiresAt: raw.expires_at ?? undefined,
    default_bookie_id: raw.default_bookie_id ?? undefined,
    bookies,
    analyst: raw.analyst ?? undefined,
    category: raw.category ?? undefined,
    date: new Date(raw.created_at).toLocaleDateString('en-GB'),
  }
}

export async function getTipCards(): Promise<TipCard[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('tip_cards')
      .select(`
        *,
        legs ( * ),
        card_bookies (
          bookie_id, code, is_default, return_5, return_10, return_20,
          bookies ( name, logo_url, brand_hex, signup_url, deeplink_url, signup_cta_label )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      return (data as RawTipCard[]).map(rawToTipCard)
    }
  }

  // Mock fallback — used when VITE_SUPABASE_URL is not configured
  const now = new Date();
  const todayKickoff    = new Date(now.getTime() + 6  * 60 * 60 * 1000).toISOString();
  const tomorrowKickoff = new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString();
  const upcomingKickoff = new Date(now.getTime() + 4  * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      id: "1",
      title: "Weekend Accumulator",
      type: "accumulator",
      badge_label: "Best Pick",
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
        { id: "low",  stake_amount: 5,  stake_label: "KES 5",  returns: "23.15" },
        { id: "mid",  stake_amount: 10, stake_label: "KES 10", returns: "46.30" },
        { id: "high", stake_amount: 20, stake_label: "KES 20", returns: "92.60" },
      ],
      confidence: "high",
      result: "pending",
      expiresAt: todayKickoff,
      bookies: [
        {
          id: "1xbet", name: "1xBet", logo: "/1xbet.png", code: "XB12345",
          signup_url: BOOKMAKERS["1xbet"].affiliateUrl,
          signup_cta_label: "Join 1xBet",
          brand_hex: "#1E3A6E", default: true,
          returns: [
            { stake_amount: 5,  stake_label: "KES 5",  return_label: "KES 23.15", return_amount: 23.15 },
            { stake_amount: 10, stake_label: "KES 10", return_label: "KES 46.30", return_amount: 46.30 },
            { stake_amount: 20, stake_label: "KES 20", return_label: "KES 92.60", return_amount: 92.60 },
          ],
        },
        {
          id: "melbet", name: "Melbet", logo: "/melbet.png", code: "MB67890",
          signup_url: BOOKMAKERS.melbet.affiliateUrl,
          signup_cta_label: "Join Melbet",
          brand_hex: "#F5A623",
          returns: [
            { stake_amount: 5,  stake_label: "KES 5",  return_label: "KES 23.15", return_amount: 23.15 },
            { stake_amount: 10, stake_label: "KES 10", return_label: "KES 46.30", return_amount: 46.30 },
            { stake_amount: 20, stake_label: "KES 20", return_label: "KES 92.60", return_amount: 92.60 },
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
          signup_url: BOOKMAKERS.paripesa.affiliateUrl,
          signup_cta_label: "Join Paripesa",
          brand_hex: "#1A56DB", default: true,
          returns: [
            { stake_amount: 5,  stake_label: "KES 5",  return_label: "KES 7.75",  return_amount: 7.75  },
            { stake_amount: 10, stake_label: "KES 10", return_label: "KES 15.50", return_amount: 15.50 },
            { stake_amount: 20, stake_label: "KES 20", return_label: "KES 31.00", return_amount: 31.00 },
          ],
        },
        {
          id: "1xbet", name: "1xBet", logo: "/1xbet.png", code: "XB99001",
          signup_url: BOOKMAKERS["1xbet"].affiliateUrl,
          signup_cta_label: "Join 1xBet",
          brand_hex: "#1E3A6E",
          returns: [
            { stake_amount: 5,  stake_label: "KES 5",  return_label: "KES 7.75",  return_amount: 7.75  },
            { stake_amount: 10, stake_label: "KES 10", return_label: "KES 15.50", return_amount: 15.50 },
            { stake_amount: 20, stake_label: "KES 20", return_label: "KES 31.00", return_amount: 31.00 },
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
          signup_url: BOOKMAKERS.melbet.affiliateUrl,
          signup_cta_label: "Join Melbet",
          brand_hex: "#F5A623", default: true,
          returns: [
            { stake_amount: 5,  stake_label: "KES 5",  return_label: "KES 14.03", return_amount: 14.03 },
            { stake_amount: 10, stake_label: "KES 10", return_label: "KES 28.05", return_amount: 28.05 },
            { stake_amount: 20, stake_label: "KES 20", return_label: "KES 56.10", return_amount: 56.10 },
          ],
        },
      ],
      default_bookie_id: "melbet",
      analyst: "TipMaster",
      date: new Date(upcomingKickoff).toLocaleDateString("en-GB"),
    },
  ];
}

// ─── News Articles ────────────────────────────────────────────────────────────

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Plain text body. Paragraphs separated by \n\n. */
  body: string;
  category: string;
  cover_url?: string;
  /** ISO date string */
  published_at: string;
  author?: string;
  affiliate_label?: string;
  affiliate_url?: string;
};

const MOCK_NEWS: NewsArticle[] = [
  {
    id: "1",
    slug: "premier-league-top-4-race-march-2026",
    title: "Premier League Top-4 Race: Who Has the Edge in March?",
    excerpt:
      "With 10 games left, Arsenal, Man City, Chelsea, and Newcastle are separated by just 4 points. We analyse who holds the advantage and where the best value picks lie.",
    body: `Arsenal head into March on the back of six straight wins and have the most favourable run-in on paper. Their next five fixtures avoid the top-six entirely, giving Mikel Arteta's side a golden chance to bank points before the title run-in begins. Defensively they have been exceptional, conceding just four goals in their last eight matches.

Man City remain the benchmark despite their inconsistency in cup competitions. Pep Guardiola has rotated heavily this season, which has cost them points in the league, but when the squad is fit and focused the quality is undeniable. They face a tricky away trip to Tottenham in gameweek 28 that could prove decisive.

Chelsea under their new manager have quietly built momentum since the winter break. Their expected-goals numbers are among the best in the division, and with Enzo Fernandez hitting his best form, they are the team that markets are undervaluing most heading into the final stretch.

Newcastle remain the wildcard. Their home record is outstanding — 11 wins from 14 — but they have won just twice away from St James' Park in 2026. If the top-four race goes to the wire, those dropped points could prove costly.

Our best value pick: Arsenal to finish in the top two at 2/1. Their fixture list, goal difference advantage, and current form make them the standout call.`,
    category: "Premier League",
    cover_url: "/images/stadium-wide-desktop.webp",
    published_at: "2026-03-01T09:00:00.000Z",
    author: "TipMaster",
  },
  {
    id: "2",
    slug: "champions-league-r16-accumulator-tips",
    title: "Champions League Round of 16: Our Best Accumulator Tips",
    excerpt:
      "The last 16 is set and the quality on offer is exceptional. Here are our top picks for the first legs — including an 8/1 double and a 25/1 four-fold.",
    body: `The Champions League knockout rounds always deliver drama, and this year's draw has produced several mouth-watering ties. Our analysts have been tracking these teams since September and have identified three key trends that should shape your analysis strategy.

The first trend is home dominance in first legs. Over the last three seasons, 78% of teams playing the first leg at home have either won or drawn. This makes the away leg the one to back for upsets, but in the first leg you want to be on the hosts. Back the home team or Asian handicap lines rather than the outright result for better value.

Both Teams to Score has landed in 14 of the last 20 Champions League round-of-16 first legs. The pressure of knockout football, the technical quality of both sides, and the open tactical approach that teams take early in the tie all contribute to this. BTTS at around 1.70 is our core selection across multiple games this round.

Our standout single is Bayern Munich to win and both teams to score against Inter Milan at 2.80. Bayern are unbeaten at home in European competition this season, and Inter always carry a goal threat from their front three. This selection ticks every box.

For accumulators, we have posted a four-fold on the predictions page combining the best value across the four first-leg fixtures. At 25/1 it represents exceptional value — use the match code to load it directly on your chosen platform.`,
    category: "Champions League",
    published_at: "2026-02-28T10:30:00.000Z",
    author: "TipMaster",
    affiliate_url: "https://1xbet.com/register",
    affiliate_label: "Back the Accumulator on 1xBet",
  },
  {
    id: "3",
    slug: "45-1-weekend-accumulator-lands",
    title: "45/1 Weekend Accumulator Lands — Here's How We Called It",
    excerpt:
      "Our Weekend Mega Combo delivered again. Five correct results, including a shock draw at Anfield, turned a Ksh 200 commitment into Ksh 9,200 for followers.",
    body: `Last weekend's accumulator was one of our best performances of the season. Five selections, five correct results, and a 45/1 return that had followers messaging us through Sunday night. Here is a breakdown of how we reached each pick.

The anchor of the slip was Atletico Madrid to win away at Getafe. Atletico's record on the road in Madrid derbies and local fixtures is exceptional — they have not lost a La Liga away game in 2026. At 1.75 this was the banker that gave the accumulator its spine.

The surprise inclusion was the draw at Anfield. Liverpool, despite their position in the table, have been vulnerable at home to teams that sit deep and play on the counter. Brighton came with exactly that game plan, and their expected-goals numbers on the road gave us confidence to include the draw at 4.50 — the longest-priced selection on the slip.

Lazio Over 2.5 Goals, PSG -1 Asian Handicap, and Dortmund to win completed the accumulator. All three were backed by clear statistical evidence: Lazio's high defensive line concedes and scores regularly, PSG's home dominance is unmatched in Ligue 1 this season, and Dortmund needed the three points badly after back-to-back draws.

The lesson here is not that 45/1 shots land regularly — they do not. The lesson is that each individual selection was backed by evidence, not emotion. That discipline is what separates consistent winners from casual followers.`,
    category: "Big Wins",
    published_at: "2026-02-24T14:00:00.000Z",
    author: "TipMaster",
  },
  {
    id: "4",
    slug: "over-under-2-5-goals-betting-guide",
    title: "Over/Under 2.5 Goals: The Smart Analyst's Favourite Market",
    excerpt:
      "Goals markets offer better value than 1X2 for a reason. Learn how to read team statistics, head-to-head records, and tactical setups to find consistent winners.",
    body: `The Over/Under 2.5 Goals market is the most popular prediction market in the world after the match result — and for good reason. It removes the complexity of predicting which team wins and focuses purely on how many goals are scored. For analysts who study data, this market is consistently exploitable.

The starting point is a team's goals-per-game average, both scored and conceded. A team averaging 1.8 goals scored combined with an opponent averaging 1.6 goals conceded already suggests an Over 2.5 outcome is likely. This is basic arithmetic, but most casual followers skip this step entirely.

Head-to-head records matter more in this market than in any other. Some fixture pairings consistently produce high-scoring games regardless of the teams' current form — certain tactical matchups simply create space. If a fixture has gone Over 2.5 in seven of the last ten meetings, that is a strong signal that should not be ignored.

Weather and pitch conditions also play a role. Heavy pitches in winter slow the game down and reduce scoring. Fixtures played on good surfaces in dry conditions tend to produce more goals. Platforms account for this to some extent, but not fully.

Finally, consider the context. Teams with nothing to play for — already relegated or already champions — often produce high-scoring games as defensive intensity drops. Equally, a team chasing a goal difference advantage at the end of the season can drive up totals. Context is everything in this market.`,
    category: "Football Academy",
    published_at: "2026-02-20T08:00:00.000Z",
    author: "TipMaster",
  },
  {
    id: "5",
    slug: "how-to-use-booking-codes-kenya",
    title: "How to Use a Match Code: Step-by-Step Guide",
    excerpt:
      "Never loaded a match code before? This guide walks you through loading a code on 1xBet, Paripesa, and Melbet in under 2 minutes.",
    body: `A match code — sometimes called an access code or slip code — is a shortcut that loads a pre-built selection slip directly into your account. Instead of searching for each match and selection manually, you enter the code and the entire accumulator or single appears instantly, ready to back.

To use a match code on 1xBet, open the app or website and log in to your account. Tap the coupon icon at the bottom of the screen, then look for the "Load Bet" or "Bet Code" option in the platform. Enter the code exactly as shown — codes are case-sensitive on some platforms. The slip will load with all selections and prices pre-filled. Choose your backing amount and confirm.

On Paripesa the process is almost identical. From the main screen, tap the slip icon in the bottom navigation bar. Select "Load Code" from the options that appear. Paste or type the code and tap "Load." Review the selections, add your backing amount, and confirm.

Melbet places the match code option inside the betslip panel. Open the betslip from the bottom right of the screen, scroll to the bottom of the panel, and you will find a text field labelled "Bet Code." Enter the code there and tap "Apply."

One important note: match codes expire at kick-off time. If a match in the accumulator has already started, the code will not load. Always copy and use the code before the first match on the slip kicks off. Our predictions page shows a countdown timer above each code so you always know exactly how much time you have.`,
    category: "Match Analysis",
    published_at: "2026-02-18T07:00:00.000Z",
    author: "TipMaster",
  },
];

export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
    if (!error && data) return data as NewsArticle[]
  }
  return MOCK_NEWS
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single()
    if (!error && data) return data as NewsArticle
  }
  return MOCK_NEWS.find((a) => a.slug === slug) ?? null
}
