"use client"

import { useMemo } from 'react'
import { useSidebar } from '@/components/providers/SidebarContext'
import { useRoute } from '@/components/providers/RouteContext'
import { useSearchResult } from '@/components/providers/SearchContext'
import { usePathname, useParams } from 'next/navigation'
import { 
  getMainContentClasses, 
  getTopNavClasses, 
  getSidePanelLeft,
  getSidePanelWidthClass,
  type SidePanelWidth 
} from '@/lib/utils/layout'
import { getRouteById } from '@/lib/services/routes'

interface UseLayoutOptions {
  isSearchMode?: boolean
  showSidePanel?: boolean
  sidePanelWidth?: SidePanelWidth
}

export function useLayout(options: UseLayoutOptions = {}) {
  const { sidebarOpen } = useSidebar()
  const { selectedRoute } = useRoute()
  const { searchResult } = useSearchResult()
  const pathname = usePathname()
  const params = useParams()
  const { 
    isSearchMode = false, 
    showSidePanel = true,
    sidePanelWidth = 'default' 
  } = options

  // Determine route for side panel
  const isRoutesPage = pathname === '/maps' || pathname?.startsWith('/maps/route')
  const routeId = pathname?.startsWith('/maps/route/') ? params?.id as string : null
  const routeFromUrl = routeId ? getRouteById(routeId) : null
  const hasRoute = !!(selectedRoute || routeFromUrl)

  // Calculate effective side panel width
  const effectiveSidePanelWidth = useMemo((): SidePanelWidth => {
    // If panel is disabled, return none
    if (!showSidePanel) return 'none'
    
    // For search results on Maps page, use routes width
    if (isRoutesPage && searchResult) {
      return 'routes'
    }
    
    // For maps/routes pages with 'routes' width
    if (isRoutesPage && sidePanelWidth === 'routes') {
      return 'routes'
    }
    
    // For fixed panels (default), always show on non-maps pages (regardless of sidebar state)
    if (sidePanelWidth === 'default') {
      // Keep Maps full-width unless it's showing search results (handled above).
      if (isRoutesPage) return 'none'
      return 'default'
    }
    
    return sidePanelWidth
  }, [showSidePanel, sidePanelWidth, isRoutesPage, searchResult])

  // Determine side panel type
  const sidePanelType = useMemo((): 'home' | 'contents' | 'info' | 'nav' | 'maps' | 'route' | 'search' | 'settings' | 'package' | null => {
    // Search results:
    // - On /maps we keep the panel as "maps" so we can show list <-> detail in one UI.
    // - On /maps/route/* we use "search" bottom-sheet behavior.
    if (isRoutesPage && searchResult) {
      return pathname === '/maps' ? 'maps' : 'search'
    }
    
    // For routes pages
    if (isRoutesPage && sidePanelWidth === 'routes' && hasRoute) {
      return 'route'
    }

    // Maps default panel (recommended list)
    if (pathname === '/maps' && sidePanelWidth === 'routes') {
      return 'maps'
    }
    
    // For fixed panels (always show regardless of sidebar state)
    if (sidePanelWidth === 'default') {
      // Keep Maps free unless it's route/search (handled above).
      if (isRoutesPage) return null
      if (pathname === '/package' || pathname?.startsWith('/package/')) return 'package'
      if (pathname === '/mypage/settings' || pathname?.startsWith('/mypage/settings/')) return 'settings'
      if (pathname === '/cookie-settings') return 'settings'
      if (pathname === '/') return 'home'
      if (pathname === '/contents' || pathname?.startsWith('/contents')) return 'contents'
      if (pathname === '/info' || pathname?.startsWith('/info')) return 'info'
      if (pathname === '/privacy' || pathname === '/terms') return 'info'
      // Default fallback: show a simple navigation panel on all other pages.
      return 'nav'
    }
    
    return null
  }, [isRoutesPage, sidePanelWidth, hasRoute, pathname, searchResult])

  // Calculate main content classes
  const mainClasses = useMemo(() => {
    return getMainContentClasses({
      sidebarOpen,
      sidePanelWidth: effectiveSidePanelWidth,
    })
  }, [sidebarOpen, effectiveSidePanelWidth])

  // Calculate TopNav classes
  const topNavClasses = useMemo(() => {
    return getTopNavClasses({
      sidebarOpen,
      sidePanelWidth: effectiveSidePanelWidth,
    })
  }, [sidebarOpen, effectiveSidePanelWidth])

  // Side panel visibility (routes panel overlays on maps page even when effective width is 'none')
  const showSidePanelVisible =
    !!showSidePanel &&
    sidePanelType !== null &&
    (sidePanelType === 'route' || sidePanelType === 'search' ? true : effectiveSidePanelWidth !== 'none')

  // Get display route for side panel
  const displayRoute = selectedRoute || routeFromUrl || null

  return {
    sidebarOpen,
    effectiveSidePanelWidth,
    mainClasses,
    topNavClasses,
    showSidePanel: showSidePanelVisible,
    sidePanelType,
    sidePanelLeft: getSidePanelLeft(sidebarOpen),
    sidePanelWidthClass: getSidePanelWidthClass(sidePanelType),
    displayRoute,
    routeId,
  }
}
