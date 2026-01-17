"use client"

import { useMemo } from 'react'
import PageLayout from '@/components/PageLayout'
import { getAllRoutes } from '@/lib/routes'
import { useRoute } from '@/components/RouteContext'
import { useSearchResult } from '@/components/SearchContext'
import { useCart } from '@/components/CartContext'
import { useSidebar } from '@/components/SidebarContext'
import { useLayout } from '@/components/hooks/useLayout'
import { LAYOUT_CONSTANTS } from '@/lib/utils/layout'
import TMap from '@/components/TMap'
import { getAllPOIs, getPOIById, getKContentsBySubName } from '@/lib/data'

export default function MapsPage() {
  const allRoutes = getAllRoutes()
  const { selectedRoute, setSelectedRoute } = useRoute()
  const { searchResult, showRoute: contextShowRoute } = useSearchResult()
  const { cartItems } = useCart()
  const { sidebarOpen } = useSidebar()
  const layout = useLayout({ showSidePanel: true, sidePanelWidth: 'routes' })
  const allPOIs = getAllPOIs()

  // Automatically show route when cart has 2+ POIs and no search result
  const poiCartItems = cartItems.filter(item => item.type === 'poi')
  const showRoute = !searchResult && poiCartItems.length >= 2 ? true : contextShowRoute

  // Calculate cart container position to center it in map area
  // If side panel exists, align from side panel's right edge
  // Map area = full width - sidebar width - side panel width
  const bottomCartPosition = useMemo(() => {
    // Calculate sidebar width
    const sidebarWidth = sidebarOpen 
      ? LAYOUT_CONSTANTS.SIDEBAR_OPEN_WIDTH 
      : LAYOUT_CONSTANTS.SIDEBAR_CLOSED_WIDTH
    
    // Calculate side panel width (if visible)
    const hasSidePanel = layout.sidePanelType === 'search' || layout.sidePanelType === 'route'
    const sidePanelWidth = hasSidePanel ? LAYOUT_CONSTANTS.SIDE_PANEL_ROUTES_WIDTH : '0px'
    
    // Calculate left position
    // If side panel exists, start after sidebar + side panel
    // Otherwise, start after sidebar only
    const left = hasSidePanel
      ? `calc(${sidebarWidth} + ${sidePanelWidth})`
      : sidebarWidth
    
    // Calculate width of map area (full width - sidebar - side panel)
    // Use calc() to properly handle percentage and fixed units
    const width = hasSidePanel
      ? `calc(100% - ${sidebarWidth} - ${sidePanelWidth})`
      : `calc(100% - ${sidebarWidth})`
    
    return { left, width }
  }, [sidebarOpen, layout.sidePanelType])

  // Get POIs to display based on search result or cart
  const displayPOIs = useMemo(() => {
    // If there's a search result, prioritize it
    if (searchResult) {
      if (searchResult.type === 'poi' && searchResult.poiId) {
        // POI search: show only the searched POI
        const poi = getPOIById(searchResult.poiId)
        return poi ? [poi] : []
      }

      if (searchResult.type === 'content' && searchResult.subName) {
        // Content search: show POIs related to the content
        const contents = getKContentsBySubName(searchResult.subName)
        const poiIds = new Set(contents.map(c => c.poiId.$oid))
        return allPOIs.filter(poi => poiIds.has(poi._id.$oid))
      }
    }

    // No search result: show only cart POIs
    const poiCartItems = cartItems.filter(item => item.type === 'poi')
    if (poiCartItems.length === 0) {
      // No cart items: show no markers
      return []
    }

    // Show only POIs in cart
    const cartPoiIds = new Set(poiCartItems.map(item => item.poiId).filter((id): id is string => !!id))
    return allPOIs.filter(poi => cartPoiIds.has(poi._id.$oid))
  }, [searchResult, cartItems, allPOIs])

  // Calculate map center: prioritize search result POI, then selected route, then default
  const mapCenter = useMemo(() => {
    // If searching for a POI, center on that POI
    if (searchResult?.type === 'poi' && searchResult.poiId) {
      const poi = getPOIById(searchResult.poiId)
      if (poi?.location?.coordinates && poi.location.coordinates.length >= 2) {
        return poi.location.coordinates as [number, number]
      }
    }

    // If searching for content, center on first related POI
    if (searchResult?.type === 'content' && searchResult.subName) {
      const contents = getKContentsBySubName(searchResult.subName)
      if (contents.length > 0) {
        const firstPoi = getPOIById(contents[0].poiId.$oid)
        if (firstPoi?.location?.coordinates && firstPoi.location.coordinates.length >= 2) {
          return firstPoi.location.coordinates as [number, number]
        }
      }
    }

    // Use selected route center if available
    if (selectedRoute?.mapData?.center) {
      return selectedRoute.mapData.center
    }
    if (allRoutes.length > 0 && allRoutes[0].mapData?.center) {
      return allRoutes[0].mapData.center
    }
    // Default to Seoul center
    return [127.0276, 37.4980]
  }, [searchResult, selectedRoute, allRoutes])

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
        const poi = getPOIById(item.poiId)
        return poi ? { poi, order: cartOrderMap.get(item.poiId) || 0 } : null
      })
      .filter((item): item is { poi: NonNullable<ReturnType<typeof getPOIById>>; order: number } => item !== null)
      .sort((a, b) => a.order - b.order)
  }, [cartItems, cartOrderMap, allPOIs])

  return (
    <PageLayout showSidePanel={true} sidePanelWidth="routes">
      {/* Map-only exception: map is a fixed background layer; sidebar/sidepanel overlay on top. */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <TMap center={mapCenter} zoom={mapZoom} pois={displayPOIs} cartOrderMap={cartOrderMap} hasSearchResult={!!searchResult} showRoute={showRoute} />

        {/* Bottom POI List - always show when cart has items (even when search result is shown) */}
        {/* Cart should only appear in map area, centered horizontally */}
        {orderedCartPOIs.length > 0 && (
          <div 
            className="fixed bottom-6 z-10 flex justify-center items-center pointer-events-none"
            style={{ 
              left: bottomCartPosition.left,
              width: bottomCartPosition.width
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200/50 px-4 py-3 pointer-events-auto">
              <div className="flex gap-4 overflow-x-auto">
                {orderedCartPOIs.map(({ poi, order }) => (
                  <div
                    key={poi._id.$oid}
                    className="flex-shrink-0 flex items-center gap-3 rounded-lg p-3 min-w-[280px] transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      {order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{poi.name}</h3>
                      <p className="text-gray-600 text-xs line-clamp-2">{poi.address}</p>
                    </div>
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

