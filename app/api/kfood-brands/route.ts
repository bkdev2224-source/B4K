import { NextRequest, NextResponse } from 'next/server'
import { getKFoodBrandByName, getAllKFoodBrands } from '@/lib/db/kfood-brands'
import { checkApiLimit } from '@/lib/ratelimit'

// Query-string based route handlers can't be statically prerendered.
// Use CDN caching headers instead.
export const dynamic = 'force-dynamic'

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
} as const

/**
 * GET /api/kfood-brands?name=Bibimbap
 * name으로 브랜드 1건 조회 (대소문자 무시)
 * 
 * GET /api/kfood-brands
 * 모든 브랜드 조회
 */
export async function GET(request: NextRequest) {
  const limitRes = await checkApiLimit(request)
  if (limitRes) return limitRes

  try {
    const name = request.nextUrl.searchParams.get('name')
    if (name?.trim()) {
      const brand = await getKFoodBrandByName(name.trim())
      return NextResponse.json({ brand }, { headers: CACHE_HEADERS })
    } else {
      const brands = await getAllKFoodBrands()
      return NextResponse.json({ brands }, { headers: CACHE_HEADERS })
    }
  } catch (error) {
    console.error('Error fetching kfood brand:', error)
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 })
  }
}

