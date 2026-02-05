/**
 * Rate limiting via Upstash Redis.
 * Optional: if UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set,
 * rate limiting is skipped (app works without Upstash).
 *
 * Uses API route handlers (Node.js runtime), not Edge middleware.
 */

import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function createRatelimit(limit: number, window: '1 m' | '10 s', prefix: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const redis = new Redis({ url, token })
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix,
  })
}

/** Geocode API: stricter (10 req/min) - proxy to paid external API */
const geocodeLimiter = createRatelimit(10, '1 m', 'ratelimit:geocode')

/** Data APIs: 100 req/min per IP */
const apiLimiter = createRatelimit(100, '1 m', 'ratelimit:api')

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp
  return 'anonymous'
}

export function rateLimit429() {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429 }
  )
}

/** Call at start of geocode API route. Returns 429 response if limited, null otherwise. */
export async function checkGeocodeLimit(request: NextRequest): Promise<NextResponse | null> {
  const limiter = geocodeLimiter
  if (!limiter) return null
  const ip = getClientIp(request)
  const { success } = await limiter.limit(ip)
  return success ? null : rateLimit429()
}

/** Call at start of data API routes. Returns 429 response if limited, null otherwise. */
export async function checkApiLimit(request: NextRequest): Promise<NextResponse | null> {
  const limiter = apiLimiter
  if (!limiter) return null
  const ip = getClientIp(request)
  const { success } = await limiter.limit(ip)
  return success ? null : rateLimit429()
}
