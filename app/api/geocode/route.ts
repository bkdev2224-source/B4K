import { NextRequest, NextResponse } from 'next/server'
import { getNaverMapClientId } from '@/lib/config/env'
import { checkGeocodeLimit } from '@/lib/ratelimit'

export async function GET(request: NextRequest) {
  const limitRes = await checkGeocodeLimit(request)
  if (limitRes) return limitRes

  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    )
  }

  const clientId = getNaverMapClientId()
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'Naver Maps API Client ID is not configured' },
      { status: 500 }
    )
  }

  try {
    // Naver Maps Geocoding API 호출
    const encodedAddress = encodeURIComponent(address)
    const geocodeUrl = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodedAddress}`
    
    const response = await fetch(geocodeUrl, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Naver Geocoding API error:', response.status, errorText)
      const isProd = process.env.NODE_ENV === 'production'
      return NextResponse.json(
        {
          error: 'Geocoding API request failed',
          ...(isProd ? {} : { details: errorText }),
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // 응답 구조 확인 및 좌표 추출
    if (data.status === 'OK' && data.addresses && data.addresses.length > 0) {
      const addr = data.addresses[0]
      const lat = parseFloat(addr.y)
      const lng = parseFloat(addr.x)
      
      if (!isNaN(lat) && !isNaN(lng)) {
        return NextResponse.json({
          success: true,
          lat,
          lng,
          address: addr.roadAddress || addr.jibunAddress || address,
        })
      }
    }

    return NextResponse.json(
      { error: 'No coordinates found for the given address', data },
      { status: 404 }
    )
  } catch (error) {
    console.error('Geocoding error:', error)
    const isProd = process.env.NODE_ENV === 'production'
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(isProd ? {} : { details: error instanceof Error ? error.message : String(error) }),
      },
      { status: 500 }
    )
  }
}

