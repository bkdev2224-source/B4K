"use client"

import { SidePanelContent } from './SidePanelContent'
import { Route } from '@/lib/services/routes'
import { getSidePanelLeft, getSidePanelWidthClass } from '@/lib/utils/layout'

interface SidePanelProps {
  type: 'home' | 'contents' | 'route' | 'search' | null
  route?: Route | null
  routeId?: string | null
  visible?: boolean
  sidebarOpen?: boolean
}

export default function SidePanel({ 
  type, 
  route, 
  routeId, 
  visible = true,
  sidebarOpen = false 
}: SidePanelProps) {
  if (!visible || !type) {
    return null
  }

  const panelLeft = getSidePanelLeft(sidebarOpen)
  const panelWidth = getSidePanelWidthClass(type)

  return (
    <div 
      className={`${panelWidth} bg-white border-r border-gray-200 h-screen fixed z-30 transition-all duration-300 lg:block hidden ${
        type === 'route' || type === 'search' ? 'overflow-y-auto' : ''
      }`}
      style={{ left: panelLeft }}
    >
      <SidePanelContent type={type} route={route} routeId={routeId} />
    </div>
  )
}
