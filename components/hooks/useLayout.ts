"use client"

import { useMemo } from 'react'
import { useSidebar } from '../SidebarContext'
import { useRoute } from '../RouteContext'
import { usePathname, useParams } from 'next/navigation'
import { 
  getMainContentClasses, 
  getTopNavClasses, 
  getSidePanelLeft,
  getSidePanelWidthClass,
  type SidePanelWidth 
} from '@/lib/utils/layout'
import { getRouteById } from '@/lib/routes'

interface UseLayoutOptions {
  isSearchMode?: boolean
  showSidePanel?: boolean
  sidePanelWidth?: SidePanelWidth
}

export function useLayout(options: UseLayoutOptions = {}) {
  const { sidebarOpen } = useSidebar()
  const { selectedRoute } = useRoute()
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
    // Always hide panel in search mode
    if (isSearchMode) return 'none'
    
    // If panel is disabled, return none
    if (!showSidePanel) return 'none'
    
    // For routes pages with 'routes' width
    if (isRoutesPage && sidePanelWidth === 'routes') {
      // Maps page exception: show route panel as an overlay (do NOT shrink map/main)
      return 'none'
    }
    
    // For fixed panels (default), only show on pages that actually have a panel
    if (sidePanelWidth === 'default') {
      const supportsDefaultPanel =
        pathname === '/' || pathname === '/contents' || pathname?.startsWith('/contents')
      return sidebarOpen && supportsDefaultPanel ? 'default' : 'none'
    }
    
    return sidePanelWidth
  }, [isSearchMode, showSidePanel, sidePanelWidth, isRoutesPage, hasRoute, sidebarOpen, pathname])

  // Determine side panel type
  const sidePanelType = useMemo(() => {
    if (isSearchMode) return null
    
    // For routes pages
    if (isRoutesPage && sidePanelWidth === 'routes' && hasRoute) {
      return 'route'
    }
    
    // For fixed panels
    if (sidePanelWidth === 'default' && sidebarOpen) {
      if (pathname === '/') return 'home'
      if (pathname === '/contents' || pathname?.startsWith('/contents')) return 'contents'
    }
    
    return null
  }, [isSearchMode, isRoutesPage, sidePanelWidth, hasRoute, sidebarOpen, pathname])

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
    !isSearchMode &&
    sidePanelType !== null &&
    (sidePanelType !== 'route' ? effectiveSidePanelWidth !== 'none' : true)

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
