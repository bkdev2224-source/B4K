/**
 * Analytics consent storage with optional 12-month expiry.
 * Single source of truth for get/set used by AnalyticsGate, cookie-settings,
 * privacy page, and lib/analytics.
 */

const CONSENT_STORAGE_KEY = 'b4k_analytics_consent'
const CONSENT_TIMESTAMP_KEY = 'b4k_analytics_consent_at'
const CONSENT_VALID_MS = 365 * 24 * 60 * 60 * 1000 // 12 months

export type ConsentState = 'unknown' | 'granted' | 'denied'

export function getStoredConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unknown'
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (v !== 'granted' && v !== 'denied') return 'unknown'
    const at = window.localStorage.getItem(CONSENT_TIMESTAMP_KEY)
    if (!at) return v // backward compat: no timestamp => still valid
    const ts = parseInt(at, 10)
    if (Number.isNaN(ts) || Date.now() - ts > CONSENT_VALID_MS) return 'unknown'
    return v
  } catch {
    return 'unknown'
  }
}

export function setStoredConsent(value: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value)
    window.localStorage.setItem(CONSENT_TIMESTAMP_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}
