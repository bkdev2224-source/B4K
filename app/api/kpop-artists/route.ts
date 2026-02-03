import { NextRequest, NextResponse } from 'next/server'
import { getKpopArtistByName } from '@/lib/db/kpop-artists'

// Query-string based route handlers can't be statically prerendered.
// Use CDN caching headers instead.
export const dynamic = 'force-dynamic'

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
} as const

/**
 * GET /api/kpop-artists?name=aespa
 * name으로 아티스트 1건 조회 (대소문자 무시)
 */
export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get('name')
    if (!name?.trim()) {
      return NextResponse.json({ artist: null }, { headers: CACHE_HEADERS })
    }
    const artist = await getKpopArtistByName(name.trim())
    return NextResponse.json({ artist }, { headers: CACHE_HEADERS })
  } catch (error) {
    console.error('Error fetching kpop artist:', error)
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 })
  }
}
