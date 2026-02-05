import { NextRequest, NextResponse } from 'next/server'
import { getAllPackages, getPackageById } from '@/lib/db/packages'
import type { TravelPackageJson } from '@/types'
import { checkApiLimit } from '@/lib/ratelimit'
import { isValidId } from '@/lib/utils/validate-id'

// Query-string based route handlers can't be statically prerendered.
// Use CDN caching headers instead.
export const dynamic = 'force-dynamic'

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
} as const

function toPackageJson(pkg: { _id: string } & Omit<TravelPackageJson, '_id'>): TravelPackageJson {
  return {
    ...pkg,
    _id: { $oid: pkg._id },
  }
}

/**
 * GET /api/packages
 * - /api/packages               -> TravelPackageJson[]
 * - /api/packages?packageId=...  -> TravelPackageJson | null
 */
export async function GET(request: NextRequest) {
  const limitRes = await checkApiLimit(request)
  if (limitRes) return limitRes

  try {
    const searchParams = request.nextUrl.searchParams
    const packageId = searchParams.get('packageId')

    if (packageId && !isValidId(packageId)) {
      return NextResponse.json({ error: 'Invalid packageId format' }, { status: 400 })
    }

    if (packageId) {
      const pkg = await getPackageById(packageId)
      return NextResponse.json(pkg ? toPackageJson(pkg as any) : null, {
        headers: CACHE_HEADERS,
      })
    }

    const pkgs = await getAllPackages()
    return NextResponse.json(pkgs.map((p) => toPackageJson(p as any)), {
      headers: CACHE_HEADERS,
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}


