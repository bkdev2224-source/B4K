import { NextRequest, NextResponse } from 'next/server'
import { getKpopArtistByName } from '@/lib/db/kpop-artists'

export const dynamic = 'force-dynamic'

/**
 * GET /api/kpop-artists?name=aespa
 * name으로 아티스트 1건 조회 (대소문자 무시)
 */
export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get('name')
    if (!name?.trim()) {
      return NextResponse.json({ artist: null })
    }
    const artist = await getKpopArtistByName(name.trim())
    return NextResponse.json({ artist })
  } catch (error) {
    console.error('Error fetching kpop artist:', error)
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 })
  }
}
