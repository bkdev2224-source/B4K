import { NextRequest, NextResponse } from 'next/server'
import { getAllPOIs, getPOIById } from '@/lib/db/pois'
import type { POIJson } from '@/types'

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
      return NextResponse.json(poi ? toPOIJson(poi as any) : null)
    }

    const pois = await getAllPOIs()
    return NextResponse.json(pois.map((p) => toPOIJson(p as any)))
  } catch (error) {
    console.error('Error fetching POIs:', error)
    return NextResponse.json({ error: 'Failed to fetch POIs' }, { status: 500 })
  }
}


