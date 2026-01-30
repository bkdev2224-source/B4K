/**
 * Layout calculation utilities
 * Centralized functions for calculating layout dimensions and classes
 */

// Layout constants
export const LAYOUT_CONSTANTS = {
  SIDEBAR_OPEN_WIDTH: '12.75%',
  SIDEBAR_CLOSED_WIDTH: '80px',
  SIDE_PANEL_DEFAULT_WIDTH: '14.4rem', // 16rem * 0.9 (10% 감소)
  SIDE_PANEL_ROUTES_WIDTH: '24rem', // 원래 크기 유지
} as const

export type SidePanelWidth = 'default' | 'routes' | 'none'

export interface LayoutConfig {
  sidebarOpen: boolean
  sidePanelWidth: SidePanelWidth
}

/**
 * Calculate main content margin-left and width classes
 */
export function getMainContentClasses(config: LayoutConfig): string {
  const { sidebarOpen, sidePanelWidth } = config

  // No side panel: only account for sidebar
  if (sidePanelWidth === 'none') {
    if (sidebarOpen) {
      return 'lg:ml-[12.75%] lg:w-[calc(100%-12.75%)]'
    } else {
      return 'lg:ml-[80px] lg:w-[calc(100%-80px)]'
    }
  }

  // Routes panel (24rem = 384px)
  if (sidePanelWidth === 'routes') {
    if (sidebarOpen) {
      // Sidebar open (12.75%) + Routes panel (24rem)
      return 'lg:ml-[calc(12.75%+24rem)] lg:w-[calc(100%-12.75%-24rem)]'
    } else {
      // Sidebar closed (80px) + Routes panel (24rem)
      return 'lg:ml-[calc(80px+24rem)] lg:w-[calc(100%-80px-24rem)]'
    }
  }

  // Default panel (14.4rem = 230.4px) - always shown regardless of sidebar state
  if (sidebarOpen) {
    // Sidebar open (12.75%) + Default panel (14.4rem)
    return 'lg:ml-[calc(12.75%+14.4rem)] lg:w-[calc(100%-12.75%-14.4rem)]'
  } else {
    // Sidebar closed: Default panel still shown
    return 'lg:ml-[calc(80px+14.4rem)] lg:w-[calc(100%-80px-14.4rem)]'
  }
}

/**
 * Calculate TopNav position classes
 */
export function getTopNavClasses(config: LayoutConfig): string {
  const { sidebarOpen, sidePanelWidth } = config

  // No side panel: only account for sidebar
  if (sidePanelWidth === 'none') {
    if (sidebarOpen) {
      return 'lg:left-[12.75%] lg:right-0'
    } else {
      return 'lg:left-[80px] lg:right-0'
    }
  }

  // Routes panel (24rem)
  if (sidePanelWidth === 'routes') {
    if (sidebarOpen) {
      return 'lg:left-[calc(12.75%+24rem)] lg:right-0'
    } else {
      return 'lg:left-[calc(80px+24rem)] lg:right-0'
    }
  }

  // Default panel (14.4rem) - always shown regardless of sidebar state
  if (sidebarOpen) {
    return 'lg:left-[calc(12.75%+14.4rem)] lg:right-0'
  } else {
    return 'lg:left-[calc(80px+14.4rem)] lg:right-0'
  }
}

/**
 * Calculate SidePanel position (left offset)
 */
export function getSidePanelLeft(sidebarOpen: boolean): string {
  return sidebarOpen 
    ? `calc(${LAYOUT_CONSTANTS.SIDEBAR_OPEN_WIDTH} + 1px)` 
    : `calc(${LAYOUT_CONSTANTS.SIDEBAR_CLOSED_WIDTH} + 1px)`
}

/**
 * Get SidePanel width class based on type
 */
export function getSidePanelWidthClass(
  type: 'home' | 'contents' | 'info' | 'route' | 'search' | null
): string {
  // Routes panel and search: original size, Default panel (home/contents/info): 10% reduction
  return type === 'route' || type === 'search' ? 'w-96' : 'w-[14.4rem]'
}
