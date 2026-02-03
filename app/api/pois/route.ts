import { NextRequest, NextResponse } from 'next/server'
import { getAllPOIs, getPOIById } from '@/lib/db/pois'
import type { POIJson } from '@/types'

// Query-string based route handlers can't be statically prerendered.
// Use CDN caching headers instead.
export const dynamic = 'force-dynamic'

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
} as const

function toPOIJson(poi: { _id: string } & Omit<POIJson, '_id'>): POIJson {
  return {
    ...poi,
    _id: { $oid: poi._id },
  }
}

/**
 * GET /api/pois
 * - /api/pois                  -> POIJson[]
 * - /api/pois?poiId=...         -> POIJson | null
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const poiId = searchParams.get('poiId')

    if (poiId) {
      const poi = await getPOIById(poiId)
      return NextResponse.json(poi ? toPOIJson(poi as any) : null, {
        headers: CACHE_HEADERS,
      })
    }

    const pois = await getAllPOIs()
    return NextResponse.json(pois.map((p) => toPOIJson(p as any)), {
      headers: CACHE_HEADERS,
    })
  } catch (error) {
    console.error('Error fetching POIs:', error)
    return NextResponse.json({ error: 'Failed to fetch POIs' }, { status: 500 })
  }
}


