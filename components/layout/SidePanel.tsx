"use client"

import { SidePanelContent } from './SidePanelContent'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { Route } from '@/lib/services/routes'
import { useRoute } from '@/components/providers/RouteContext'
import { useSearchResult } from '@/components/providers/SearchContext'
import { getSidePanelLeft, getSidePanelWidthClass } from '@/lib/utils/layout'

interface SidePanelProps {
  type: 'home' | 'contents' | 'info' | 'nav' | 'maps' | 'route' | 'search' | null
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

  const panelLeft = getSidePanelLeft(sidebarOpen)
  const panelWidth = type ? getSidePanelWidthClass(type) : ''

  const closeMobileSheet = useCallback(() => {
    if (!type) return
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
  }, [type, routeId, router, setSearchResult, setSelectedRoute])

  // Close mobile sheet with Escape (keyboard accessibility).
  useEffect(() => {
    if (!(type === 'route' || type === 'search')) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileSheet()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [type, closeMobileSheet])

  if (!visible || !type) {
    return null
  }

  return (
    <>
      {/* Mobile: show route/search as a bottom sheet (Kakao/Naver style). */}
      {(type === 'route' || type === 'search') && (
        <div className="lg:hidden">
          <button
            type="button"
            onClick={closeMobileSheet}
            className="fixed inset-0 z-40 bg-black/40 border-0 p-0 cursor-pointer"
            aria-label="Close panel overlay"
          />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-hidden rounded-t-2xl bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl pb-[env(safe-area-inset-bottom)]">
            <div className="relative flex justify-center pt-3 pb-2">
              <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
              <button
                type="button"
                onClick={closeMobileSheet}
                className="focus-ring absolute right-3 top-2 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[calc(75vh-20px)] overflow-y-auto">
              <SidePanelContent type={type} route={route} routeId={routeId} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop: fixed side panel */}
      <div
        className={`${panelWidth} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed z-30 transition-[left,width] duration-300 lg:block hidden ${
          type === 'route' || type === 'search' ? 'overflow-y-auto' : ''
        }`}
        style={{ left: panelLeft }}
      >
        <SidePanelContent type={type} route={route} routeId={routeId} />
      </div>
    </>
  )
}

