/**
 * Article image pool — 10 fast-loading SVG placeholders served as static assets.
 * Replace any .svg with a same-named .webp for photographic quality at any time.
 * getArticleImage() is the single source of truth used by all article components.
 */

export interface ImageSlot {
  path: string
  label: string
  /** If set, this slot is auto-selected when an article has this category */
  category: string | null
  /** Fallback bg colour shown in the admin picker before the image loads */
  bgColor: string
}

export const ARTICLE_IMAGE_SLOTS: ImageSlot[] = [
  { path: '/article-images/premier-league.svg',   label: 'Premier League',   category: 'Premier League',   bgColor: '#3b0764' },
  { path: '/article-images/champions-league.svg', label: 'Champions League', category: 'Champions League', bgColor: '#1e3a5f' },
  { path: '/article-images/football.svg',         label: 'Football',         category: 'Football',         bgColor: '#14532d' },
  { path: '/article-images/match-analysis.svg',   label: 'Match Analysis',   category: 'Match Analysis',   bgColor: '#0c4a6e' },
  { path: '/article-images/football-academy.svg', label: 'Football Academy', category: 'Football Academy', bgColor: '#431407' },
  { path: '/article-images/big-wins.svg',         label: 'Big Wins',         category: 'Big Wins',         bgColor: '#451a03' },
  { path: '/article-images/sport-1.svg',          label: 'Football Tips',    category: null,               bgColor: '#042f2e' },
  { path: '/article-images/sport-2.svg',          label: 'Match Preview',    category: null,               bgColor: '#450a0a' },
  { path: '/article-images/sport-3.svg',          label: 'Sports Analysis',  category: null,               bgColor: '#0f172a' },
  { path: '/article-images/sport-4.svg',          label: 'Betting Guide',    category: null,               bgColor: '#1a1a2e' },
]

// Fast O(1) lookup: category → image path
const CATEGORY_MAP = Object.fromEntries(
  ARTICLE_IMAGE_SLOTS
    .filter((s): s is ImageSlot & { category: string } => s.category !== null)
    .map((s) => [s.category, s.path])
)

// Deterministic fallback: same slug always produces the same general image
const GENERAL_POOL = ARTICLE_IMAGE_SLOTS.filter((s) => s.category === null)

function slugHash(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h
}

/**
 * Returns the image path for an article.
 * Priority: cover_url set by admin → category mapping → slug-based deterministic pick
 */
export function getArticleImage(article: {
  slug: string
  category?: string | null
  cover_url?: string | null
}): string {
  if (article.cover_url) return article.cover_url
  if (article.category && CATEGORY_MAP[article.category]) return CATEGORY_MAP[article.category]
  return GENERAL_POOL[slugHash(article.slug) % GENERAL_POOL.length].path
}
