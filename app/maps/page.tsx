"use client"

import dynamic from 'next/dynamic'
import { useMemo, useState, useRef, useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import { getAllRoutes } from '@/lib/services/routes'
import { useRoute } from '@/components/providers/RouteContext'
import { useSearchResult } from '@/components/providers/SearchContext'
import { useCart } from '@/components/providers/CartContext'
import { useSidebar } from '@/components/providers/SidebarContext'
import { useLanguage } from '@/components/providers/LanguageContext'
import { getPOIName, getPOIAddress } from '@/lib/utils/locale'
import { useLayout } from '@/lib/hooks/useLayout'
import { LAYOUT_CONSTANTS } from '@/lib/utils/layout'
import { useKContentsBySubName } from '@/lib/hooks/useKContents'
import { usePOIs } from '@/lib/hooks/usePOIs'
import type { POIJson } from '@/types'

const NaverMap = dynamic(() => import('./_components/naverMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
})

export default function MapsPage() {
  const allRoutes = getAllRoutes()
  const { selectedRoute, setSelectedRoute } = useRoute()
  const { searchResult } = useSearchResult()
  const { language } = useLanguage()
  const { cartItems, removeFromCart } = useCart()
  const { sidebarOpen } = useSidebar()
  const layout = useLayout({ showSidePanel: true, sidePanelWidth: 'routes' })
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const { pois: allPOIs } = usePOIs()
  const poiById = useMemo(() => new Map(allPOIs.map((p) => [p._id.$oid, p])), [allPOIs])

  // Automatically show map route when cart has 2+ POIs
  // Map route should ALWAYS be shown when cart has 2+ POIs, regardless of search result
  const poiCartItems = cartItems.filter(item => item.type === 'poi')
  const showMapRoute = poiCartItems.length >= 2

  // Calculate cart container position to center it in map area
  // If side panel exists, align from side panel's right edge
  // Map area = full width - sidebar width - side panel width
  // Add 10% padding on both sides (10% of available map area width)
  // Cart should never overlap with side panel
  const bottomCartPosition = useMemo(() => {
    // Mobile: do NOT reserve sidebar/panel space; use full width with padding.
    // (Both Kakao/Naver map UIs treat panels as overlays on mobile.)
    if (!isDesktop) {
      return { left: '1rem', right: '1rem', maxWidth: '1200px' }
    }

    // Calculate sidebar width
    const sidebarWidth = sidebarOpen 
      ? LAYOUT_CONSTANTS.SIDEBAR_OPEN_WIDTH 
      : LAYOUT_CONSTANTS.SIDEBAR_CLOSED_WIDTH
    
    // Side panel is always reserved on desktop maps when layout.showSidePanel is true.
    const hasSidePanel = layout.showSidePanel
    const sidePanelWidth = hasSidePanel ? LAYOUT_CONSTANTS.SIDE_PANEL_ROUTES_WIDTH : '0px'
    
    // Calculate left position: start after sidebar + side panel, then add 10% padding
    // Available width = 100% - sidebar - side panel
    // Left = sidebar + sidePanel + 10% of available width
    const left = hasSidePanel
      ? `calc(${sidebarWidth} + ${sidePanelWidth} + (100% - ${sidebarWidth} - ${sidePanelWidth}) * 0.1)`
      : `calc(${sidebarWidth} + (100% - ${sidebarWidth}) * 0.1)`
    
    // Calculate right position: 10% padding from right edge (same as left padding)
    // Right = 10% of available width (same calculation as left)
    const right = hasSidePanel
      ? `calc((100% - ${sidebarWidth} - ${sidePanelWidth}) * 0.1)`
      : `calc((100% - ${sidebarWidth}) * 0.1)`
    
    // Max width to prevent unlimited expansion
    const maxWidth = '1200px'
    
    return { left, right, maxWidth }
  }, [isDesktop, sidebarOpen, layout.showSidePanel])

  // Map viewport should not sit under sidebar/panel on desktop.
  const mapViewportPosition = useMemo(() => {
    if (!isDesktop) return { left: '0px' }

    const sidebarWidth = sidebarOpen
      ? LAYOUT_CONSTANTS.SIDEBAR_OPEN_WIDTH
      : LAYOUT_CONSTANTS.SIDEBAR_CLOSED_WIDTH

    const sidePanelWidth = layout.showSidePanel ? LAYOUT_CONSTANTS.SIDE_PANEL_ROUTES_WIDTH : '0px'
    const left = layout.showSidePanel
      ? `calc(${sidebarWidth} + ${sidePanelWidth})`
      : `${sidebarWidth}`

    return { left }
  }, [isDesktop, sidebarOpen, layout.showSidePanel])

  // Get POIs to display based on search result or cart
  // ALWAYS include cart POIs for map route drawing - this is critical for polyline
  const displayPOIs = useMemo(() => {
    const poiCartItems = cartItems.filter(item => item.type === 'poi')
    const cartPoiIds = new Set(poiCartItems.map(item => item.poiId).filter((id): id is string => !!id))
    
    // Always get cart POIs first - they must be included for polyline drawing
    const cartPois = allPOIs.filter(poi => cartPoiIds.has(poi._id.$oid))
    
    // If there's a search result, show search result + cart POIs
    if (searchResult) {
      if (searchResult.type === 'poi' && searchResult.poiId) {
        // POI search: show searched POI + cart POIs
        const poi = poiById.get(searchResult.poiId)
        const searchPoi = poi ? [poi] : []
        // Combine and deduplicate - ensure cart POIs are always included
        const combined = [...searchPoi, ...cartPois]
        const uniquePois = Array.from(new Map(combined.map(poi => [poi._id.$oid, poi])).values())
        return uniquePois
      }

      if (searchResult.type === 'content' && searchResult.subName) {
        // Content search: show POIs related to the content + cart POIs
        // Note: This will be handled by useKContentsBySubName hook
        // For now, return cart POIs only
        return cartPois
      }
    }

    // No search result: show only cart POIs
    // This ensures cart POIs are always available for polyline drawing
    return cartPois
  }, [searchResult, cartItems, allPOIs, poiById])

  // Calculate map center: prioritize search result POI, then selected route, then default
  const mapCenter = useMemo(() => {
    // If searching for a POI, center on that POI
    if (searchResult?.type === 'poi' && searchResult.poiId) {
      const poi = poiById.get(searchResult.poiId)
      if (poi?.location?.coordinates && poi.location.coordinates.length >= 2) {
        return poi.location.coordinates as [number, number]
      }
    }

    // If searching for content, center on first related POI
    // Note: This requires async data fetching, handled separately
    // For now, use default center

    // Use selected route center if available
    if (selectedRoute?.mapData?.center) {
      return selectedRoute.mapData.center
    }
    if (allRoutes.length > 0 && allRoutes[0].mapData?.center) {
      return allRoutes[0].mapData.center
    }
    // Default to Seoul center
    return [127.0276, 37.4980]
  }, [searchResult, selectedRoute, allRoutes, poiById])

  // Calculate map zoom: use higher zoom for search results
  const mapZoom = useMemo(() => {
    // If searching, use higher zoom level
    if (searchResult) {
      return 16
    }
    // Use selected route zoom if available
    if (selectedRoute?.mapData?.zoom) {
      return selectedRoute.mapData.zoom
    }
    return 13
  }, [searchResult, selectedRoute])

  // Create cart order map for markers
  const cartOrderMap = useMemo(() => {
    const poiCartItems = cartItems.filter(item => item.type === 'poi')
    const orderMap = new Map<string, number>()
    poiCartItems.forEach((item, index) => {
      if (item.poiId) {
        orderMap.set(item.poiId, index + 1)
      }
    })
    return orderMap
  }, [cartItems])

  // Get ordered POIs for bottom list (always show when cart has items)
  const orderedCartPOIs = useMemo(() => {
    const poiCartItems = cartItems.filter(item => item.type === 'poi')
    if (poiCartItems.length === 0) return []
    
    return poiCartItems
      .map(item => {
        if (!item.poiId) return null
        const poi = poiById.get(item.poiId)
        return poi ? { 
          poi, 
          order: cartOrderMap.get(item.poiId) || 0,
          cartItemId: item.id // Include cart item ID for deletion
        } : null
      })
      .filter((item): item is { poi: POIJson; order: number; cartItemId: string } => item !== null)
      .sort((a, b) => a.order - b.order)
  }, [cartItems, cartOrderMap, poiById])

  // Cart scroll functionality
  const cartScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [cartOverflows, setCartOverflows] = useState(false)

  useEffect(() => {
    const scrollElement = cartScrollRef.current
    if (!scrollElement) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollElement
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      setCartOverflows(scrollWidth > clientWidth + 1)
    }

    handleScroll()
    if (scrollElement.scrollWidth <= scrollElement.clientWidth) {
      scrollElement.scrollLeft = 0
    }

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [orderedCartPOIs])

  const scrollCart = (direction: 'left' | 'right') => {
    if (!cartScrollRef.current) return
    const scrollAmount = 300
    const currentScroll = cartScrollRef.current.scrollLeft
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount
    cartScrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' })
  }

  const shouldWrapCartRail = orderedCartPOIs.length <= 2 && !cartOverflows

  return (
    <PageLayout showSidePanel={true} sidePanelWidth="routes">
      {/* Desktop: reserve sidebar + side panel space for map viewport. */}
      <div className="fixed inset-0 z-0 overflow-hidden" style={{ left: mapViewportPosition.left }}>
        <NaverMap center={mapCenter} zoom={mapZoom} pois={displayPOIs} cartOrderMap={cartOrderMap} hasSearchResult={!!searchResult} showMapRoute={showMapRoute} />

        {/* Bottom POI List - always show when cart has items (even when search result is shown) */}
        {/* Cart should only appear in map area, centered horizontally, never overlap with side panel */}
        {orderedCartPOIs.length > 0 && (
          <div 
            className="fixed bottom-20 lg:bottom-6 z-10 flex justify-center items-center pointer-events-none"
            style={{ 
              left: bottomCartPosition.left,
              right: bottomCartPosition.right,
              maxWidth: bottomCartPosition.maxWidth,
              margin: '0 auto'
            }}
          >
            <div className="pointer-events-auto w-full flex justify-center">
              {/* Clean rail (simple + consistent, like major map UIs) */}
              <div
                className={`relative rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 shadow-lg overflow-hidden ${
                  shouldWrapCartRail ? 'w-fit max-w-full' : 'w-full'
                }`}
              >

              {/* Left scroll button */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollCart('left')}
                  className="focus-ring absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-md border border-gray-200/70 dark:border-gray-700/70 transition-colors"
                  aria-label="Scroll left"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Right scroll button */}
              {canScrollRight && (
                <button
                  onClick={() => scrollCart('right')}
                  className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-md border border-gray-200/70 dark:border-gray-700/70 transition-colors"
                  aria-label="Scroll right"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              <div 
                ref={cartScrollRef}
                className={`flex items-stretch gap-2 scrollbar-hide snap-x snap-proximity scroll-px-3 pl-3 pr-3 py-2 ${
                  shouldWrapCartRail ? 'w-fit overflow-x-hidden' : 'w-full overflow-x-auto'
                }`}
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  justifyContent: 'flex-start',
                }}
              >
                {orderedCartPOIs.map(({ poi, order, cartItemId }, index) => (
                  <div key={poi._id.$oid} className="flex items-stretch gap-3 flex-shrink-0 snap-start">
                    {/* Simple card (fixed height to prevent "crooked" rows) */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200/80 dark:border-gray-700/70 px-3 py-3 w-[280px] h-[84px] shadow-sm">
                      <div className="flex items-start gap-3 h-full">
                        {/* Order badge */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center font-bold text-xs">
                          {order}
                        </div>

                        <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug truncate">
                              {getPOIName(poi, language)}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeFromCart(cartItemId)}
                              className="focus-ring -mt-1 -mr-1 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              aria-label="Remove from cart"
                              title="Remove"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          <p className="text-gray-600 dark:text-gray-400 text-xs leading-snug line-clamp-2">
                            {getPOIAddress(poi, language)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow connector - show between items, not after last item */}
                    {index < orderedCartPOIs.length - 1 && (
                      <div className="flex-shrink-0 flex items-center self-center">
                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

