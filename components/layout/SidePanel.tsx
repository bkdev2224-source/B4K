"use client"

import { SidePanelContent } from './SidePanelContent'
import { useRouter } from 'next/navigation'
import { Route } from '@/lib/services/routes'
import { useRoute } from '@/components/providers/RouteContext'
import { useSearchResult } from '@/components/providers/SearchContext'
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
  const router = useRouter()
  const { setSelectedRoute } = useRoute()
  const { setSearchResult } = useSearchResult()

  if (!visible || !type) {
    return null
  }

  const panelLeft = getSidePanelLeft(sidebarOpen)
  const panelWidth = getSidePanelWidthClass(type)

  const closeMobileSheet = () => {
    if (type === 'search') {
      setSearchResult(null)
      return
    }
    if (type === 'route') {
      // If route is coming from URL, navigate back to /maps; otherwise clear selectedRoute.
      if (routeId) {
        router.push('/maps')
      } else {
        setSelectedRoute(null)
      }
    }
  }

  return (
    <>
      {/* Mobile: show route/search as a bottom sheet (Kakao/Naver style). */}
      {(type === 'route' || type === 'search') && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={closeMobileSheet}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-hidden rounded-t-2xl bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="max-h-[calc(75vh-20px)] overflow-y-auto">
              <SidePanelContent type={type} route={route} routeId={routeId} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop: fixed side panel */}
      <div
        className={`${panelWidth} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed z-30 transition-all duration-300 lg:block hidden ${
          type === 'route' || type === 'search' ? 'overflow-y-auto' : ''
        }`}
        style={{ left: panelLeft }}
      >
        <SidePanelContent type={type} route={route} routeId={routeId} />
      </div>
    </>
  )
}

