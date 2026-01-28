"use client"

import { useMemo, useState, useRef, useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import { getAllRoutes } from '@/lib/services/routes'
import { useRoute } from '@/components/providers/RouteContext'
import { useSearchResult } from '@/components/providers/SearchContext'
import { useCart } from '@/components/providers/CartContext'
import { useSidebar } from '@/components/providers/SidebarContext'
import { useLayout } from '@/lib/hooks/useLayout'
import { LAYOUT_CONSTANTS } from '@/lib/utils/layout'
import TMap from './_components/TMap'
import { useKContentsBySubName } from '@/lib/hooks/useKContents'
import { usePOIs } from '@/lib/hooks/usePOIs'
import type { POIJson } from '@/types'

export default function MapsPage() {
  const allRoutes = getAllRoutes()
  const { selectedRoute, setSelectedRoute } = useRoute()
  const { searchResult } = useSearchResult()
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
    
    // Check if side panel is actually visible using layout.showSidePanel
    // This is the most accurate way to determine if side panel is shown
    const hasSidePanel = layout.showSidePanel && (layout.sidePanelType === 'search' || layout.sidePanelType === 'route')
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
  }, [isDesktop, sidebarOpen, layout.showSidePanel, layout.sidePanelType])

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

  const checkScrollButtons = () => {
    if (!cartScrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = cartScrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    checkScrollButtons()
    const scrollElement = cartScrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      
      // Center scroll position when items change (add/remove)
      // Only center if content is smaller than container
      const centerScroll = () => {
        if (scrollElement.scrollWidth <= scrollElement.clientWidth) {
          scrollElement.scrollLeft = 0
        } else {
          // If content is larger, try to center the scroll
          const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth
          scrollElement.scrollLeft = maxScroll / 2
        }
      }
      
      // Small delay to ensure DOM is updated
      setTimeout(centerScroll, 0)
      
      return () => {
        scrollElement.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
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

  return (
    <PageLayout showSidePanel={true} sidePanelWidth="routes">
      {/* Map-only exception: map is a fixed background layer; sidebar/sidepanel overlay on top. */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <TMap center={mapCenter} zoom={mapZoom} pois={displayPOIs} cartOrderMap={cartOrderMap} hasSearchResult={!!searchResult} showMapRoute={showMapRoute} />

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
            <div className="pointer-events-auto relative w-full flex justify-center" style={{ paddingLeft: canScrollLeft ? '3rem' : '1rem', paddingRight: canScrollRight ? '3rem' : '1rem' }}>
              {/* Left scroll button */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollCart('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200 transition-all"
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
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200 transition-all"
                  aria-label="Scroll right"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              <div 
                ref={cartScrollRef}
                className="flex items-center gap-3 overflow-x-auto scrollbar-hide w-full"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none',
                  justifyContent: 'center',
                  paddingLeft: '1rem',
                  paddingRight: '1rem'
                }}
                onScroll={checkScrollButtons}
              >
                <style jsx>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                {orderedCartPOIs.map(({ poi, order, cartItemId }, index) => (
                  <div key={poi._id.$oid} className="flex items-center gap-3 flex-shrink-0">
                    {/* Floating Box for each POI */}
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 p-3 min-w-[200px] max-w-[200px] transition-all hover:shadow-xl hover:scale-105">
                      {/* Delete button - top right */}
                      <button
                        onClick={() => removeFromCart(cartItemId)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all z-10"
                        aria-label="Remove from cart"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
                      {/* Order badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                          {order}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm truncate flex-1">{poi.name}</h3>
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2 ml-9">{poi.address}</p>
                    </div>
                    
                    {/* Arrow connector - show between items, not after last item */}
                    {index < orderedCartPOIs.length - 1 && (
                      <div className="flex-shrink-0 flex items-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

