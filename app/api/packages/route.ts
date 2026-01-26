import { NextRequest, NextResponse } from 'next/server'
import { getAllPackages, getPackageById } from '@/lib/db/packages'
import type { TravelPackageJson } from '@/types'

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
  try {
    const searchParams = request.nextUrl.searchParams
    const packageId = searchParams.get('packageId')

    if (packageId) {
      const pkg = await getPackageById(packageId)
      return NextResponse.json(pkg ? toPackageJson(pkg as any) : null)
    }

    const pkgs = await getAllPackages()
    return NextResponse.json(pkgs.map((p) => toPackageJson(p as any)))
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}


