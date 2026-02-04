import { NextRequest, NextResponse } from 'next/server'
import { getKBeautyPlaceByName, getAllKBeautyPlaces } from '@/lib/db/kbeauty-places'
import { checkApiLimit } from '@/lib/ratelimit'

// Query-string based route handlers can't be statically prerendered.
// Use CDN caching headers instead.
export const dynamic = 'force-dynamic'

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
} as const

/**
 * GET /api/kbeauty-places?name=Sulwhasoo
 * name으로 브랜드 1건 조회 (대소문자 무시)
 * 
 * GET /api/kbeauty-places
 * 모든 브랜드 조회
 */
export async function GET(request: NextRequest) {
  const limitRes = await checkApiLimit(request)
  if (limitRes) return limitRes

  try {
    const name = request.nextUrl.searchParams.get('name')
    if (name?.trim()) {
      const place = await getKBeautyPlaceByName(name.trim())
      return NextResponse.json({ place }, { headers: CACHE_HEADERS })
    } else {
      const places = await getAllKBeautyPlaces()
      return NextResponse.json({ places }, { headers: CACHE_HEADERS })
    }
  } catch (error) {
    console.error('Error fetching kbeauty place:', error)
    return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 })
  }
}

