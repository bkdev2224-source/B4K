"use client"

import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import SidePanel from './SidePanel'
import TopNav from './TopNav'
import { useSearch } from '@/lib/hooks/useSearch'
import { useLayout } from '@/lib/hooks/useLayout'

interface PageLayoutProps {
  children: ReactNode
  showSidePanel?: boolean
  sidePanelWidth?: 'default' | 'routes' | 'none'
  searchModeContent?: ReactNode
  className?: string
}

export default function PageLayout({
  children,
  showSidePanel = true,
  sidePanelWidth = 'default',
  searchModeContent,
  className = '',
}: PageLayoutProps) {
  const search = useSearch()
  
  // Use layout hook - it handles all calculations including route detection
  const layout = useLayout({
    isSearchMode: search.isSearchMode,
    showSidePanel,
    sidePanelWidth,
  })

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <SidePanel
        type={layout.sidePanelType}
        route={layout.displayRoute || undefined}
        routeId={layout.routeId || undefined}
        visible={layout.showSidePanel}
        sidebarOpen={layout.sidebarOpen}
      />
      <TopNav
        searchQuery={search.searchQuery}
        onSearchChange={search.handleSearchChange}
        onSearchFocus={search.handleSearchFocus}
        isSearchMode={search.isSearchMode}
        topNavClasses={layout.topNavClasses}
      />

      <main className={`pt-16 transition-all duration-300 overflow-x-hidden ${layout.mainClasses} ${className}`}>
        {children}
      </main>
    </div>
  )
}

