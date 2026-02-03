"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import type { POIJson as POI } from '@/types'
import { useSearchResult } from '@/components/providers/SearchContext'

interface NaverMapProps {
  center: number[] // [longitude, latitude]
  zoom?: number
  pois?: POI[]
  cartOrderMap?: Map<string, number> // POI ID -> cart order number
  hasSearchResult?: boolean // Whether there's an active search result
  showMapRoute?: boolean // Whether to show map route lines connecting cart items
}

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement | string, options?: {
          center?: any
          zoom?: number
        }) => any
        LatLng: new (lat: number, lng: number) => any
        Marker: new (options: {
          position: any
          map: any
          icon?: {
            url: string
            size?: any
            scaledSize?: any
            anchor?: any
          }
          title?: string
        }) => any
        Polyline: new (options: {
          path: any[]
          map: any
          strokeColor?: string
          strokeWeight?: number
          strokeOpacity?: number
        }) => any
        Size: new (width: number, height: number) => any
        Point: new (x: number, y: number) => any
        Event: {
          addListener: (target: any, event: string, handler: () => void) => void
          clearInstanceListeners: (target: any) => void
        }
        Service: {
          geocode: (options: {
            query: string
          }, callback: (status: number, response: any) => void) => void
          Status: {
            OK: number
            ERROR: number
          }
        }
      }
    }
  }
}

export default function NaverMap({ center, zoom = 16, pois = [], cartOrderMap = new Map(), hasSearchResult = false, showMapRoute = false }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylineRef = useRef<any>(null)
  const { setSearchResult } = useSearchResult()
  const [isReady, setIsReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const log = useCallback((...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') console.log(...args)
  }, [])
  const isUserInteractingRef = useRef(false) // 사용자가 지도를 직접 조작 중인지 추적
  const lastCenterRef = useRef<number[]>(center) // 마지막 center 값 추적
  const lastZoomRef = useRef<number>(zoom) // 마지막 zoom 값 추적
  const geocodedPoisRef = useRef<Map<string, { lat: number; lng: number }>>(new Map()) // Geocoding된 POI 좌표 캐시
  const geocodingInProgressRef = useRef<Set<string>>(new Set()) // Geocoding 진행 중인 POI ID 추적

  // Geocoding 함수: 주소를 좌표로 변환 (Naver Maps JavaScript SDK 사용)
  const geocodeAddress = useCallback(
    (address: string, poiId: string, poi: POI): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
        // 이미 Geocoding된 좌표가 있으면 캐시에서 반환
        const cached = geocodedPoisRef.current.get(poiId)
        if (cached) {
          resolve(cached)
          return
        }

        // 이미 Geocoding 진행 중이면 대기하지 않고 null 반환 (중복 요청 방지)
        if (geocodingInProgressRef.current.has(poiId)) {
          resolve(null)
          return
        }

        if (!window.naver?.maps?.Service) {
          console.error('[Geocoding] Naver Maps Service is not available')
          resolve(null)
          return
        }

        geocodingInProgressRef.current.add(poiId)
        log(`[Geocoding Request] POI: ${poi.name}, Address: ${address}`)

        // Naver Maps JavaScript SDK의 geocode 사용 (JSONP 방식, CORS 문제 없음)
        window.naver.maps.Service.geocode({ query: address }, function (status: number, response: any) {
          geocodingInProgressRef.current.delete(poiId)

          // 예제 코드에 따라 Status.ERROR 체크
          if (status === window.naver.maps.Service.Status.ERROR) {
            console.error(`[Geocoding Status Error] POI: ${poi.name}, Address: ${address}`)
            resolve(null)
            return
          }

          // 예제 코드에 따라 response.v2.meta.totalCount 확인
          if (!response.v2 || response.v2.meta.totalCount === 0) {
            console.warn(
              `[Geocoding No Results] POI: ${poi.name}, Address: ${address}, totalCount: ${response.v2?.meta?.totalCount || 0}`
            )
            resolve(null)
            return
          }

          // 예제 코드에 따라 response.v2.addresses[0]에서 좌표 추출
          const item = response.v2.addresses[0]
          if (!item || !item.x || !item.y) {
            console.error(`[Geocoding Invalid Response] POI: ${poi.name}, Address: ${address}`, item)
            resolve(null)
            return
          }

          const lat = parseFloat(item.y)
          const lng = parseFloat(item.x)

          if (isNaN(lat) || isNaN(lng)) {
            console.error(
              `[Geocoding Invalid Coordinates] POI: ${poi.name}, Address: ${address}, x=${item.x}, y=${item.y}`
            )
            resolve(null)
            return
          }

          log(`[Geocoding Success] POI: ${poi.name}, Address: ${address}, Result: lat=${lat}, lng=${lng}`)

          // 캐시에 저장
          geocodedPoisRef.current.set(poiId, { lat, lng })
          resolve({ lat, lng })
        })
      })
    },
    [log]
  )

  // Create numbered marker icon SVG data URL
  const createNumberedMarkerIcon = useCallback((number: number): string => {
    const svg = `
      <svg width="40" height="50" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 20 30 20 30s20-18.954 20-30C40 8.954 31.046 0 20 0z" fill="#62256e"/>
        <circle cx="20" cy="20" r="14" fill="white"/>
        <text x="20" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#62256e" text-anchor="middle">${number}</text>
      </svg>
    `
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  }, [])

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Wait until Naver Maps API is ready
  useEffect(() => {
    if (!isMounted) return
    setLoadError(null)

    let cancelled = false
    let attempts = 0
    const maxAttempts = 200 // 20s

    const checkNaverMaps = () => {
      if (cancelled) return

      if (window.naver?.maps?.Map && window.naver?.maps?.LatLng) {
        setIsReady(true)
        return
      }

      attempts += 1
      if (attempts >= maxAttempts) {
        setLoadError(
          'Naver Maps API가 준비되지 않았습니다. `app/layout.tsx`에서 Naver Maps SDK가 로드되는지 확인하세요.'
        )
        return
      }

      setTimeout(checkNaverMaps, 100)
    }

    checkNaverMaps()
    return () => {
      cancelled = true
    }
  }, [isMounted])

  // Initialize map - 공식 문서 예제 방식 (한 번만 초기화)
  useEffect(() => {
    if (!isReady || !isMounted || !mapRef.current || mapInstanceRef.current) return

    if (!window.naver || !window.naver.maps || !window.naver.maps.Map || !window.naver.maps.LatLng) {
      console.error('Naver Maps API is not available')
      return
    }

    try {
      // 공식 문서 예제: var map = new naver.maps.Map(mapDiv, mapOptions)
      // center prop is [longitude, latitude], but Naver Maps LatLng expects (latitude, longitude)
      const [lng, lat] = center
      const mapOptions = {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: zoom
      }

      // 지도를 삽입할 HTML 요소 또는 HTML 요소의 id를 지정
      const mapDiv = mapRef.current
      const map = new window.naver.maps.Map(mapDiv, mapOptions)

      // 사용자 인터랙션 추적: 드래그 시작/끝, 줌 변경 감지
      window.naver.maps.Event.addListener(map, 'dragstart', () => {
        isUserInteractingRef.current = true
      })
      
      window.naver.maps.Event.addListener(map, 'dragend', () => {
        isUserInteractingRef.current = false
      })

      window.naver.maps.Event.addListener(map, 'zoom_changed', () => {
        // 줌 변경은 사용자 조작으로 간주
        isUserInteractingRef.current = true
        setTimeout(() => {
          isUserInteractingRef.current = false
        }, 100)
      })

      // 지도 크기 자동 조정 (ResizeObserver 대신 지도 이벤트 사용)
      const handleResize = () => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.refresh()
          } catch (error) {
            // Ignore errors
          }
        }
      }
      window.addEventListener('resize', handleResize)

      mapInstanceRef.current = map
      lastCenterRef.current = center
      lastZoomRef.current = zoom
      log('Naver Maps initialized successfully')

      return () => {
        window.removeEventListener('resize', handleResize)
        window.naver.maps.Event.clearInstanceListeners(map)
      }
    } catch (error) {
      console.error('Error initializing Naver Maps:', error)
    }
  }, [isReady, isMounted, center, zoom, log]) // safe: guarded by mapInstanceRef.current

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => {
        try {
          marker.setMap(null)
          if (window.naver?.maps?.Event) {
            window.naver.maps.Event.clearInstanceListeners(marker)
          }
        } catch (error) {
          // Ignore errors
        }
      })
      markersRef.current = []

      // Cleanup polyline
      if (polylineRef.current) {
        try {
          polylineRef.current.setMap(null)
        } catch (error) {
          // Ignore errors
        }
        polylineRef.current = null
      }

      // Cleanup map
      if (mapInstanceRef.current) {
        try {
          window.naver.maps.Event.clearInstanceListeners(mapInstanceRef.current)
        } catch (error) {
          // Ignore errors
        }
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Draw map route line connecting cart items in order
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current || !window.naver?.maps || !showMapRoute) {
      if (polylineRef.current) {
        try {
          polylineRef.current.setMap(null)
        } catch (error) {
          // Ignore errors
        }
        polylineRef.current = null
      }
      return
    }

    if (!cartOrderMap || cartOrderMap.size === 0 || !pois || pois.length === 0) {
      if (polylineRef.current) {
        try {
          polylineRef.current.setMap(null)
        } catch (error) {
          // Ignore errors
        }
        polylineRef.current = null
      }
      return
    }

    // async 함수로 Geocoding 수행
    const drawPolyline = async () => {
      try {
        // Get POIs in cart order - Geocoding된 좌표 사용 (무조건 address_ko로 Geocoding)
        const orderedPoisWithCoords: Array<{ poi: POI; lat: number; lng: number; order: number }> = []
        
        // 모든 POI에 대해 Geocoding 수행하여 좌표 얻기
        const geocodingPromises = pois.map(async (poi: POI) => {
          const order = cartOrderMap.get(poi._id.$oid)
          if (order === undefined) return null

          // address_ko로 Geocoding 수행 (없으면 address 사용)
          const addressForGeocoding = poi.address_ko || poi.address
          if (!addressForGeocoding) return null

          const geocoded = await geocodeAddress(addressForGeocoding, poi._id.$oid, poi)
          if (!geocoded) return null

          return {
            poi,
            lat: geocoded.lat,
            lng: geocoded.lng,
            order
          }
        })

        const geocodedResults = await Promise.all(geocodingPromises)
        const validResults = geocodedResults.filter((result): result is { poi: POI; lat: number; lng: number; order: number } => result !== null)
        
        // order 순서대로 정렬
        validResults.sort((a, b) => a.order - b.order)
        orderedPoisWithCoords.push(...validResults)

        if (orderedPoisWithCoords.length < 2) {
          if (polylineRef.current) {
            try {
              polylineRef.current.setMap(null)
            } catch (error) {
              // Ignore errors
            }
            polylineRef.current = null
          }
          return
        }

        // Create path array for polyline using Geocoded coordinates
        const path = orderedPoisWithCoords.map(({ lat, lng }) => {
          return new window.naver.maps.LatLng(lat, lng)
        })

        if (path.length < 2) {
          if (polylineRef.current) {
            try {
              polylineRef.current.setMap(null)
            } catch (error) {
              // Ignore errors
            }
            polylineRef.current = null
          }
          return
        }

        // Remove existing polyline
        if (polylineRef.current) {
          try {
            polylineRef.current.setMap(null)
          } catch (error) {
            // Ignore errors
          }
        }

        // Create new polyline
        if (window.naver.maps.Polyline) {
          polylineRef.current = new window.naver.maps.Polyline({
            path: path,
            map: mapInstanceRef.current,
            strokeColor: '#62256e',
            strokeWeight: 4,
            strokeOpacity: 0.7
          })
        }
      } catch (error) {
        console.error('Error drawing map route:', error)
      }
    }

    drawPolyline()

    return () => {
      if (polylineRef.current) {
        try {
          polylineRef.current.setMap(null)
        } catch (error) {
          // Ignore errors
        }
        polylineRef.current = null
      }
    }
  }, [isReady, showMapRoute, pois, cartOrderMap, geocodeAddress])

  // 마커 생성 함수
  const createMarker = useCallback((lat: number, lng: number, poi: POI, cartOrder?: number) => {
    if (!window.naver.maps.Marker) return null

    const poiData = {
      name: poi.name,
      poiId: poi._id.$oid
    }

    const markerOptions: any = {
      position: new window.naver.maps.LatLng(lat, lng),
      map: mapInstanceRef.current,
      title: poi.name
    }

    // If POI is in cart and no search result, use numbered marker
    if (cartOrder !== undefined) {
      const numberedIconUrl = createNumberedMarkerIcon(cartOrder)
      markerOptions.icon = {
        url: numberedIconUrl,
        size: new window.naver.maps.Size(40, 50),
        scaledSize: new window.naver.maps.Size(40, 50),
        anchor: new window.naver.maps.Point(20, 50)
      }
    }

    const marker = new window.naver.maps.Marker(markerOptions)
    
    // Add click event listener
    window.naver.maps.Event.addListener(marker, 'click', () => {
      setSearchResult({
        name: poiData.name,
        type: 'poi',
        poiId: poiData.poiId
      })
    })

    return marker
  }, [createNumberedMarkerIcon, setSearchResult])

  // Add POI markers to map with Geocoding support
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current || !window.naver?.maps || pois.length === 0) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      try {
        marker.setMap(null)
        if (window.naver?.maps?.Event) {
          window.naver.maps.Event.clearInstanceListeners(marker)
        }
      } catch (error) {
        // Ignore errors
      }
    })
    markersRef.current = []

    try {
      if (!window.naver.maps.Marker) {
        console.error('Naver Maps Marker is not available')
        return
      }

      // Process POIs: 무조건 address_ko로 Geocoding하여 마커 표시
      const processPois = async () => {
        const markerPromises = pois.map(async (poi) => {
          let lat: number | null = null
          let lng: number | null = null

          // 무조건 address_ko로 Geocoding 수행 (없으면 address 사용)
          const addressForGeocoding = poi.address_ko || poi.address
          log(`[Geocoding] POI: ${poi.name}, Address: ${addressForGeocoding}`)
          
          if (addressForGeocoding) {
            const geocoded = await geocodeAddress(addressForGeocoding, poi._id.$oid, poi)
            if (geocoded) {
              lat = geocoded.lat
              lng = geocoded.lng
              log(`[Geocoding Success] POI: ${poi.name}, lat: ${lat}, lng: ${lng}`)
            } else {
              console.warn(`[Geocoding Failed] POI: ${poi.name}, Address: ${addressForGeocoding}`)
            }
          } else {
            console.warn(`[No Address] POI: ${poi.name} has no address_ko or address`)
          }

          // Geocoding으로 좌표를 얻었으면 마커 생성
          if (lat !== null && lng !== null) {
            try {
              const cartOrder = !hasSearchResult ? cartOrderMap.get(poi._id.$oid) : undefined
              log(`[Create Marker] POI: ${poi.name}, lat: ${lat}, lng: ${lng}, cartOrder: ${cartOrder}`)
              const marker = createMarker(lat, lng, poi, cartOrder)
              if (marker) {
                markersRef.current.push(marker)
                log(`[Marker Created] POI: ${poi.name} marker added successfully`)
                return marker
              }
            } catch (markerError) {
              console.error(`[Marker Error] Error creating marker for ${poi.name}:`, markerError)
            }
          } else {
            console.warn(`[No Coordinates] POI: ${poi.name} - cannot create marker without coordinates`)
          }
          return null
        })

        await Promise.all(markerPromises)
        log(`[Markers Complete] Total markers created: ${markersRef.current.length}`)
      }

      processPois()
    } catch (error) {
      console.error('Error adding POI markers:', error)
    }

    return () => {
      markersRef.current.forEach(marker => {
        try {
          marker.setMap(null)
          if (window.naver?.maps?.Event) {
            window.naver.maps.Event.clearInstanceListeners(marker)
          }
        } catch (error) {
          // Ignore errors
        }
      })
      markersRef.current = []
    }
  }, [isReady, pois, cartOrderMap, hasSearchResult, createMarker, geocodeAddress, log])

  // Update map center and zoom with smooth animation using morph (사용자가 직접 조작 중이 아닐 때만)
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current || !window.naver?.maps) return
    if (isUserInteractingRef.current) return // 사용자가 직접 조작 중이면 업데이트하지 않음

    // center와 zoom이 실제로 변경되었는지 확인
    const [lng, lat] = center
    const [lastLng, lastLat] = lastCenterRef.current
    const centerChanged = lng !== lastLng || lat !== lastLat
    const zoomChanged = zoom !== lastZoomRef.current

    if (!centerChanged && !zoomChanged) return

    try {
      const newLatLng = new window.naver.maps.LatLng(lat, lng)
      
      // morph 메서드를 사용하여 부드러운 애니메이션으로 변경
      mapInstanceRef.current.morph(newLatLng, zoom, {
        duration: 400, // 애니메이션 속도 (ms)
        easing: 'linear' // 애니메이션 효과
      })

      lastCenterRef.current = center
      lastZoomRef.current = zoom
    } catch (error) {
      console.error('Error updating map center/zoom:', error)
    }
  }, [center, zoom, isReady])

  // Loading state
  if (!isMounted || (!isReady && !loadError)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600 px-6">
          <p className="font-semibold">Naver Maps API Load Failed</p>
          <p className="text-sm mt-2">{loadError}</p>
        </div>
      </div>
    )
  }

  // Map container - 공식 문서 예제: <div id="map" style="width:100%;height:400px;"></div>
  // CSS 최적화: GPU 가속 및 부드러운 스크롤을 위한 스타일 추가
  return (
    <div 
      ref={mapRef} 
      id="map"
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        position: 'relative',
        isolation: 'isolate', // 새로운 stacking context 생성으로 다른 레이아웃과 분리
        willChange: 'transform', // GPU 가속 활성화
        transform: 'translateZ(0)', // 하드웨어 가속 강제
        backfaceVisibility: 'hidden', // 렌더링 최적화
        WebkitTransform: 'translateZ(0)', // Safari 지원
      }} 
      className="naver-map-container"
    />
  )
}
