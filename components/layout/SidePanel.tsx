"use client"

import { SidePanelContent } from './SidePanelContent'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Route } from '@/lib/services/routes'
import { useRoute } from '@/components/providers/RouteContext'
import { useSearchResult } from '@/components/providers/SearchContext'
import { getSidePanelLeft, getSidePanelWidthClass } from '@/lib/utils/layout'

interface SidePanelProps {
  type: 'home' | 'contents' | 'info' | 'nav' | 'maps' | 'route' | 'search' | 'settings' | 'package' | null
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
  const { searchResult, setSearchResult } = useSearchResult()

  const panelLeft = getSidePanelLeft(sidebarOpen)
  const panelWidth = type ? getSidePanelWidthClass(type) : ''

  // Mobile maps bottom-sheet (recommended + POI detail UI).
  // closed: fully hidden, half: 50%
  type MapsSnap = 'closed' | 'half'
  const [mapsSnap, setMapsSnap] = useState<MapsSnap>('half')
  const [viewportHeight, setViewportHeight] = useState<number>(() => {
    if (typeof window === 'undefined') return 800
    return window.innerHeight || 800
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragTranslateY, setDragTranslateY] = useState<number | null>(null)
  const dragRef = useRef<{ startY: number; startTranslateY: number; moved: boolean } | null>(null)
  const suppressNextHandleClickRef = useRef(false)

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight || 800)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Snap up automatically when a POI/search result is selected (marker tap, search, cart tap, etc.).
  useEffect(() => {
    if (type !== 'maps') return
    if (searchResult) {
      setMapsSnap('half')
      return
    }
    // When leaving detail view, keep current snap (user-controlled).
  }, [type, searchResult])

  // Mobile bottom offset (bottom nav removed; keep safe-area as padding instead).
  const mobileBottomOffset = useMemo(() => {
    return '0px'
  }, [])

  const SHEET_HANDLE_HEIGHT = 44
  const TOP_NAV_HEIGHT = 64 // 4rem (TopNav)
  const sheetFullHeight = Math.max(320, viewportHeight - TOP_NAV_HEIGHT)
  const sheetHalfHeight = Math.max(240, Math.round(sheetFullHeight * 0.5))

  const snapVisibleHeight = mapsSnap === 'closed' ? 0 : sheetHalfHeight
  const snapTranslateY = Math.max(0, sheetFullHeight - snapVisibleHeight)
  const currentTranslateY = isDragging && dragTranslateY !== null ? dragTranslateY : snapTranslateY

  const setSnap = useCallback((next: MapsSnap) => {
    setMapsSnap(next)
    setIsDragging(false)
    setDragTranslateY(null)
    dragRef.current = null
  }, [])

  const onHandlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      // Only enable dragging on touch / pen / mouse via pointer events.
      setIsDragging(true)
      dragRef.current = { startY: e.clientY, startTranslateY: snapTranslateY, moved: false }
      setDragTranslateY(snapTranslateY)
      try {
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    },
    [snapTranslateY]
  )

  const onHandlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragRef.current) return
    const delta = e.clientY - dragRef.current.startY
    if (Math.abs(delta) > 2) dragRef.current.moved = true
    const next = dragRef.current.startTranslateY + delta
    const min = 0
    const max = sheetFullHeight // closed
    setDragTranslateY(Math.min(max, Math.max(min, next)))
  }, [isDragging, sheetFullHeight])

  const onHandlePointerUp = useCallback(() => {
    if (!isDragging) return
    // Prevent a "click" from firing after a drag gesture.
    if (dragRef.current?.moved) {
      suppressNextHandleClickRef.current = true
      // If the browser doesn't emit a click (common for drag end),
      // ensure we don't suppress a future legitimate tap.
      window.setTimeout(() => {
        suppressNextHandleClickRef.current = false
      }, 0)
    } else {
      suppressNextHandleClickRef.current = false
    }
    const translate = dragTranslateY ?? snapTranslateY
    const visible = sheetFullHeight - translate
    const candidates: Array<{ snap: MapsSnap; height: number }> = [
      { snap: 'closed', height: 0 },
      { snap: 'half', height: sheetHalfHeight },
    ]
    let best = candidates[0]
    for (const c of candidates) {
      if (Math.abs(c.height - visible) < Math.abs(best.height - visible)) best = c
    }
    setSnap(best.snap)
  }, [dragTranslateY, isDragging, setSnap, sheetFullHeight, sheetHalfHeight, snapTranslateY])

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

      {/* Mobile: maps drawer (recommended + POI details) */}
      {type === 'maps' && (
        <div className="lg:hidden">
          {/* Invisible "grab zone" when fully closed (no UI visible). */}
          {mapsSnap === 'closed' && (
            <div
              className="fixed inset-x-0 bottom-0 z-50"
              style={{ height: '24px', touchAction: 'none' }}
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
              onClick={() => {
                if (suppressNextHandleClickRef.current) {
                  suppressNextHandleClickRef.current = false
                  return
                }
                setSnap('half')
              }}
              aria-label="Open map drawer"
              role="button"
              tabIndex={0}
            />
          )}

          <div
            className={[
              'fixed inset-x-0 z-50 rounded-t-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur border-t border-gray-200/80 dark:border-gray-800/80 shadow-2xl will-change-transform',
              mapsSnap === 'closed' ? 'pointer-events-none' : 'pointer-events-auto',
            ].join(' ')}
            style={{
              bottom: mobileBottomOffset,
              height: `${sheetFullHeight}px`,
              transform: `translateY(${currentTranslateY}px)`,
              transition: isDragging ? 'none' : 'transform 220ms ease',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            aria-label="Map details drawer"
          >
            {/* Handle / controls */}
            <div
              className="relative flex items-center justify-center px-3 pointer-events-auto"
              style={{ height: `${SHEET_HANDLE_HEIGHT}px`, touchAction: 'none' }}
              onPointerDown={onHandlePointerDown}
              onPointerMove={onHandlePointerMove}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
              onClick={() => {
                if (suppressNextHandleClickRef.current) {
                  suppressNextHandleClickRef.current = false
                  return
                }
                // Tap always closes, regardless of current state.
                setSnap('closed')
              }}
              role="presentation"
              aria-label="Drag to resize drawer"
            >
              <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Content */}
            <div style={{ height: `${sheetFullHeight - SHEET_HANDLE_HEIGHT}px` }} className="overflow-hidden">
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

