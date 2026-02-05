import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllKContents, 
  getKContentsByCategory, 
  getKContentsByPOIId, 
  getKContentsBySubName 
} from '@/lib/db/kcontents'
import { checkApiLimit } from '@/lib/ratelimit'

// Query-string based route handlers can't be statically prerendered.
// Use CDN caching headers instead.
export const dynamic = 'force-dynamic'

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
} as const

const ALLOWED_CATEGORIES = ['kpop', 'kbeauty', 'kfood', 'kfestival', 'kdrama'] as const
type AllowedCategory = (typeof ALLOWED_CATEGORIES)[number]

/** Reject values that could be NoSQL operator injection */
function safeString(val: string | null, maxLen = 500): string | null {
  if (!val || typeof val !== 'string') return null
  const trimmed = val.trim()
  if (trimmed.length === 0 || trimmed.length > maxLen) return null
  if (/[${}[\]\\]/.test(trimmed)) return null
  return trimmed
}

/**
 * GET /api/kcontents
 * 모든 KContents 조회
 */
export async function GET(request: NextRequest) {
  const limitRes = await checkApiLimit(request)
  if (limitRes) return limitRes

  try {
    const searchParams = request.nextUrl.searchParams
    const categoryParam = searchParams.get('category')
    const poiId = safeString(searchParams.get('poiId'), 100)
    const subName = safeString(searchParams.get('subName'), 200)

    // Allowlist category to prevent NoSQL injection
    const category: AllowedCategory | null =
      categoryParam && ALLOWED_CATEGORIES.includes(categoryParam as AllowedCategory)
        ? (categoryParam as AllowedCategory)
        : null

    if (categoryParam && !category) {
      return NextResponse.json(
        { error: 'Invalid category. Allowed: kpop, kbeauty, kfood, kfestival, kdrama' },
        { status: 400 }
      )
    }

    let contents

    if (subName) {
      contents = await getKContentsBySubName(subName)
    } else if (poiId) {
      contents = await getKContentsByPOIId(poiId)
    } else if (category) {
      contents = await getKContentsByCategory(category)
    } else {
      contents = await getAllKContents()
    }

    // MongoDB 형식을 기존 JSON 형식으로 변환
    // Note: contents already have poiId as string from db functions
    const formattedContents = contents.map(content => ({
      subName: content.subName,
      poiId: { $oid: content.poiId },
      spotName: content.spotName,
      description: content.description,
      tags: content.tags,
      popularity: content.popularity,
      category: content.category,
    }))

    return NextResponse.json(formattedContents, { headers: CACHE_HEADERS })
  } catch (error) {
    console.error('Error fetching KContents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch KContents' },
      { status: 500 }
    )
  }
}

