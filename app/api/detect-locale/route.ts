import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Vercel에서 제공하는 국가 코드 헤더 사용
  const country = request.headers.get('x-vercel-ip-country') || 
                  request.geo?.country || 
                  null

  // 한국이면 한국어, 아니면 영어
  const language = country === 'KR' ? 'ko' : 'en'

  return NextResponse.json({ language, country })
}

