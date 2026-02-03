"use client"

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Route } from '@/lib/services/routes'
import { useSearchResult } from '@/components/providers/SearchContext'
import { useCart } from '@/components/providers/CartContext'
import { useKContentsBySubName, useKContentsByPOIId } from '@/lib/hooks/useKContents'
import { usePOIs } from '@/lib/hooks/usePOIs'
import type { POIJson } from '@/types'

interface SidePanelItem {
  id: string
  name: string
  href: string
  icon?: React.ReactNode
}

interface SidePanelContentProps {
  type: 'home' | 'contents' | 'info' | 'nav' | 'maps' | 'route' | 'search' | null
  route?: Route | null
  routeId?: string | null
}

export function SidePanelContent({ type, route, routeId }: SidePanelContentProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'reviews' | 'photos' | 'info'>('home')
  const { searchResult, setSearchResult } = useSearchResult()
  const { cartItems, addToCart, removeFromCart, isInCart } = useCart()
  const { pois, loading: poisLoading, error: poisError } = usePOIs({ enabled: type === 'maps' || type === 'search' })
  const poiById = useMemo(() => new Map(pois.map((p) => [p._id.$oid, p])), [pois])

  // Hooks must be called unconditionally (rules-of-hooks)
  const searchSubName =
    searchResult?.type === 'content' && searchResult.subName ? searchResult.subName : ''
  const searchPoiId =
    searchResult?.type === 'poi' && searchResult.poiId ? searchResult.poiId : ''

  const { contents: contentsBySubName } = useKContentsBySubName(searchSubName)
  const { contents: contentsByPOIId } = useKContentsByPOIId(searchPoiId)

  // Home page section list
  const homeSections: SidePanelItem[] = [
    { id: 'best-packages', name: 'B4K Best Packages', href: '#best-packages' },
    { id: 'editor-recommendations', name: 'Editor Recommendations', href: '#editor-recommendations' },
    { id: 'seoul-exploration', name: 'Explore Seoul', href: '#seoul-exploration' },
    { id: 'seasonal-recommendations', name: 'Seasonal Travel', href: '#seasonal-recommendations' },
  ]

  // Contents categories
  const contentCategories: SidePanelItem[] = [
    { id: 'kpop', name: 'Kpop', href: '/contents#kpop' },
    { id: 'kbeauty', name: 'Kbeauty', href: '/contents#kbeauty' },
    { id: 'kfood', name: 'Kfood', href: '/contents#kfood' },
    { id: 'kfestival', name: 'Kfestival', href: '/contents#kfestival' },
  ]

  // Info page sections
  const infoSections: SidePanelItem[] = [
    { id: 'about', name: 'About Us', href: '/info' },
    { id: 'privacy', name: 'Privacy Policy', href: '/privacy' },
    { id: 'terms', name: 'Terms & Conditions', href: '/terms' },
  ]

  // Generic navigation (used as a fallback on pages like POI/Package/Profile)
  const navLinks: SidePanelItem[] = [
    { id: 'home', name: 'Home', href: '/' },
    { id: 'packages', name: 'Packages', href: '/package' },
    { id: 'maps', name: 'Map', href: '/maps' },
    { id: 'contents', name: 'Contents', href: '/contents' },
    { id: 'info', name: 'Info', href: '/info' },
    { id: 'mypage', name: 'Profile', href: '/mypage' },
  ]

  const formatEntryFee = (fee: string) => {
    const trimmed = (fee || '').trim()
    if (!trimmed) return '—'
    return trimmed
  }

  const isInPoiCart = (poiId: string) => isInCart(`poi-${poiId}`)

  const togglePoiCart = (poi: POIJson) => {
    const cartItemId = `poi-${poi._id.$oid}`
    if (isInCart(cartItemId)) {
      removeFromCart(cartItemId)
    } else {
      addToCart({
        id: cartItemId,
        name: poi.name,
        type: 'poi',
        poiId: poi._id.$oid,
      })
    }
  }

  const recommendedPois = useMemo(() => {
    if (type !== 'maps') return [] as POIJson[]
    // Deterministic "shuffle": sort by a stable hash of the id so we get variety
    // but don't flicker on every render.
    const hash = (s: string) => {
      let h = 0
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
      return h >>> 0
    }
    return [...pois].sort((a, b) => hash(a._id.$oid) - hash(b._id.$oid)).slice(0, 20)
  }, [type, pois])

  // Render route details
  if (type === 'route' && route) {
    return (
      <div className="flex flex-col h-full">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
          {routeId ? (
            <Link
              href="/maps"
              className="focus-ring p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <div className="w-9" />
          )}
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex-1 text-center px-4 truncate">
            {route.name}
          </h1>
          {routeId ? (
            <Link
              href="/maps"
              className="focus-ring p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          ) : (
            <div className="w-9" />
          )}
        </div>

        {/* Map Preview */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-800 flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{route.startLocation.name}</p>
            </div>
          </div>
        </div>

        {/* Route Header */}
        <div className="px-4 py-4 bg-white dark:bg-gray-900 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{route.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{route.description}</p>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>Blog Reviews {route.blogReviews}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4 flex gap-3 flex-shrink-0">
          <button type="button" className="focus-ring flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Depart
          </button>
          <button type="button" className="focus-ring flex-1 py-3 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Arrive
          </button>
        </div>

        {/* Functional Icons */}
        <div className="px-4 pb-4 flex gap-6 flex-shrink-0">
          <button type="button" className="focus-ring flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg px-2 py-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-xs">Save</span>
          </button>
          <button type="button" className="focus-ring flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg px-2 py-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Street View</span>
          </button>
          <button type="button" className="focus-ring flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg px-2 py-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-800 px-4 flex-shrink-0">
          <div className="flex gap-6">
            {(['home', 'reviews', 'photos', 'info'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`focus-ring py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="themed-scrollbar px-4 py-6 flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 text-sm">{route.startLocation.address}</p>
                  <button
                    type="button"
                    className="focus-ring text-gray-600 dark:text-gray-300 text-xs mt-1 flex items-center gap-1 rounded"
                    aria-label="Show more address details"
                  >
                    <span>More</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Directions/Transit */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    From {route.startLocation.name}, take {route.transportation.join(', ')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                    Distance: {route.distance} • Duration: {route.duration}
                  </p>
                  <button
                    type="button"
                    className="focus-ring text-gray-600 dark:text-gray-300 text-xs mt-1 flex items-center gap-1 rounded"
                    aria-label="Show more directions details"
                  >
                    <span>More</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Operating Hours */}
              {route.operatingHours && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100 text-sm">{route.operatingHours}</p>
                    <button
                      type="button"
                      className="focus-ring text-gray-600 dark:text-gray-300 text-xs mt-1 flex items-center gap-1 rounded"
                      aria-label="Show more operating hours details"
                    >
                      <span>More</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Phone Number */}
              {route.phoneNumber && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900 dark:text-gray-100 text-sm">{route.phoneNumber}</p>
                      <button
                        type="button"
                        className="focus-ring text-gray-700 dark:text-gray-300 text-xs font-medium rounded px-1"
                        aria-label="Copy phone number"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* More Information Button */}
              <button
                type="button"
                className="focus-ring w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mt-4"
              >
                More Information &gt;
              </button>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Reviews coming soon</p>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Photos coming soon</p>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Route Details</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium">Start:</span> {route.startLocation.name}</p>
                  <p><span className="font-medium">End:</span> {route.endLocation.name}</p>
                  <p><span className="font-medium">Distance:</span> {route.distance}</p>
                  <p><span className="font-medium">Duration:</span> {route.duration}</p>
                  <p><span className="font-medium">Difficulty:</span> {route.difficulty}</p>
                  <p><span className="font-medium">Transportation:</span> {route.transportation.join(', ')}</p>
                </div>
              </div>
              {route.waypoints && route.waypoints.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Waypoints</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {route.waypoints.map((waypoint, idx) => (
                      <li key={`${waypoint.name}-${idx}`}>{idx + 1}. {waypoint.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {route.category.map((cat, idx) => (
                    <span key={`${cat}-${idx}`} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render home sections
  if (type === 'home') {
    return (
      <div className="px-6 pb-6 pt-4 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">
          Sections
        </h3>
        <nav className="themed-scrollbar mt-4 flex-1 overflow-y-auto space-y-1">
          {homeSections.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="focus-ring flex items-start gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <span className="mt-0.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-sm font-medium flex-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    )
  }

  // Render contents categories
  if (type === 'contents') {
    return (
      <div className="px-6 pb-6 pt-4 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">
          Categories
        </h3>
        <nav className="themed-scrollbar mt-4 flex-1 overflow-y-auto space-y-1">
          {contentCategories.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="focus-ring flex items-start gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <span className="mt-0.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </span>
              <span className="text-sm font-medium flex-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    )
  }

  // Render info sections
  if (type === 'info') {
    return (
      <div className="px-6 pb-6 pt-4 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">
          Info
        </h3>
        <nav className="themed-scrollbar mt-4 flex-1 overflow-y-auto space-y-1">
          {infoSections.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="focus-ring flex items-start gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <span className="mt-0.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium flex-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    )
  }

  // Render generic navigation fallback
  if (type === 'nav') {
    return (
      <div className="px-6 pb-6 pt-4 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-gray-100">
          Navigation
        </h3>
        <nav className="themed-scrollbar mt-4 flex-1 overflow-y-auto space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="focus-ring flex items-start gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <span className="mt-0.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-sm font-medium flex-1">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    )
  }

  // Render search result
  if ((type === 'search' || type === 'maps') && searchResult) {
    const poi =
      searchResult.type === 'poi' && searchResult.poiId
        ? poiById.get(searchResult.poiId) ?? null
        : null
    
    const contents = searchResult.type === 'content' && searchResult.subName
      ? contentsBySubName
      : searchResult.type === 'poi' && searchResult.poiId
      ? contentsByPOIId
      : []
    
    // Check if cart has items
    const poiCartItems = cartItems.filter(item => item.type === 'poi')
    const hasCartItems = poiCartItems.length > 0

    return (
      <div className="flex flex-col h-full">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setSearchResult(null)
            }}
            className="focus-ring p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label={type === 'maps' ? "Back to list" : hasCartItems ? "Go Back" : "Close"}
          >
            {type === 'maps' || hasCartItems ? (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="themed-scrollbar flex-1 overflow-y-auto px-4 py-6">
          {poi && (() => {
            const cartItemId = `poi-${poi._id.$oid}`
            const inCart = isInCart(cartItemId)
            
            return (
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1">{poi.name}</h2>
                    {/* 장바구니 버튼 */}
                    <button
                      type="button"
                      onClick={() => {
                        if (inCart) {
                          removeFromCart(cartItemId)
                        } else {
                          addToCart({
                            id: cartItemId,
                            name: poi.name,
                            type: 'poi',
                            poiId: poi._id.$oid
                          })
                        }
                      }}
                      className={`focus-ring p-2 rounded-full transition-colors ${
                        inCart 
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      aria-label={inCart ? "Remove from Cart" : "Add to Cart"}
                      title={inCart ? "Remove from Cart" : "Add to Cart"}
                    >
                      <svg className={`w-5 h-5 transition-colors ${inCart ? 'text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-400'}`} fill={inCart ? "currentColor" : "none"} stroke={inCart ? "none" : "currentColor"} viewBox="0 0 24 24">
                        {inCart ? (
                          <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        )}
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{poi.address}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {poi.categoryTags.map((tag, idx) => (
                      <span key={`${tag}-${idx}`} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><span className="font-medium">Opening Hours:</span> {poi.openingHours}</p>
                    <p><span className="font-medium">Entry Fee:</span> {poi.entryFee}</p>
                    <p><span className="font-medium">Reservation Required:</span> {poi.needsReservation ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {contents.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Related Spots ({contents.length})</h3>
                    <div className="space-y-2">
                      {contents.slice(0, 5).map((content, idx) => (
                        <div key={`${content.poiId.$oid}-${content.spotName}-${idx}`} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">{content.spotName}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">{content.description}</p>
                          {content.tags && content.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {content.tags.slice(0, 3).map((tag, tagIdx) => (
                                <span key={tagIdx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href={`/poi/${poi._id.$oid}`}
                  className="focus-ring block w-full py-3 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center"
                >
                  View Full Details &gt;
                </Link>
              </div>
            )
          })()}

          {searchResult.type === 'content' && contents.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{searchResult.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{contents.length} spots found</p>
              </div>

              <div className="space-y-2">
                {contents.map((content, idx) => {
                  const contentPoi = poiById.get(content.poiId.$oid)
                  return (
                    <button
                      type="button"
                      key={`${content.poiId.$oid}-${content.spotName}-${idx}`}
                      onClick={() => {
                        if (contentPoi) {
                          // POI 검색 결과로 변경하여 상세 정보 표시
                          setSearchResult({
                            name: contentPoi.name,
                            type: 'poi',
                            poiId: contentPoi._id.$oid
                          })
                        }
                      }}
                      className="focus-ring w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">{content.spotName}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-2">{content.description}</p>
                      {contentPoi && (
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">📍 {contentPoi.name}</p>
                      )}
                      {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {content.tags.slice(0, 3).map((tag, tagIdx) => (
                            <span key={tagIdx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <Link
                href={`/contents/${searchResult.subName || ''}`}
                className="focus-ring block w-full py-3 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center"
              >
                View All Spots &gt;
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render maps panel (Naver-style: recommended list)
  if (type === 'maps') {
    const total = Math.min(pois.length, 20)

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">
                Smart Around
              </p>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                Recommended nearby
              </h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500 dark:text-gray-400">Recommended</span>
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="themed-scrollbar flex-1 overflow-y-auto">
          {poisError && (
            <div className="px-4 py-4 text-sm text-red-600 dark:text-red-400">
              Failed to load places: {poisError}
            </div>
          )}

          {poisLoading && recommendedPois.length === 0 && (
            <div className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
              Loading recommendations…
            </div>
          )}

          {!poisLoading && !poisError && recommendedPois.length === 0 && (
            <div className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
              No places to show yet.
            </div>
          )}

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recommendedPois.map((poi, idx) => {
              const inCart = isInPoiCart(poi._id.$oid)
              return (
                <div
                  key={poi._id.$oid}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setSearchResult({ name: poi.name, type: 'poi', poiId: poi._id.$oid })
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSearchResult({ name: poi.name, type: 'poi', poiId: poi._id.$oid })
                    }
                  }}
                  className="focus-ring w-full text-left px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex gap-3">
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${poi._id.$oid}/280/200`}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold">
                        {idx + 1}/{total}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {poi.name}
                            </p>
                            {poi.categoryTags?.[0] && (
                              <span className="text-[11px] text-gray-500 dark:text-gray-400 flex-shrink-0">
                                {poi.categoryTags[0]}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {poi.address}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                            <span>Fee: {formatEntryFee(poi.entryFee)}</span>
                            {poi.openingHours && <span>· {poi.openingHours}</span>}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePoiCart(poi)
                          }}
                          className={`focus-ring p-2 rounded-full transition-colors ${
                            inCart
                              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                          aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
                          title={inCart ? 'Remove from cart' : 'Add to cart'}
                        >
                          <svg
                            className="w-4 h-4"
                            fill={inCart ? 'currentColor' : 'none'}
                            stroke={inCart ? 'none' : 'currentColor'}
                            viewBox="0 0 24 24"
                          >
                            {inCart ? (
                              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return null
}

