/**
 * VIP Wall — browser storage helpers.
 * All reads/writes use localStorage only. Zero network calls.
 * Key names match the spec exactly so they are consistent across all components.
 */

const K = {
  unlocked:   'mft_unlocked',
  email:      'mft_email',
  wallStage:  'mft_wall_stage',
  viewsToday: 'mft_views_today',
  viewsDate:  'mft_views_date',
  viewedIds:  'mft_viewed_ids_today',
  copies:     'mft_copies_total',
  social:     'mft_social_shown',
} as const

function get(key: string): string {
  try { return localStorage.getItem(key) ?? '' } catch { return '' }
}

function put(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* private browsing */ }
}

const todayStr = () => new Date().toISOString().slice(0, 10)

function resetDailyIfNeeded() {
  if (get(K.viewsDate) !== todayStr()) {
    put(K.viewsDate, todayStr())
    put(K.viewsToday, '0')
    put(K.viewedIds, '')
  }
}

// ─── Unlock state ─────────────────────────────────────────────────────────────

export function isUnlocked(): boolean {
  return get(K.unlocked) === 'true'
}

export type WallStage = '' | 'returning' | 'unlocked'

export function getWallStage(): WallStage {
  const s = get(K.wallStage)
  if (s === 'returning' || s === 'unlocked') return s
  return ''
}

export function setWallStage(stage: WallStage) {
  put(K.wallStage, stage)
}

export function unlock(email: string) {
  put(K.unlocked, 'true')
  put(K.email, email)
  put(K.wallStage, 'unlocked')
}

// ─── Daily view counter ───────────────────────────────────────────────────────

/**
 * Try to grant a free view for cardId.
 *   true  → show content (no wall needed); increments counter if first view today.
 *   false → fire the wall.
 */
export function tryViewTip(cardId: string): boolean {
  if (isUnlocked()) return true
  resetDailyIfNeeded()
  const ids = get(K.viewedIds).split(',').filter(Boolean)
  if (ids.includes(cardId)) return true   // already counted today
  const n = parseInt(get(K.viewsToday) || '0', 10)
  if (n < 2) {
    put(K.viewsToday, String(n + 1))
    put(K.viewedIds, [...ids, cardId].join(','))
    return true
  }
  return false
}

/** Has this card already been granted a free view today (or is the user unlocked)? */
export function hasViewedTip(cardId: string): boolean {
  if (isUnlocked()) return true
  resetDailyIfNeeded()
  return get(K.viewedIds).split(',').filter(Boolean).includes(cardId)
}

// ─── Copy counter ─────────────────────────────────────────────────────────────

export function incrementCopies(): number {
  const n = parseInt(get(K.copies) || '0', 10) + 1
  put(K.copies, String(n))
  return n
}

export function getCopyCount(): number {
  return parseInt(get(K.copies) || '0', 10)
}

// ─── Social shown tracking ────────────────────────────────────────────────────

export function getSocialShown(): string[] {
  return get(K.social).split(',').filter(Boolean)
}

export function markSocialShown(platform: string) {
  const shown = getSocialShown()
  if (!shown.includes(platform)) {
    put(K.social, [...shown, platform].join(','))
  }
}
