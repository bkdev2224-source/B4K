import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { checkApiLimit } from '@/lib/ratelimit'

const BASE_DIR = path.join(process.cwd(), 'mockupdata', 'logo')

function getContentType(ext: string) {
  switch (ext) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}

export async function GET(request: NextRequest, ctx: { params: { path: string[] } }) {
  const limitRes = await checkApiLimit(request)
  if (limitRes) return limitRes

  const relPath = (ctx.params?.path ?? []).join('/')
  if (!relPath) return new NextResponse('Not found', { status: 404 })

  const filePath = path.normalize(path.join(BASE_DIR, relPath))
  const baseWithSep = BASE_DIR.endsWith(path.sep) ? BASE_DIR : BASE_DIR + path.sep
  if (!filePath.startsWith(baseWithSep)) {
    return new NextResponse('Bad request', { status: 400 })
  }

  try {
    const data = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    return new NextResponse(data, {
      headers: {
        'Content-Type': getContentType(ext),
        // 로고는 거의 안 바뀌는 정적 리소스라 강하게 캐시해도 OK
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}


