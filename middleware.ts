import { NextRequest, NextResponse } from "next/server"

type Bucket = {
  count: number
  resetAt: number // epoch ms
}

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitBuckets: Map<string, Bucket> | undefined
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]?.trim() || "unknown"
  const xrip = req.headers.get("x-real-ip")
  if (xrip) return xrip.trim()
  // NextRequest.ip is populated in some runtimes (not all)
  return req.ip ?? "unknown"
}

function getBuckets(): Map<string, Bucket> {
  if (!globalThis.__rateLimitBuckets) {
    globalThis.__rateLimitBuckets = new Map()
  }
  return globalThis.__rateLimitBuckets
}

function clampInt(value: string | undefined, fallback: number, min: number, max: number): number {
  const n = value ? Number.parseInt(value, 10) : Number.NaN
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Production-only maintenance wall.
  // - Toggle with Vercel env var: MAINTENANCE_MODE=1 (Production env only)
  // - Preview deployments remain fully functional
  const isProd = process.env.VERCEL_ENV === "production"
  const maintenanceOn =
    process.env.MAINTENANCE_MODE === "1" ||
    process.env.MAINTENANCE_MODE?.toLowerCase() === "true" ||
    process.env.MAINTENANCE_MODE?.toLowerCase() === "on"

  if (isProd && maintenanceOn) {
    // Return a plain 503 for all routes.
    return new NextResponse("Service Unavailable", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        // 14 days (optional hint to clients/crawlers)
        "Retry-After": "1209600",
        "X-Robots-Tag": "noindex, nofollow",
      },
    })
  }

  // Don't rate-limit NextAuth endpoints (OAuth flows can be chatty).
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const isImageOptimizer = pathname === "/_next/image"
  const isApi = pathname.startsWith("/api/")

  // Should only happen due to matcher, but keep safe.
  if (!isImageOptimizer && !isApi) {
    return NextResponse.next()
  }

  // Defaults tuned to be conservative (avoid breaking users behind shared IPs).
  // You can override via env vars at build/deploy time.
  const windowMs = clampInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000, 10_000, 10 * 60_000)
  const apiLimit = clampInt(process.env.RATE_LIMIT_API_PER_WINDOW, 120, 10, 10_000)
  const imageLimit = clampInt(process.env.RATE_LIMIT_IMAGE_PER_WINDOW, 240, 10, 50_000)

  const limit = isImageOptimizer ? imageLimit : apiLimit
  const ip = getClientIp(req)
  const bucketKey = `${ip}:${isImageOptimizer ? "image" : "api"}`

  const now = Date.now()
  const buckets = getBuckets()
  const existing = buckets.get(bucketKey)
  const bucket: Bucket = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowMs }

  bucket.count += 1
  buckets.set(bucketKey, bucket)

  const remaining = Math.max(0, limit - bucket.count)
  const resetSeconds = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000))

  // Opportunistic cleanup to avoid unbounded growth (best-effort).
  // Delete a few expired buckets when we notice them.
  if (!existing || existing.resetAt <= now) {
    let cleaned = 0
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) {
        buckets.delete(k)
        cleaned += 1
        if (cleaned >= 25) break
      }
    }
  }

  if (bucket.count > limit) {
    const res = isApi
      ? NextResponse.json({ error: "Too Many Requests" }, { status: 429 })
      : new NextResponse("Too Many Requests", { status: 429 })

    res.headers.set("Retry-After", String(resetSeconds))
    res.headers.set("X-RateLimit-Limit", String(limit))
    res.headers.set("X-RateLimit-Remaining", "0")
    res.headers.set("X-RateLimit-Reset", String(bucket.resetAt))
    return res
  }

  const res = NextResponse.next()
  res.headers.set("X-RateLimit-Limit", String(limit))
  res.headers.set("X-RateLimit-Remaining", String(remaining))
  res.headers.set("X-RateLimit-Reset", String(bucket.resetAt))
  return res
}

export const config = {
  // Run middleware on all routes so the maintenance wall can block page traffic.
  // Rate limiting still only applies to `/api/*` and `/_next/image` via the checks above.
  matcher: ["/:path*"],
}

