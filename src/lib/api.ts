// API utilities and shared types
// Data layer: all components call these functions only.
// To migrate a function to Supabase, replace the mock body —
// components require zero changes.

import { getSupabase } from './supabase'
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
  /** Final score entered after match e.g. "2 - 1" */
  final_score?: string;
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
  /** ISO string — set when admin marks win or loss */
  resulted_at?: string;
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
  const sb = await getSupabase()
  if (sb) {
    // Auto-calculate from actual tip results — accumulates forever
    const { data, error } = await sb
      .from('tip_cards')
      .select('result')
      .in('result', ['win', 'loss'])

    if (!error && data) {
      const won   = data.filter((r) => r.result === 'win').length
      const lost  = data.filter((r) => r.result === 'loss').length
      const total = won + lost
      const win_rate_pct = total > 0 ? Math.round((won / total) * 100) : 0

      return {
        records: [{
          title: "Overall Win Rate",
          subtitle: "Based on all predictions to date",
          win_rate_pct,
          won,
          lost,
          total,
          period_label: "all time",
        }],
        generatedAt: new Date().toISOString(),
      }
    }
  }

  // Mock fallback
  return {
    records: [{
      title: "Overall Win Rate",
      subtitle: "Based on all predictions to date",
      win_rate_pct: 73,
      won: 44,
      lost: 16,
      void: 3,
      total: 63,
      period_label: "all time",
    }],
    generatedAt: new Date().toISOString(),
  }
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
  resulted_at: string | null
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
    final_score: string | null
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
      final_score: l.final_score ?? undefined,
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
    resulted_at: raw.resulted_at ?? undefined,
    default_bookie_id: raw.default_bookie_id ?? undefined,
    bookies,
    analyst: raw.analyst ?? undefined,
    category: raw.category ?? undefined,
    date: new Date(raw.created_at).toLocaleDateString('en-GB'),
  }
}

const CARD_SELECT = `
  *,
  legs ( * ),
  card_bookies (
    bookie_id, code, is_default, return_5, return_10, return_20,
    bookies ( name, logo_url, brand_hex, signup_url, deeplink_url, signup_cta_label )
  )
`

export async function getTipCards(): Promise<TipCard[]> {
  const sb = await getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('tip_cards')
      .select(CARD_SELECT)
      .eq('result', 'pending')
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      // Filter out cards that expired more than 12h ago (auto-moved to results)
      const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000
      return (data as RawTipCard[])
        .filter(c => !c.expires_at || new Date(c.expires_at).getTime() > twelveHoursAgo)
        .map(rawToTipCard)
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
          id: "paripesa", name: "Paripesa", logo: "/paripesa.png", code: "MYFREETIP",
          signup_url: BOOKMAKERS.paripesa.webUrl ?? BOOKMAKERS.paripesa.affiliateUrl,
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

// ─── Results ──────────────────────────────────────────────────────────────────

export async function getResults(): Promise<TipCard[]> {
  const sb = await getSupabase()
  if (sb) {
    // Fetch all cards from the last 7 days, filter in JS
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await sb
      .from('tip_cards')
      .select(CARD_SELECT)
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false })

    if (!error && data) {
      const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000
      return (data as RawTipCard[])
        .filter(c =>
          c.result === 'win' ||
          c.result === 'loss' ||
          (c.result === 'pending' && c.expires_at && new Date(c.expires_at).getTime() < twelveHoursAgo)
        )
        .map(rawToTipCard)
    }
  }

  // Mock fallback — a few resulted cards for local dev
  const now = new Date()
  const yesterday = new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString()
  const twoDaysAgo = new Date(now.getTime() - 50 * 60 * 60 * 1000).toISOString()
  const threeDaysAgo = new Date(now.getTime() - 74 * 60 * 60 * 1000).toISOString()

  return [
    {
      id: "r1",
      title: "Weekend Accumulator",
      type: "accumulator",
      badge_label: "Best Pick",
      total_odds_label: "4.62 | High",
      legs: [
        { homeTeam: "Man City", awayTeam: "Arsenal", match_label: "Man City vs Arsenal", league: "Premier League", kickoff_iso: yesterday, kickoff_label: "Premier League · 20:00", prediction: "Both Teams to Score", pick_title: "Both Teams to Score", odds: "1.85" },
        { homeTeam: "Real Madrid", awayTeam: "Barcelona", match_label: "Real Madrid vs Barcelona", league: "La Liga", kickoff_iso: yesterday, kickoff_label: "La Liga · 22:00", prediction: "Over 2.5 Goals", pick_title: "Over 2.5 Goals", odds: "1.72" },
      ],
      confidence: "high",
      result: "win",
      expiresAt: yesterday,
      resulted_at: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
      bookies: [],
      date: new Date(yesterday).toLocaleDateString('en-GB'),
    },
    {
      id: "r2",
      title: "Safe Single — Home Win",
      type: "single",
      badge_label: "Safe Pick",
      total_odds_label: "1.55 | High",
      legs: [
        { homeTeam: "Liverpool", awayTeam: "Wolves", match_label: "Liverpool vs Wolves", league: "Premier League", kickoff_iso: twoDaysAgo, kickoff_label: "Premier League · 15:00", prediction: "Liverpool Win", pick_title: "Liverpool Win", odds: "1.55", short_reason: "Liverpool unbeaten in last 8 home games." },
      ],
      confidence: "medium",
      result: "loss",
      expiresAt: twoDaysAgo,
      resulted_at: new Date(now.getTime() - 44 * 60 * 60 * 1000).toISOString(),
      bookies: [],
      date: new Date(twoDaysAgo).toLocaleDateString('en-GB'),
    },
    {
      id: "r3",
      title: "Champions League Double",
      type: "accumulator",
      badge_label: "UCL Special",
      total_odds_label: "2.81 | Medium",
      legs: [
        { homeTeam: "Bayern Munich", awayTeam: "Inter Milan", match_label: "Bayern Munich vs Inter Milan", league: "Champions League", kickoff_iso: threeDaysAgo, kickoff_label: "UCL · 21:00", prediction: "Both Teams to Score", pick_title: "Both Teams to Score", odds: "1.70" },
        { homeTeam: "Atletico Madrid", awayTeam: "Dortmund", match_label: "Atletico Madrid vs Dortmund", league: "Champions League", kickoff_iso: threeDaysAgo, kickoff_label: "UCL · 19:00", prediction: "Over 2.5 Goals", pick_title: "Over 2.5 Goals", odds: "1.65" },
      ],
      confidence: "medium",
      result: "win",
      expiresAt: threeDaysAgo,
      resulted_at: new Date(now.getTime() - 68 * 60 * 60 * 1000).toISOString(),
      bookies: [],
      date: new Date(threeDaysAgo).toLocaleDateString('en-GB'),
    },
  ]
}

/** Admin: mark a card as won or lost. */
export async function setTipResult(id: string, result: 'win' | 'loss'): Promise<void> {
  const sb = await getSupabase()
  if (!sb) return
  await sb
    .from('tip_cards')
    .update({ result })
    .eq('id', id)
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


export async function getNewsArticles(): Promise<NewsArticle[]> {
  const sb = await getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('news_articles')
      .select('*')
      .eq('archived', false)
      .order('published_at', { ascending: false })
    if (!error && data) return data as NewsArticle[]
  }
  return []
}

// ─── VIP Emails ───────────────────────────────────────────────────────────────

/** Save a VIP email to Supabase. Silently succeeds if Supabase is not configured. */
export async function saveVipEmail(email: string): Promise<void> {
  const sb = await getSupabase()
  if (!sb) return
  await sb.from('vip_emails').insert({ email })
}

/**
 * Subscribe an email to the newsletter.
 * Returns 'ok' on success, 'duplicate' if already subscribed, 'error' on failure.
 */
export async function saveNewsletterEmail(
  email: string,
  source = 'website',
): Promise<'ok' | 'duplicate' | 'error'> {
  const sb = await getSupabase()
  if (!sb) return 'ok' // dev: silently succeed when Supabase not configured
  const { error } = await sb
    .from('newsletter_subscribers')
    .insert({ email, source })
  if (!error) return 'ok'
  if (error.code === '23505') return 'duplicate' // unique_violation
  return 'error'
}

/** Admin: toggle archived state on a news article. */
export async function setNewsArchived(id: string, archived: boolean): Promise<void> {
  const sb = await getSupabase()
  if (!sb) return
  await sb.from('news_articles').update({ archived }).eq('id', id)
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const sb = await getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (!error && data) return data as NewsArticle
  }
  return null
}

// ─── Bookmakers (review / promo / bonus pages) ───────────────────────────────

export type BookmakerEntry = {
  id: string
  rank: number
  name: string
  slug: string
  logo_url?: string
  logo_bg_color?: string
  brand_color?: string
  active: boolean
  star_rating?: number
  offer_headline?: string
  offer_subheadline?: string
  promo_code?: string
  claim_url?: string
  last_used_text?: string
  terms?: string
  show_promo_codes: boolean
  show_sign_up_bonuses: boolean
  show_homepage_widget: boolean
  featured: boolean
  review_body?: string
  pros?: string[]
  cons?: string[]
  our_score?: number
  screenshot_url?: string
  meta_title?: string
  meta_description?: string
}

const MOCK_BOOKMAKERS: BookmakerEntry[] = [
  {
    id: 'mock-paripesa',
    rank: 1,
    name: 'Paripesa',
    slug: 'paripesa',
    logo_url: '/logos/paripesa.png',
    brand_color: '#1A56DB',
    logo_bg_color: '#1A56DB',
    active: true,
    star_rating: 9.8,
    offer_headline: 'Deposit KES 1,000 Get KES 3,000',
    offer_subheadline: 'Use code MYFREETIP for your welcome bonus',
    promo_code: 'MYFREETIP',
    claim_url: 'https://paripesa.bet/kimingiapp',
    last_used_text: 'Last used 4 mins ago',
    terms: 'New customers only. Min deposit KES 1,000. Bonus credited as free bets. Wagering requirements apply. 18+.',
    show_promo_codes: true,
    show_sign_up_bonuses: true,
    show_homepage_widget: true,
    featured: true,
    review_body: 'Paripesa is one of the fastest-growing sports betting platforms in Kenya, offering an impressive range of markets and consistently competitive odds.\n\nThe platform is built with mobile users in mind. The app loads quickly even on slower data connections, and finding a market takes seconds. Paripesa\'s football coverage stands out — they cover lower-league African football and local Kenyan Premier League fixtures that many international bookmakers ignore.\n\nThe welcome bonus is one of the strongest available in Kenya. Using our exclusive code MYFREETIP, new customers can turn a KES 1,000 deposit into KES 3,000 in betting credits.\n\nOn the payments side, M-Pesa deposits and withdrawals are instant and free. Paripesa consistently ranks as one of the fastest platforms for withdrawal processing in Kenya.',
    pros: ['Competitive odds across all markets', 'Instant M-Pesa deposits and withdrawals', 'Excellent mobile app performance', 'Strong welcome bonus with code MYFREETIP', 'Wide African and Kenyan football coverage'],
    cons: ['Customer support response times can vary', 'Some live betting markets close early'],
    our_score: 9.8,
    meta_title: 'Paripesa Review 2026 — Honest Assessment for Kenyan Bettors | MyFreeTip',
    meta_description: 'Our honest Paripesa review for 2026. Welcome bonus, odds quality, M-Pesa payments, and how Paripesa compares to rivals in Kenya.',
  },
  {
    id: 'mock-1xbet',
    rank: 2,
    name: '1xBet',
    slug: '1xbet',
    logo_url: '/logos/1xbet.png',
    brand_color: '#1E3A6E',
    logo_bg_color: '#1E3A6E',
    active: true,
    star_rating: 9.5,
    offer_headline: 'Deposit KES 1,000 Get KES 3,000',
    offer_subheadline: 'Use code MYFREETIP for your welcome bonus',
    promo_code: 'MYFREETIP',
    claim_url: 'https://refpa483247.pro/L?tag=d_4716502m_1573c_&site=4716502&ad=1573',
    last_used_text: 'Last used 12 mins ago',
    terms: 'New customers only. Min deposit KES 1,000. Bonus credited as free bets. Wagering requirements apply. 18+.',
    show_promo_codes: true,
    show_sign_up_bonuses: true,
    show_homepage_widget: true,
    featured: false,
    review_body: '1xBet is the most widely used sports betting platform among serious punters in Kenya. The platform offers over 1,000 pre-match and live betting options on major football fixtures alone.\n\nThe match code feature works better on 1xBet than any other platform. Codes entered from our predictions page load instantly with all selections correctly formatted.\n\nOdds quality on 1xBet is consistently strong. They are frequently among the top two platforms for football prices in Kenya, and their Asian Handicap and goal line markets offer exceptional value.\n\nThe platform has a learning curve. The interface is dense, but once understood the depth is unmatched. M-Pesa withdrawals are typically completed within 30 minutes.',
    pros: ['Deepest market selection available in Kenya', 'Best match code system of any platform', 'Consistently strong odds on football', 'Excellent Asian Handicap and goals markets', 'Fast M-Pesa withdrawals'],
    cons: ['Interface can feel overwhelming for new users', 'Customer support quality inconsistent'],
    our_score: 9.5,
    meta_title: '1xBet Review 2026 — Is It the Best Bookmaker in Kenya? | MyFreeTip',
    meta_description: 'Comprehensive 1xBet review for Kenyan bettors in 2026. Odds quality, match codes, M-Pesa payments, bonuses, and overall value assessed.',
  },
  {
    id: 'mock-melbet',
    rank: 3,
    name: 'Melbet',
    slug: 'melbet',
    logo_url: '/logos/melbet.png',
    brand_color: '#F5A623',
    logo_bg_color: '#F5A623',
    active: true,
    star_rating: 9.3,
    offer_headline: 'Deposit KES 1,000 Get KES 3,000',
    offer_subheadline: 'Use code MYFREETIP for your welcome bonus',
    promo_code: 'MYFREETIP',
    claim_url: 'https://refpa3665.com/L?tag=d_4720077m_45415c_&site=4720077&ad=45415',
    last_used_text: 'Last used 28 mins ago',
    terms: 'New customers only. Min deposit KES 1,000. Bonus credited as free bets. Wagering requirements apply. 18+.',
    show_promo_codes: true,
    show_sign_up_bonuses: true,
    show_homepage_widget: true,
    featured: false,
    review_body: 'Melbet has established itself as a strong alternative in Kenya, combining solid markets with genuinely competitive promotions and one of the smoothest mobile experiences available.\n\nWhere Melbet stands out is in its ongoing promotional programme. Beyond the welcome bonus, Melbet runs regular cashback offers, accumulator insurance, and free bet promotions that add genuine value.\n\nThe mobile app is well-designed and noticeably snappier than some rivals, with live streaming on selected matches adding another dimension.\n\nM-Pesa integration is fully supported. Most withdrawal requests are completed within an hour.',
    pros: ['Strong ongoing promotions beyond the welcome offer', 'Excellent Champions League and European coverage', 'Fast and clean mobile app experience', 'Live streaming on selected matches', 'Responsive customer support'],
    cons: ['Odds slightly below top two platforms on some markets', 'Some promotions require significant rollover'],
    our_score: 9.3,
    meta_title: 'Melbet Review 2026 — Full Assessment for Kenya | MyFreeTip',
    meta_description: 'Our complete Melbet review for 2026. Welcome bonus, promotions, odds quality, mobile app, and M-Pesa payment experience covered.',
  },
]

export async function getBookmakers(): Promise<BookmakerEntry[]> {
  const sb = await getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('bookmakers')
      .select('*')
      .eq('active', true)
      .order('rank', { ascending: true })
    if (!error && data) return data as BookmakerEntry[]
  }
  return MOCK_BOOKMAKERS
}

export async function getBookmakerBySlug(slug: string): Promise<BookmakerEntry | null> {
  const sb = await getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('bookmakers')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (!error && data) return data as BookmakerEntry
  }
  return MOCK_BOOKMAKERS.find((b) => b.slug === slug) ?? null
}

/** Admin: save (insert or update) a bookmaker entry */
export async function saveBookmaker(
  payload: Omit<BookmakerEntry, 'id'> & { id?: string },
): Promise<{ error: string | null }> {
  const sb = await getSupabase()
  if (!sb) return { error: 'Not connected' }
  const { id, ...rest } = payload
  if (id) {
    const { error } = await sb.from('bookmakers').update(rest).eq('id', id)
    return { error: error?.message ?? null }
  } else {
    const { error } = await sb.from('bookmakers').insert(rest)
    return { error: error?.message ?? null }
  }
}

/** Admin: delete a bookmaker entry */
export async function deleteBookmaker(id: string): Promise<void> {
  const sb = await getSupabase()
  if (!sb) return
  await sb.from('bookmakers').delete().eq('id', id)
}

// ─── Sport-filtered tip cards ─────────────────────────────────────────────────

export async function getSportTipCards(sport: string): Promise<TipCard[]> {
  const sb = await getSupabase()
  if (sb) {
    const { data, error } = await sb
      .from('tip_cards')
      .select(CARD_SELECT)
      .eq('result', 'pending')
      .eq('sport', sport)
      .order('created_at', { ascending: false })
      .limit(20)
    if (!error && data) {
      const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000
      return (data as RawTipCard[])
        .filter((c) => !c.expires_at || new Date(c.expires_at).getTime() > twelveHoursAgo)
        .map(rawToTipCard)
    }
  }
  // In dev / mock mode, return all mock cards filtered by sport keyword
  const all = await getTipCards()
  return all
}
