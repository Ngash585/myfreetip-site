// Facebook Pixel helper — typed wrapper around window.fbq
// Use these functions in components/pages instead of calling fbq() directly.

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

/** Fire a PageView event (called automatically on every route change via App.tsx). */
export function fbPageView() {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}

/**
 * Fire a standard Facebook event.
 *
 * Common event names:
 *   'ViewContent'   — user views a key piece of content (e.g. a tip card)
 *   'Search'        — user performs a search
 *   'Lead'          — user submits a contact form or sign-up
 *   'Contact'       — user initiates contact
 *   'Subscribe'     — user subscribes to a newsletter / notification
 *   'CompleteRegistration' — user completes a registration form
 *
 * @example fbEvent('ViewContent', { content_name: 'Man Utd vs Arsenal' })
 * @example fbEvent('Lead')
 */
export function fbEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
}

/**
 * Fire a custom event (for actions that don't map to a standard FB event).
 *
 * @example fbCustomEvent('BookingCodeCopied', { bookie: 'Bet365' })
 */
export function fbCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, params);
  }
}
