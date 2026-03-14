-- MyFreeTip — Bookmakers Migration
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- Creates the bookmakers table for reviews, promo codes, and bonuses.
-- Also adds a sport column to tip_cards for sport-specific page filtering.

-- ─── bookmakers ──────────────────────────────────────────────────────────────
-- Separate from `bookies` (which links cards to platforms).
-- This table drives review pages, promo code pages, and homepage widgets.
create table if not exists public.bookmakers (
  id                   uuid         primary key default uuid_generate_v4(),

  -- Identity
  rank                 int          not null default 99,
  name                 text         not null,
  slug                 text         not null unique,
  logo_url             text,
  logo_bg_color        text,        -- hex, e.g. #1A56DB
  brand_color          text,        -- hex for buttons and accents
  active               boolean      not null default true,

  -- Offer content
  star_rating          numeric(3,1),
  offer_headline       text,
  offer_subheadline    text,
  promo_code           text,
  claim_url            text,
  last_used_text       text,
  terms                text,

  -- Page visibility
  show_promo_codes     boolean      not null default false,
  show_sign_up_bonuses boolean      not null default false,
  show_homepage_widget boolean      not null default false,
  featured             boolean      not null default false,

  -- Review content (individual review pages)
  review_body          text,        -- paragraphs separated by \n\n
  pros                 jsonb,       -- string[]
  cons                 jsonb,       -- string[]
  our_score            numeric(3,1),
  screenshot_url       text,
  meta_title           text,
  meta_description     text,

  created_at           timestamptz  not null default now()
);

-- ─── sport column on tip_cards ────────────────────────────────────────────────
-- Enables sport-specific filtered pages (/football, /tennis, etc.)
alter table public.tip_cards
  add column if not exists sport text not null default 'football';

-- ─── Row-Level Security ──────────────────────────────────────────────────────
alter table public.bookmakers enable row level security;

create policy "public read bookmakers"
  on public.bookmakers for select using (true);

create policy "auth write bookmakers insert"
  on public.bookmakers for insert to authenticated with check (true);
create policy "auth write bookmakers update"
  on public.bookmakers for update to authenticated using (true);
create policy "auth write bookmakers delete"
  on public.bookmakers for delete to authenticated using (true);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index if not exists bookmakers_slug_idx   on public.bookmakers(slug);
create index if not exists bookmakers_rank_idx   on public.bookmakers(rank);
create index if not exists bookmakers_active_idx on public.bookmakers(active);
create index if not exists tip_cards_sport_idx   on public.tip_cards(sport);

-- ─── Seed Data ───────────────────────────────────────────────────────────────
insert into public.bookmakers (
  rank, name, slug, brand_color, logo_bg_color, active,
  star_rating, offer_headline, offer_subheadline,
  promo_code, claim_url, last_used_text, terms,
  show_promo_codes, show_sign_up_bonuses, show_homepage_widget, featured,
  review_body, pros, cons, our_score,
  meta_title, meta_description
) values
(
  1, 'Paripesa', 'paripesa', '#1A56DB', '#1A56DB', true,
  9.8,
  'Deposit KES 1,000 Get KES 3,000',
  'Use code MYFREETIP for your welcome bonus',
  'MYFREETIP',
  'https://paripesa.bet/kimingiapp',
  'Last used 4 mins ago',
  'New customers only. Min deposit KES 1,000. Bonus credited as free bets. Wagering requirements apply. 18+.',
  true, true, true, true,
  'Paripesa is one of the fastest-growing sports betting platforms in Kenya, offering an impressive range of markets and consistently competitive odds across football, basketball, tennis, and more.

The platform is built with mobile users in mind. The app loads quickly even on slower data connections, and the interface is clean enough that finding a market takes seconds rather than minutes. For Kenyan bettors specifically, Paripesa''s football coverage stands out — they cover lower-league African football and local Kenyan Premier League fixtures that many international bookmakers ignore entirely.

The welcome bonus is one of the strongest available in the Kenyan market right now. Using our exclusive code MYFREETIP, new customers can turn a KES 1,000 deposit into KES 3,000 in betting credits, giving you three times the firepower to explore the platform before committing more of your own funds.

Paripesa''s live betting product has improved significantly. In-play markets are now available on virtually every major football fixture, and the cash-out function works reliably — a feature that serious punters will appreciate when a slip is running.

On the payments side, M-Pesa deposits and withdrawals are instant and free. Paripesa consistently ranks as one of the fastest platforms for withdrawal processing in Kenya, with most requests completed within 15 minutes.',
  '["Competitive odds across all markets", "Instant M-Pesa deposits and withdrawals", "Excellent mobile app performance", "Strong welcome bonus with code MYFREETIP", "Wide African and Kenyan football coverage"]',
  '["Customer support response times can vary", "Some live betting markets close early"]',
  9.8,
  'Paripesa Review 2026 — Honest Assessment for Kenyan Bettors | MyFreeTip',
  'Our honest Paripesa review for 2026. Welcome bonus, odds quality, M-Pesa payments, and how Paripesa compares to rivals in Kenya.'
),
(
  2, '1xBet', '1xbet', '#1E3A6E', '#1E3A6E', true,
  9.5,
  'Deposit KES 1,000 Get KES 3,000',
  'Use code MYFREETIP for your welcome bonus',
  'MYFREETIP',
  'https://refpa483247.pro/L?tag=d_4716502m_1573c_&site=4716502&ad=1573',
  'Last used 12 mins ago',
  'New customers only. Min deposit KES 1,000. Bonus credited as free bets. Wagering requirements apply. 18+.',
  true, true, true, false,
  '1xBet is the most widely used sports betting platform among serious punters in Kenya, and its reputation is earned. The platform offers a genuinely overwhelming selection of markets — over 1,000 pre-match and live betting options on major football fixtures alone.

The match code feature, which loads a pre-built accumulator slip directly into your account, works better on 1xBet than any other platform. Codes entered from our predictions page load instantly and all selections appear correctly formatted. This alone is enough reason for accumulator bettors to have a 1xBet account active.

Odds quality on 1xBet is consistently strong. They are frequently among the top two platforms for football prices in Kenya, and their Asian Handicap and goal line markets offer value that is difficult to find elsewhere.

The platform has a learning curve. The interface is dense and can feel overwhelming for new users. However, once you understand the layout, the depth of options available is unmatched. The mobile app handles the complexity reasonably well.

Payments are straightforward. M-Pesa integration is solid, deposits are instant, and withdrawal times are competitive — typically within 30 minutes for standard amounts.',
  '["Deepest market selection available in Kenya", "Best match code system of any platform", "Consistently strong odds on football", "Excellent Asian Handicap and goals markets", "Fast M-Pesa withdrawals"]',
  '["Interface can feel overwhelming for new users", "Customer support quality inconsistent", "Some promotions have complex wagering terms"]',
  9.5,
  '1xBet Review 2026 — Is It the Best Bookmaker in Kenya? | MyFreeTip',
  'Comprehensive 1xBet review for Kenyan bettors in 2026. Odds quality, match codes, M-Pesa payments, bonuses, and overall value assessed.'
),
(
  3, 'Melbet', 'melbet', '#F5A623', '#F5A623', true,
  9.3,
  'Deposit KES 1,000 Get KES 3,000',
  'Use code MYFREETIP for your welcome bonus',
  'MYFREETIP',
  'https://refpa3665.com/L?tag=d_5333273m_45415c_&site=5333273&ad=45415',
  'Last used 28 mins ago',
  'New customers only. Min deposit KES 1,000. Bonus credited as free bets. Wagering requirements apply. 18+.',
  true, true, true, false,
  'Melbet has established itself as a strong alternative to the dominant platforms in Kenya, combining a solid range of markets with genuinely competitive promotions and one of the smoothest mobile experiences available.

The platform covers all major football leagues comprehensively, with particular strength in European competitions. Champions League, Premier League, La Liga, and Serie A markets are all available in depth, with live betting options that update quickly and reliably.

Where Melbet stands out is in its ongoing promotional programme. Beyond the welcome bonus, Melbet runs regular cashback offers, accumulator insurance, and free bet promotions that add genuine value for active bettors. The frequency and quality of these promotions is higher than most platforms operating in Kenya.

The mobile app is well-designed and noticeably snappier than some rivals. Navigation is logical, loading times are fast, and the in-play experience — including live streaming on selected matches — adds another dimension.

M-Pesa integration is fully supported for both deposits and withdrawals. Melbet has improved its withdrawal processing significantly, with most requests now completed within an hour.',
  '["Strong ongoing promotions beyond the welcome offer", "Excellent Champions League and European coverage", "Fast and clean mobile app experience", "Live streaming on selected matches", "Responsive customer support"]',
  '["Odds slightly below top two platforms on some markets", "Some promotions require significant rollover"]',
  9.3,
  'Melbet Review 2026 — Full Assessment for Kenya | MyFreeTip',
  'Our complete Melbet review for 2026. Welcome bonus, promotions, odds quality, mobile app, and M-Pesa payment experience covered.'
)
on conflict (slug) do nothing;
