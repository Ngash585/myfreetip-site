-- MyFreeTip — Admin Write Policies
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query → Run
-- This allows authenticated users (team members added via Supabase Auth)
-- to perform all write operations on content tables.

-- tip_cards
create policy "auth write tip_cards"
  on public.tip_cards
  for all
  using (auth.role() = 'authenticated');

-- legs
create policy "auth write legs"
  on public.legs
  for all
  using (auth.role() = 'authenticated');

-- card_bookies
create policy "auth write card_bookies"
  on public.card_bookies
  for all
  using (auth.role() = 'authenticated');

-- news_articles
create policy "auth write news_articles"
  on public.news_articles
  for all
  using (auth.role() = 'authenticated');

-- analyst_stats
create policy "auth write analyst_stats"
  on public.analyst_stats
  for all
  using (auth.role() = 'authenticated');

-- bookies
create policy "auth write bookies"
  on public.bookies
  for all
  using (auth.role() = 'authenticated');
