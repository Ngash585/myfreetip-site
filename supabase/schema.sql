-- MyFreeTip — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Then run seed.sql to populate with initial data.

-- ─── Enable UUID extension ─────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 1. bookies ─────────────────────────────────────────────────────────────
-- One row per bookmaker partner.
create table if not exists public.bookies (
  id               text        primary key,   -- e.g. '1xbet', 'melbet'
  name             text        not null,
  logo_url         text,
  brand_hex        text,
  signup_url       text,
  deeplink_url     text,
  signup_cta_label text,
  created_at       timestamptz not null default now()
);

-- ─── 2. tip_cards ───────────────────────────────────────────────────────────
-- One row per published tip (single or accumulator).
create table if not exists public.tip_cards (
  id               uuid        primary key default uuid_generate_v4(),
  title            text        not null,
  type             text        not null check (type in ('single', 'accumulator')),
  badge_label      text,
  total_odds_label text,
  confidence       text        not null check (confidence in ('low', 'medium', 'high')),
  result           text        not null check (result in ('win', 'loss', 'pending')) default 'pending',
  expires_at       timestamptz,
  default_bookie_id text       references public.bookies(id) on delete set null,
  analyst          text,
  category         text,
  created_at       timestamptz not null default now()
);

-- ─── 3. legs ────────────────────────────────────────────────────────────────
-- One row per match within a tip_card.
create table if not exists public.legs (
  id             uuid        primary key default uuid_generate_v4(),
  card_id        uuid        not null references public.tip_cards(id) on delete cascade,
  home_team      text        not null,
  away_team      text        not null,
  match_label    text,
  league         text,
  kickoff_iso    timestamptz,
  kickoff_label  text,
  prediction     text,
  pick_title     text,
  odds           text,
  short_reason   text,
  left_icon_url  text,
  right_icon_url text,
  sort_order     int         not null default 0
);

-- ─── 4. card_bookies ────────────────────────────────────────────────────────
-- Junction: which bookies carry each card, with codes and return previews.
create table if not exists public.card_bookies (
  id             uuid        primary key default uuid_generate_v4(),
  card_id        uuid        not null references public.tip_cards(id) on delete cascade,
  bookie_id      text        not null references public.bookies(id) on delete cascade,
  code           text,
  is_default     boolean     not null default false,
  -- Return previews for common stake amounts (in user's local currency)
  return_5       numeric(10,2),   -- return if staking 5 units
  return_10      numeric(10,2),   -- return if staking 10 units
  return_20      numeric(10,2),   -- return if staking 20 units
  unique (card_id, bookie_id)
);

-- ─── 5. news_articles ───────────────────────────────────────────────────────
-- One row per published article.
create table if not exists public.news_articles (
  id              uuid        primary key default uuid_generate_v4(),
  slug            text        not null unique,
  title           text        not null,
  excerpt         text,
  body            text,       -- Plain text; paragraphs separated by \n\n
  category        text,
  cover_url       text,
  published_at    timestamptz not null default now(),
  author          text,
  affiliate_label text,
  affiliate_url   text
);

-- ─── 6. analyst_stats ───────────────────────────────────────────────────────
-- Win-rate records shown in the hero and About page.
create table if not exists public.analyst_stats (
  id            uuid        primary key default uuid_generate_v4(),
  title         text        not null,
  subtitle      text,
  win_rate_pct  numeric(5,2) not null,
  won           int         not null default 0,
  lost          int         not null default 0,
  void          int         not null default 0,
  total         int         not null default 0,
  period_label  text,
  created_at    timestamptz not null default now()
);

-- ─── Row-Level Security ─────────────────────────────────────────────────────
-- Public read, no public write. All writes go through the Supabase dashboard
-- or a service-role key (never exposed to the browser).

alter table public.bookies        enable row level security;
alter table public.tip_cards      enable row level security;
alter table public.legs           enable row level security;
alter table public.card_bookies   enable row level security;
alter table public.news_articles  enable row level security;
alter table public.analyst_stats  enable row level security;

create policy "public read bookies"        on public.bookies        for select using (true);
create policy "public read tip_cards"      on public.tip_cards      for select using (true);
create policy "public read legs"           on public.legs           for select using (true);
create policy "public read card_bookies"   on public.card_bookies   for select using (true);
create policy "public read news_articles"  on public.news_articles  for select using (true);
create policy "public read analyst_stats"  on public.analyst_stats  for select using (true);

-- ─── Indexes ────────────────────────────────────────────────────────────────
create index if not exists legs_card_id_idx       on public.legs(card_id);
create index if not exists card_bookies_card_idx  on public.card_bookies(card_id);
create index if not exists tip_cards_created_idx  on public.tip_cards(created_at desc);
create index if not exists news_slug_idx          on public.news_articles(slug);
create index if not exists news_published_idx     on public.news_articles(published_at desc);
