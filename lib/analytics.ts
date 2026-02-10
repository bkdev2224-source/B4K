/**
 * Analytics utility layer for GA4
 *
 * This module provides type-safe analytics functions for tracking
 * page views and custom events in Google Analytics 4.
 */

import { getStoredConsent } from '@/lib/consent'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

const REQUIRE_ANALYTICS_CONSENT =
  process.env.NEXT_PUBLIC_REQUIRE_ANALYTICS_CONSENT === 'true'

function hasAnalyticsConsent(): boolean {
  if (!REQUIRE_ANALYTICS_CONSENT) return true
  return getStoredConsent() === 'granted'
}

/**
 * Track a page view
 * Use this for manual page tracking in App Router client-side navigation
 */
export const pageview = (path: string) => {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_GA_ID) return
  if (!hasAnalyticsConsent()) return
  
  window.gtag?.('config', process.env.NEXT_PUBLIC_GA_ID, {
    page_path: path,
  })
}

/**
 * Track a custom event
 * 
 * PRE-MVP Event Contract (locked):
 * - search_performed: { keyword: string }
 * - poi_viewed: { poi_id: string, category?: string }
 * - select_item: { item_id: string, item_name?: string }
 * - favorite_created: { poi_id: string }
 * - folder_created: { folder_name?: string }
 * - language_changed: { language: string }
 * - map_opened: {}
 * - contact_form_submitted: {}
 */
export const trackEvent = (
  eventName: string,
  params: Record<string, any> = {}
) => {
  if (typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return
  
  window.gtag?.('event', eventName, params)
}

// ============================================
// PRE-MVP Event Helpers (Type-safe shortcuts)
// ============================================

export const analytics = {
  /** Track when user performs a search */
  searchPerformed: (keyword: string) => {
    trackEvent('search_performed', { keyword })
  },

  /** Track when user views a POI detail page */
  poiViewed: (poiId: string, category?: string) => {
    trackEvent('poi_viewed', { poi_id: poiId, category })
  },

  /** Track when user selects/clicks an item */
  selectItem: (itemId: string, itemName?: string) => {
    trackEvent('select_item', { item_id: itemId, item_name: itemName })
  },

  /** Track when user creates a favorite */
  favoriteCreated: (poiId: string) => {
    trackEvent('favorite_created', { poi_id: poiId })
  },

  /** Track when user creates a folder */
  folderCreated: (folderName?: string) => {
    trackEvent('folder_created', { folder_name: folderName })
  },

  /** Track when user changes language */
  languageChanged: (language: string) => {
    trackEvent('language_changed', { language })
  },

  /** Track when user opens the map */
  mapOpened: () => {
    trackEvent('map_opened')
  },

  /** Track when user submits contact form */
  contactFormSubmitted: () => {
    trackEvent('contact_form_submitted')
  },
}
