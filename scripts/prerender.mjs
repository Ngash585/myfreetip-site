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
