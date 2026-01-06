"use client"

import { useMemo } from 'react'
import PageLayout from '@/components/PageLayout'
import { getAllRoutes } from '@/lib/routes'
import { useRoute } from '@/components/RouteContext'
import TMap from '@/components/TMap'

export default function MapsPage() {
  const allRoutes = getAllRoutes()
  const { selectedRoute } = useRoute()

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
      <div className="h-[calc(100vh-4rem)] w-full bg-gray-100 relative">
        <TMap
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
    </PageLayout>
  )
}

