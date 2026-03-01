-- MyFreeTip — Seed Data
-- Run this AFTER schema.sql.
-- Supabase Dashboard → SQL Editor → New Query → paste → Run

-- ─── bookies ────────────────────────────────────────────────────────────────
insert into public.bookies (id, name, logo_url, brand_hex, signup_url, deeplink_url, signup_cta_label)
values
  ('1xbet',    '1xBet',    '/1xbet.png',    '#1a6fc4', 'https://1xbet.com/register',    'https://1xbet.com/line',    'Join 1xBet'),
  ('melbet',   'Melbet',   '/melbet.png',   '#d4aa00', 'https://melbet.com/register',   'https://melbet.com/line',   'Join Melbet'),
  ('paripesa', 'Paripesa', '/paripesa.png', '#e6000a', 'https://paripesa.com/register', 'https://paripesa.com/line', 'Join Paripesa'),
  ('sportsbet','Sportsbet','/sportsbet.png','#ff6600', 'https://sportsbet.io/register', 'https://sportsbet.io',      'Join Sportsbet')
on conflict (id) do nothing;

-- ─── analyst_stats ──────────────────────────────────────────────────────────
insert into public.analyst_stats (title, subtitle, win_rate_pct, won, lost, void, total, period_label)
values
  ('Overall Win Rate', 'Based on all predictions to date', 73.00, 44, 16, 3, 63, 'all time')
on conflict do nothing;

-- ─── tip_cards + legs + card_bookies ────────────────────────────────────────
-- Card 1: Weekend Accumulator
do $$
declare
  card1 uuid := uuid_generate_v4();
  card2 uuid := uuid_generate_v4();
  card3 uuid := uuid_generate_v4();
  t0    timestamptz := now();
begin

  -- Card 1 ─ Weekend Accumulator (expires today + 6h)
  insert into public.tip_cards (id, title, type, badge_label, total_odds_label, confidence, result, expires_at, default_bookie_id, analyst)
  values (card1, 'Weekend Accumulator', 'accumulator', 'Best Bet', '4.62 | High', 'high', 'pending', t0 + interval '6 hours', '1xbet', 'TipMaster');

  insert into public.legs (card_id, home_team, away_team, match_label, league, kickoff_iso, kickoff_label, prediction, pick_title, odds, sort_order)
  values
    (card1, 'Man City',  'Arsenal',   'Man City vs Arsenal',          'Premier League',  t0 + interval '6 hours', 'Premier League · 20:00', 'Both Teams to Score', 'Both Teams to Score', '1.85', 0),
    (card1, 'Real Madrid','Barcelona','Real Madrid vs Barcelona',      'La Liga',         t0 + interval '6 hours', 'La Liga · 22:00',        'Over 2.5 Goals',      'Over 2.5 Goals',      '1.72', 1),
    (card1, 'PSG',        'Lyon',     'PSG vs Lyon',                   'Ligue 1',         t0 + interval '6 hours', 'Ligue 1 · 21:00',        'PSG Win',             'PSG Win',             '1.45', 2);

  insert into public.card_bookies (card_id, bookie_id, code, is_default, return_5, return_10, return_20)
  values
    (card1, '1xbet',  'XB12345', true,  23.15, 46.30, 92.60),
    (card1, 'melbet', 'MB67890', false, 23.15, 46.30, 92.60);

  -- Card 2 ─ Safe Single (expires tomorrow + 26h)
  insert into public.tip_cards (id, title, type, badge_label, total_odds_label, confidence, result, expires_at, default_bookie_id, analyst)
  values (card2, 'Safe Single — Home Win', 'single', 'Safe Pick', '1.55 | High', 'medium', 'pending', t0 + interval '26 hours', 'paripesa', 'TipMaster');

  insert into public.legs (card_id, home_team, away_team, match_label, league, kickoff_iso, kickoff_label, prediction, pick_title, odds, short_reason, sort_order)
  values
    (card2, 'Liverpool', 'Wolves', 'Liverpool vs Wolves', 'Premier League', t0 + interval '26 hours', 'Premier League · 15:00', 'Liverpool Win', 'Liverpool Win', '1.55',
     'Liverpool unbeaten in last 8 home games. Wolves without 3 key defenders.', 0);

  insert into public.card_bookies (card_id, bookie_id, code, is_default, return_5, return_10, return_20)
  values
    (card2, 'paripesa', 'PP11223', true,  7.75,  15.50, 31.00),
    (card2, '1xbet',    'XB99001', false, 7.75,  15.50, 31.00);

  -- Card 3 ─ Champions League Double (expires +4 days)
  insert into public.tip_cards (id, title, type, badge_label, total_odds_label, confidence, result, expires_at, default_bookie_id, analyst)
  values (card3, 'Champions League Double', 'accumulator', 'Upcoming', '2.81 | Medium', 'medium', 'pending', t0 + interval '4 days', 'melbet', 'TipMaster');

  insert into public.legs (card_id, home_team, away_team, match_label, league, kickoff_iso, kickoff_label, prediction, pick_title, odds, sort_order)
  values
    (card3, 'Bayern Munich',  'Inter Milan', 'Bayern Munich vs Inter Milan',    'Champions League', t0 + interval '4 days', 'UCL · 21:00', 'Both Teams to Score', 'Both Teams to Score', '1.70', 0),
    (card3, 'Atletico Madrid','Dortmund',    'Atletico Madrid vs Dortmund',     'Champions League', t0 + interval '4 days', 'UCL · 19:00', 'Over 2.5 Goals',      'Over 2.5 Goals',      '1.65', 1);

  insert into public.card_bookies (card_id, bookie_id, code, is_default, return_5, return_10, return_20)
  values
    (card3, 'melbet', 'MB55443', true, 14.03, 28.05, 56.10);

end $$;

-- ─── news_articles ──────────────────────────────────────────────────────────
insert into public.news_articles (slug, title, excerpt, body, category, cover_url, published_at, author, affiliate_url, affiliate_label)
values
  (
    'premier-league-top-4-race-march-2026',
    'Premier League Top-4 Race: Who Has the Edge in March?',
    'With 10 games left, Arsenal, Man City, Chelsea, and Newcastle are separated by just 4 points. We analyse who holds the advantage and where the best value bets lie.',
    E'Arsenal head into March on the back of six straight wins and have the most favourable run-in on paper. Their next five fixtures avoid the top-six entirely, giving Mikel Arteta''s side a golden chance to bank points before the title run-in begins. Defensively they have been exceptional, conceding just four goals in their last eight matches.\n\nMan City remain the benchmark despite their inconsistency in cup competitions. Pep Guardiola has rotated heavily this season, which has cost them points in the league, but when the squad is fit and focused the quality is undeniable. They face a tricky away trip to Tottenham in gameweek 28 that could prove decisive.\n\nChelsea under their new manager have quietly built momentum since the winter break. Their expected-goals numbers are among the best in the division, and with Enzo Fernandez hitting his best form, they are the team that bookmakers are underrating most heading into the final stretch.\n\nNewcastle remain the wildcard. Their home record is outstanding — 11 wins from 14 — but they have won just twice away from St James'' Park in 2026. If the top-four race goes to the wire, those dropped points could prove costly.\n\nOur best value bet: Arsenal to finish in the top two at 2/1. Their fixture list, goal difference advantage, and current form make them the standout pick.',
    'Premier League',
    '/images/stadium-wide-desktop.webp',
    '2026-03-01T09:00:00.000Z',
    'TipMaster',
    null,
    null
  ),
  (
    'champions-league-r16-accumulator-tips',
    'Champions League Round of 16: Our Best Accumulator Tips',
    'The last 16 is set and the quality on offer is exceptional. Here are our top picks for the first legs — including an 8/1 double and a 25/1 four-fold.',
    E'The Champions League knockout rounds always deliver drama, and this year''s draw has produced several mouth-watering ties. Our analysts have been tracking these teams since September and have identified three key trends that should shape your betting strategy.\n\nThe first trend is home dominance in first legs. Over the last three seasons, 78% of teams playing the first leg at home have either won or drawn. This makes the away leg the one to back for upsets, but in the first leg you want to be on the hosts. Back the home team or Asian handicap lines rather than the outright result for better value.\n\nBoth Teams to Score has landed in 14 of the last 20 Champions League round-of-16 first legs. The pressure of knockout football, the technical quality of both sides, and the open tactical approach that teams take early in the tie all contribute to this. BTTS at around 1.70 is our core selection across multiple games this round.\n\nOur standout single is Bayern Munich to win and both teams to score against Inter Milan at 2.80. Bayern are unbeaten at home in European competition this season, and Inter always carry a goal threat from their front three. This selection ticks every box.\n\nFor accumulators, we have posted a four-fold on the predictions page combining the best value across the four first-leg fixtures. At 25/1 it represents exceptional value — use the booking code to load it directly on your chosen platform.',
    'Champions League',
    null,
    '2026-02-28T10:30:00.000Z',
    'TipMaster',
    'https://1xbet.com/register',
    'Get the Accumulator on 1xBet'
  ),
  (
    '45-1-weekend-accumulator-lands',
    '45/1 Weekend Accumulator Lands — Here''s How We Called It',
    'Our Weekend Mega Combo delivered again. Five correct results, including a shock draw at Anfield, turned a Ksh 200 stake into Ksh 9,200 for subscribers.',
    E'Last weekend''s accumulator was one of our best performances of the season. Five selections, five correct results, and a 45/1 return that had subscribers messaging us through Sunday night. Here is a breakdown of how we reached each pick.\n\nThe anchor of the slip was Atletico Madrid to win away at Getafe. Atletico''s record on the road in Madrid derbies and local fixtures is exceptional — they have not lost a La Liga away game in 2026. At 1.75 this was the banker that gave the accumulator its spine.\n\nThe surprise inclusion was the draw at Anfield. Liverpool, despite their position in the table, have been vulnerable at home to teams that sit deep and play on the counter. Brighton came with exactly that game plan, and their expected-goals numbers on the road gave us confidence to include the draw at 4.50 — the longest-priced selection on the slip.\n\nLazio Over 2.5 Goals, PSG -1 Asian Handicap, and Dortmund to win completed the accumulator. All three were backed by clear statistical evidence: Lazio''s high defensive line concedes and scores regularly, PSG''s home dominance is unmatched in Ligue 1 this season, and Dortmund needed the three points badly after back-to-back draws.\n\nThe lesson here is not that 45/1 shots land regularly — they do not. The lesson is that each individual selection was backed by evidence, not emotion. That discipline is what separates consistent winners from casual punters.',
    'Big Wins',
    null,
    '2026-02-24T14:00:00.000Z',
    'TipMaster',
    null,
    null
  ),
  (
    'over-under-2-5-goals-betting-guide',
    'Over/Under 2.5 Goals: The Smart Bettor''s Favourite Market',
    'Goals markets offer better value than 1X2 for a reason. Learn how to read team statistics, head-to-head records, and tactical setups to find consistent winners.',
    E'The Over/Under 2.5 Goals market is the most popular betting market in the world after the match result — and for good reason. It removes the complexity of predicting which team wins and focuses purely on how many goals are scored. For bettors who study data, this market is consistently exploitable.\n\nThe starting point is a team''s goals-per-game average, both scored and conceded. A team averaging 1.8 goals scored combined with an opponent averaging 1.6 goals conceded already suggests an Over 2.5 outcome is likely. This is basic arithmetic, but most casual bettors skip this step entirely.\n\nHead-to-head records matter more in this market than in any other. Some fixture pairings consistently produce high-scoring games regardless of the teams'' current form — certain tactical matchups simply create space. If a fixture has gone Over 2.5 in seven of the last ten meetings, that is a strong signal that should not be ignored.\n\nWeather and pitch conditions also play a role. Heavy pitches in winter slow the game down and reduce scoring. Fixtures played on good surfaces in dry conditions tend to produce more goals. Bookmakers account for this to some extent, but not fully.\n\nFinally, consider the stakes. Teams with nothing to play for — already relegated or already champions — often produce high-scoring games as defensive intensity drops. Equally, a team chasing a goal difference advantage at the end of the season can drive up totals. Context is everything in this market.',
    'Betting Academy',
    null,
    '2026-02-20T08:00:00.000Z',
    'TipMaster',
    null,
    null
  ),
  (
    'how-to-use-booking-codes-kenya',
    'How to Use a Booking Code: Step-by-Step Guide',
    'Never placed a bet using a booking code before? This guide walks you through loading a code on 1xBet, Paripesa, and Melbet in under 2 minutes.',
    E'A booking code — sometimes called a bet code or slip code — is a shortcut that loads a pre-built betting slip directly into your account. Instead of searching for each match and selection manually, you enter the code and the entire accumulator or single appears instantly, ready to stake.\n\nTo use a booking code on 1xBet, open the app or website and log in to your account. Tap the coupon icon at the bottom of the screen, then look for the "Load Bet" or "Bet Code" option. Enter the code exactly as shown — codes are case-sensitive on some platforms. The slip will load with all selections and odds pre-filled. Choose your stake and confirm.\n\nOn Paripesa the process is almost identical. From the main screen, tap the slip icon in the bottom navigation bar. Select "Load Code" from the options that appear. Paste or type the code and tap "Load." Review the selections, add your stake, and place the bet.\n\nMelbet places the booking code option inside the betslip panel. Open the betslip from the bottom right of the screen, scroll to the bottom of the panel, and you will find a text field labelled "Bet Code." Enter the code there and tap "Apply."\n\nOne important note: booking codes expire at kick-off time. If a match in the accumulator has already started, the code will not load. Always copy and use the code before the first match on the slip kicks off. Our predictions page shows a countdown timer above each code so you always know exactly how much time you have.',
    'Betting Tips',
    null,
    '2026-02-18T07:00:00.000Z',
    'TipMaster',
    null,
    null
  )
on conflict (slug) do nothing;
