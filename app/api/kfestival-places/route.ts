import { NextRequest, NextResponse } from 'next/server'
import { getKFestivalPlaceByName, getAllKFestivalPlaces } from '@/lib/db/kfestival-places'
import { checkApiLimit } from '@/lib/ratelimit'

// Query-string based route handlers can't be statically prerendered.
// Use CDN caching headers instead.
export const dynamic = 'force-dynamic'

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
} as const

/**
 * GET /api/kfestival-places?name=Cherry Blossom
 * name으로 축제 1건 조회 (대소문자 무시)
 * 
 * GET /api/kfestival-places
 * 모든 축제 조회
 */
export async function GET(request: NextRequest) {
  const limitRes = await checkApiLimit(request)
  if (limitRes) return limitRes

  try {
    const name = request.nextUrl.searchParams.get('name')
    if (name?.trim()) {
      const place = await getKFestivalPlaceByName(name.trim())
      return NextResponse.json({ place }, { headers: CACHE_HEADERS })
    } else {
      const places = await getAllKFestivalPlaces()
      return NextResponse.json({ places }, { headers: CACHE_HEADERS })
    }
  } catch (error) {
    console.error('Error fetching kfestival place:', error)
    return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 })
  }
}

