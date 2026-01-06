"use client"

import { useMemo } from 'react'
import PageLayout from '@/components/PageLayout'
import { getAllRoutes } from '@/lib/routes'
import { useRoute } from '@/components/RouteContext'
import TMap from '@/components/TMap'

export default function MapsPage() {
  const allRoutes = getAllRoutes()
  const { selectedRoute, setSelectedRoute } = useRoute()

  // Calculate map center: use selected route center if available, otherwise use first route or default
  const mapCenter = useMemo(() => {
    if (selectedRoute?.mapData?.center) {
      return selectedRoute.mapData.center
    }
    if (allRoutes.length > 0 && allRoutes[0].mapData?.center) {
      return allRoutes[0].mapData.center
    }
    // Default to Seoul center
    return [127.0276, 37.4980]
  }, [selectedRoute, allRoutes])

  // Calculate map zoom: use selected route zoom if available
  const mapZoom = useMemo(() => {
    if (selectedRoute?.mapData?.zoom) {
      return selectedRoute.mapData.zoom
    }
    return 13
  }, [selectedRoute])

  return (
    <PageLayout showSidePanel={true} sidePanelWidth="routes">
      {/* Map-only exception: map is a fixed background layer; sidebar/sidepanel overlay on top. */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <TMap center={mapCenter} zoom={mapZoom} />

        {/* Map-only: Side panel overlay toggle button for testing */}
        <button
          type="button"
          onClick={() => {
            if (selectedRoute) {
              setSelectedRoute(null)
            } else {
              setSelectedRoute(allRoutes[0] ?? null)
            }
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-5 py-3 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-lg hover:bg-white transition-colors text-sm font-semibold"
          style={{ color: '#62256e' }}
        >
          사이드 패널 추가
        </button>
      </div>
    </PageLayout>
  )
}

