"use client"

import { useEffect, useRef, useState } from 'react'

interface TMapProps {
  center: number[] // [longitude, latitude]
  zoom?: number
}

declare global {
  interface Window {
    Tmapv3: {
      Map: new (element: HTMLElement | string, options: {
        center: any
        width: string
        height: string
        zoom: number
      }) => any
      LatLng: new (lat: number, lng: number) => any
    }
  }
}

export default function TMap({ center, zoom = 16 }: TMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Wait until Tmapv3 is ready.
  // The Vector SDK script is loaded in `app/layout.tsx` <head> during initial HTML parse
  // to avoid `document.write` async-load errors.
  useEffect(() => {
    if (!isMounted) return
    setLoadError(null)

    let cancelled = false
    let attempts = 0
    const maxAttempts = 200 // 20s

    const tick = () => {
      if (cancelled) return

      if (window.Tmapv3?.Map && window.Tmapv3?.LatLng) {
        setIsReady(true)
        return
      }

      attempts += 1
      if (attempts >= maxAttempts) {
        setLoadError(
          'TMAP Vector SDK가 준비되지 않았습니다. `app/layout.tsx`에서 Vector SDK <script>가 head에 로드되는지(키 포함) 확인하세요.'
        )
        return
      }

      setTimeout(tick, 100)
    }

    tick()
    return () => {
      cancelled = true
    }
  }, [isMounted])

  // Initialize map - equivalent to initTmap() function
  // Only runs after script is fully loaded and Tmapv3 is ready
  useEffect(() => {
    if (!isReady || !isMounted || !mapRef.current) return

    // Double check Tmapv3 is available
    if (!window.Tmapv3 || !window.Tmapv3.Map || !window.Tmapv3.LatLng) {
      console.error('Tmapv3 is not available when trying to initialize map')
      return
    }

    // Clean up existing map instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.destroy()
      } catch (error) {
        // Ignore errors during cleanup
      }
      mapInstanceRef.current = null
    }

    try {
      // Create map instance - following the HTML sample exactly
      // center prop is [longitude, latitude], but Tmapv3.LatLng expects (latitude, longitude)
      const [lng, lat] = center
      const map = new window.Tmapv3.Map(mapRef.current, {
        center: new window.Tmapv3.LatLng(lat, lng),
        width: "100%",
        height: "100%",
        zoom: zoom
      })

      mapInstanceRef.current = map
      console.log('TMAP map initialized successfully')
    } catch (error) {
      console.error('Error initializing TMAP Vector Map:', error)
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy()
        } catch (error) {
          // Ignore errors
        }
        mapInstanceRef.current = null
      }
    }
  }, [isReady, isMounted, center, zoom])

  // Update map center when center prop changes
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current || !window.Tmapv3) return

    try {
      const [lng, lat] = center
      mapInstanceRef.current.setCenter(new window.Tmapv3.LatLng(lat, lng))
    } catch (error) {
      console.error('Error updating map center:', error)
    }
  }, [center, isReady])

  // Update zoom when zoom prop changes
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return

    try {
      mapInstanceRef.current.setZoom(zoom)
    } catch (error) {
      console.error('Error updating map zoom:', error)
    }
  }, [zoom, isReady])

  // Don't render until mounted (prevents hydration mismatch)
  if (!isMounted || (!isReady && !loadError)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 px-6">
          <p className="font-semibold">TMAP 스크립트 로드 실패</p>
          <p className="text-sm mt-2">{loadError}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapRef} 
      id="map_div"
      style={{ width: '100%', height: '100%', minHeight: '400px' }} 
    />
  )
}
