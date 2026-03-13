/**
 * prerender.mjs
 *
 * Post-build script that creates a separate index.html for each static route,
 * with route-specific <title>, <meta name="description">, <link rel="canonical">,
 * and Open Graph / Twitter meta tags injected into the HTML.
 *
 * This ensures Google's crawler receives correct, page-specific metadata in the
 * initial HTML response rather than relying on JavaScript to set tags after load.
 *
 * Run automatically as part of `npm run build`.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const DIST = "dist";
const BASE_URL = "https://myfreetip.com";

const ROUTES = [
  {
    path: "/",
    dir: null, // homepage — overwrite dist/index.html in-place
    title: "MyFreeTip \u2014 Free Daily Football Predictions and Match Analysis",
    description:
      "Free daily football match analysis, confidence-based predictions, and transparent results. Full record published including missed calls. No noise, just analysis.",
  },
  {
    path: "/predictions",
    dir: "predictions",
    title: "Today\u2019s Football Predictions \u2014 MyFreeTip",
    description:
      "Today\u2019s football match analysis and predictions. Confidence scores, form data, and match context updated daily across Premier League, La Liga, Champions League and more.",
  },
  {
    path: "/sports-news",
    dir: "sports-news",
    title: "Football Match Analysis and News \u2014 MyFreeTip",
    description:
      "In-depth football match previews, tactical analysis, and form guides covering Premier League, La Liga, Serie A, Bundesliga, Champions League and African leagues.",
  },
  {
    path: "/about",
    dir: "about",
    title: "About MyFreeTip \u2014 Football Analysis Platform",
    description:
      "MyFreeTip publishes daily football match analysis with a fully transparent record, including successful and unsuccessful outcomes. Built for users who want clear analysis without noise.",
  },
  {
    path: "/terms",
    dir: "terms",
    title: "Terms and Conditions \u2014 MyFreeTip",
    description:
      "Terms and conditions for using MyFreeTip, a football predictions and match analysis platform. Please read before using the site.",
  },
  {
    path: "/privacy",
    dir: "privacy",
    title: "Privacy Policy \u2014 MyFreeTip",
    description:
      "MyFreeTip\u2019s privacy policy covering how we collect, use, and protect information from users of our football predictions and analysis platform.",
  },
  {
    path: "/contact",
    dir: "contact",
    title: "Contact MyFreeTip \u2014 Football Analysis Platform",
    description:
      "Get in touch with the MyFreeTip team. Questions, partnership enquiries, or feedback about our football predictions and match analysis platform.",
  },
  {
    path: "/results",
    dir: "results",
    title: "Prediction Results \u2014 Full Win\u2019Loss Record | MyFreeTip",
    description:
      "Full prediction results for MyFreeTip football tips. Every win, loss, and void published transparently. Filter by result and track our all-time win rate.",
  },
  {
    path: "/contact",
    dir: "contact",
    title: "Contact MyFreeTip \u2014 Football Analysis Platform",
    description:
      "Get in touch with the MyFreeTip team. Questions, partnership enquiries, or feedback about our football predictions and match analysis platform.",
  },
  {
    path: "/bookmakers",
    dir: "bookmakers",
    title: "Bookmaker Reviews 2026 \u2014 Best Betting Sites in Kenya | MyFreeTip",
    description:
      "Honest, in-depth bookmaker reviews for Kenyan bettors in 2026. We compare welcome bonuses, odds quality, M-Pesa payments, and overall value across the top betting sites.",
  },
  {
    path: "/bookmakers/paripesa",
    dir: "bookmakers/paripesa",
    title: "Paripesa Review 2026 \u2014 Honest Assessment for Kenyan Bettors | MyFreeTip",
    description:
      "Our honest Paripesa review for 2026. Welcome bonus up to KES 3,000, odds quality, M-Pesa payments, and how Paripesa compares to rivals in Kenya.",
  },
  {
    path: "/bookmakers/1xbet",
    dir: "bookmakers/1xbet",
    title: "1xBet Review 2026 \u2014 Is It the Best Bookmaker in Kenya? | MyFreeTip",
    description:
      "Comprehensive 1xBet review for Kenyan bettors in 2026. Odds quality, match codes, M-Pesa payments, welcome bonus, and overall value assessed.",
  },
  {
    path: "/bookmakers/melbet",
    dir: "bookmakers/melbet",
    title: "Melbet Review 2026 \u2014 Full Assessment for Kenya | MyFreeTip",
    description:
      "Our complete Melbet review for 2026. Welcome bonus, ongoing promotions, odds quality, mobile app experience, and M-Pesa payments covered.",
  },
  {
    path: "/promo-codes",
    dir: "promo-codes",
    title: "Betting Site Promo Codes 2026 \u2014 Kenya | MyFreeTip",
    description:
      "Exclusive, verified promo codes for the best betting sites in Kenya in 2026. Copy your code and claim your welcome bonus today. Updated regularly.",
  },
  {
    path: "/sign-up-bonuses",
    dir: "sign-up-bonuses",
    title: "Best Sign Up Bonuses 2026 \u2014 Kenya Betting Sites | MyFreeTip",
    description:
      "The best sign-up bonuses and welcome offers from Kenyan betting sites in 2026. Reveal your exclusive code and claim up to KES 3,000 today.",
  },
  {
    path: "/football",
    dir: "football",
    title: "Free Football Predictions Today \u2014 MyFreeTip",
    description:
      "Free daily football tips with confidence ratings and transparent results. Bet type labels on every pick so you can scan for your preferred markets at a glance.",
  },
  {
    path: "/sports-news/how-to-register-paripesa-kenya-2026",
    dir: "sports-news/how-to-register-paripesa-kenya-2026",
    title: "How to Register on Paripesa Kenya 2026 \u2014 Welcome Bonus & M-PESA Guide | MyFreeTip",
    description:
      "How to register on Paripesa Kenya in 2026, claim your KSh 18,000 welcome bonus, and make your first M-PESA deposit. Free football predictions and booking codes included. 18+ only.",
  },
  {
    path: "/sports-news/how-to-register-1xbet-kenya-2026",
    dir: "sports-news/how-to-register-1xbet-kenya-2026",
    title: "How to Register on 1xBet Kenya 2026 \u2014 Welcome Bonus & M-PESA Guide | MyFreeTip",
    description:
      "How to register on 1xBet Kenya in 2026, claim the welcome bonus, and deposit via M-PESA. Free football predictions and daily booking codes from MyFreeTip included. 18+ only.",
  },
  {
    path: "/sports-news/how-to-register-melbet-kenya-2026",
    dir: "sports-news/how-to-register-melbet-kenya-2026",
    title: "How to Register on Melbet Kenya 2026 \u2014 Welcome Bonus & M-PESA Guide | MyFreeTip",
    description:
      "How to register on Melbet Kenya in 2026, claim the welcome bonus, and deposit via M-PESA. Free football predictions and daily booking codes from MyFreeTip. 18+ only.",
  },
];

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function injectMeta(html, { path, title, description }) {
  const url = `${BASE_URL}${path}`;
  const safeTitle = escapeAttr(title);
  const safeDesc = escapeAttr(description);
  const safeUrl = escapeAttr(url);

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);

  // <meta name="description">
  html = html.replace(
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    `$1${safeDesc}$2`
  );

  // <link rel="canonical">
  html = html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${safeUrl}$2`
  );

  // Open Graph
  html = html.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${safeUrl}$2`
  );
  html = html.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${safeTitle}$2`
  );
  html = html.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${safeDesc}$2`
  );

  // Twitter / X
  html = html.replace(
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    `$1${safeTitle}$2`
  );
  html = html.replace(
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    `$1${safeDesc}$2`
  );

  return html;
}

const baseHtml = readFileSync(join(DIST, "index.html"), "utf-8");

for (const route of ROUTES) {
  const html = injectMeta(baseHtml, route);

  if (route.dir === null) {
    writeFileSync(join(DIST, "index.html"), html);
    console.log(`  / -> dist/index.html`);
  } else {
    mkdirSync(join(DIST, route.dir), { recursive: true });
    writeFileSync(join(DIST, route.dir, "index.html"), html);
    console.log(`  ${route.path} -> dist/${route.dir}/index.html`);
  }
}

console.log(`\nPrerendered ${ROUTES.length} routes successfully.`);
