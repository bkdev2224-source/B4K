# Redis (Upstash) setup for rate limiting

Redis in this project is **only used for rate limiting**. It protects your APIs from abuse and overuse. It is **not** used for analytics or consent.

- **Geocode API**: 10 requests per minute per IP (hits a paid external API).
- **Data APIs** (POIs, packages, logo, kpop-artists, kcontents): 100 requests per minute per IP.

If Upstash is not configured, the app runs without rate limiting (no 429 responses). You can leave it unset for MVP testing and add it when you care about limiting usage (e.g. before or at production).

---

## When to set it up

| Scenario | Recommendation |
|----------|----------------|
| **Thursday MVP test** | Leave unset; app works fine. |
| **Before production / when you care about API costs** | Set up Upstash and add the env vars. |

---

## Step-by-step setup (Upstash)

### 1. Create an Upstash account

1. Go to [upstash.com](https://upstash.com) and sign up (or sign in).
2. You can use the free tier for development and low traffic.

### 2. Create a Redis database

1. In the Upstash console, click **Create Database**.
2. Choose **Global** or a region close to your app (e.g. your Vercel region).
3. Name it (e.g. `b4k-ratelimit`).
4. Leave **Eviction** as default (or enable if you want automatic key expiry).
5. Create the database.

### 3. Get REST credentials

1. Open your new database.
2. In the **REST API** section you’ll see:
   - **UPSTASH_REDIS_REST_URL** (e.g. `https://xxxxx.upstash.io`)
   - **UPSTASH_REDIS_REST_TOKEN** (long token string)

### 4. Add env vars locally

In your project root, copy `.env.example` to `.env.local` (if you don’t already have one), then set:

```bash
# Rate limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-db-id.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

Replace with the actual URL and token from the Upstash console.

### 5. Add env vars in production (e.g. Vercel)

1. Open your project on [Vercel](https://vercel.com) → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `UPSTASH_REDIS_REST_URL`  
     **Value:** your Upstash REST URL  
     **Environments:** Production (and Preview if you want rate limiting in previews).
   - **Name:** `UPSTASH_REDIS_REST_TOKEN`  
     **Value:** your Upstash REST token  
     **Environments:** Production (and Preview if needed).
3. Redeploy so the new variables are applied.

---

## How it works

### MongoDB vs Redis: Different purposes

Your project uses **both MongoDB and Redis**, but they serve completely different purposes:

| Database | Purpose | Data Type | Example |
|----------|---------|-----------|---------|
| **MongoDB** | Persistent data storage | Long-term, structured data | POIs, packages, kpop-artists, kcontents |
| **Redis (Upstash)** | Rate limiting cache | Temporary counters, expires quickly | Request counts per IP address |

**Why not use MongoDB for rate limiting?**

1. **Speed**: Rate limiting needs sub-millisecond lookups. MongoDB queries are slower (network + disk I/O).
2. **Atomic operations**: Redis has built-in atomic increment/decrement operations perfect for counters. MongoDB would require transactions or find-and-modify operations.
3. **Temporary data**: Rate limit counters expire after 1 minute. Redis is designed for temporary, fast-expiring data.
4. **High write volume**: Every API request writes to the rate limiter. MongoDB isn't optimized for this write-heavy, temporary pattern.

### Technical flow: How rate limiting works

Here's what happens when a request hits your API:

#### Example: `/api/pois` request

```typescript
// 1. Request arrives at app/api/pois/route.ts
export async function GET(request: NextRequest) {
  // 2. FIRST: Check rate limit BEFORE touching MongoDB
  const limitRes = await checkApiLimit(request)
  if (limitRes) return limitRes  // Returns 429 if over limit
  
  // 3. ONLY if rate limit passes: Query MongoDB
  const pois = await getAllPOIs()  // MongoDB query
  return NextResponse.json(pois)
}
```

#### Inside `checkApiLimit()`:

```typescript
// lib/ratelimit.ts
export async function checkApiLimit(request: NextRequest) {
  const limiter = apiLimiter  // Created at startup
  if (!limiter) return null   // No Redis = no rate limiting
  
  // Extract client IP from headers (works behind Vercel proxy)
  const ip = getClientIp(request)  // e.g. "203.0.113.42"
  
  // Redis operation: Check/increment counter for this IP
  const { success } = await limiter.limit(ip)
  // Returns { success: true } if under limit
  // Returns { success: false } if over limit
  
  return success ? null : rateLimit429()  // 429 response if blocked
}
```

#### What Redis stores (under the hood):

When `limiter.limit(ip)` is called, `@upstash/ratelimit` uses a **sliding window** algorithm:

1. **Redis key**: `ratelimit:api:203.0.113.42` (prefix + IP)
2. **Redis value**: A sorted set of timestamps for requests in the last minute
3. **On each request**:
   - Add current timestamp to the sorted set
   - Remove timestamps older than 1 minute
   - Count remaining timestamps
   - If count ≥ 100 → return `{ success: false }` (429)
   - If count < 100 → return `{ success: true }` (allow)

**Example Redis data** (conceptual):
```
Key: ratelimit:api:203.0.113.42
Value (sorted set):
  - 1707000000.123  (request at 10:00:00.123)
  - 1707000015.456  (request at 10:00:15.456)
  - 1707000030.789  (request at 10:00:30.789)
  ... (up to 100 timestamps)
```

After 1 minute, old timestamps automatically expire (Redis TTL).

### Complete request flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Client request: GET /api/pois                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Next.js API Route Handler                                │
│    app/api/pois/route.ts                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Rate Limit Check (FIRST)                                  │
│    checkApiLimit(request)                                    │
│    ├─ Extract IP: "203.0.113.42"                            │
│    ├─ Redis query: limiter.limit("203.0.113.42")            │
│    │   └─ Upstash Redis: Check/increment counter            │
│    └─ Result: { success: true } or { success: false }        │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐              ┌───────────────┐
│ success: true │              │ success: false│
│ (under limit) │              │ (over limit)  │
└───────┬───────┘              └───────┬───────┘
        │                               │
        │                               ▼
        │                      ┌─────────────────┐
        │                      │ Return 429      │
        │                      │ (stop here)     │
        │                      └─────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. MongoDB Query (ONLY if rate limit passed)                │
│    getAllPOIs()                                              │
│    └─ MongoDB: Fetch POI documents                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Return Response                                           │
│    NextResponse.json(pois)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Why this architecture?

1. **Protect MongoDB**: Rate limiting happens BEFORE MongoDB queries, preventing expensive database operations from abusive clients.
2. **Protect external APIs**: Geocode API rate limiting prevents hitting paid Naver Maps API too frequently.
3. **Fast rejection**: Redis responds in milliseconds, so blocked requests fail fast without wasting server resources.
4. **Per-IP tracking**: Each IP address has its own counter, so one abusive user doesn't affect others.

### Configuration details

- **`lib/ratelimit.ts`** uses `@upstash/ratelimit` and `@upstash/redis`.
- If **both** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, limiters are created and API routes that use `checkGeocodeLimit` or `checkApiLimit` will return **429 Too Many Requests** when the limit is exceeded.
- If either env var is missing, `createRatelimit` returns `null` and the check helpers return `null` (no 429), so the app runs with no rate limiting.

Limits are **per IP**, using a sliding window (1 minute). The client IP is taken from `x-forwarded-for` or `x-real-ip` when present (e.g. behind Vercel).

### Which routes are rate-limited?

| Route | Limiter | Limit | Reason |
|-------|---------|-------|--------|
| `/api/geocode` | `checkGeocodeLimit` | 10/min/IP | Calls paid Naver Maps API |
| `/api/pois` | `checkApiLimit` | 100/min/IP | Reads from MongoDB |
| `/api/packages` | `checkApiLimit` | 100/min/IP | Reads from MongoDB |
| `/api/logo/[...path]` | `checkApiLimit` | 100/min/IP | Reads from MongoDB |
| `/api/kpop-artists` | `checkApiLimit` | 100/min/IP | Reads from MongoDB |
| `/api/kcontents` | `checkApiLimit` | 100/min/IP | Reads from MongoDB |

---

## Optional: verify it’s working

1. Set the env vars and restart your dev server.
2. Call an endpoint that is rate-limited (e.g. geocode or a data API) many times in a short period from the same IP.
3. After exceeding the limit you should get a **429** response with body:  
   `{ "error": "Too many requests. Please try again later." }`

---

## Summary

| Item | Value |
|------|--------|
| **Purpose** | Rate limiting only (geocode + data APIs) |
| **Provider** | Upstash (serverless Redis) |
| **Required env vars** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| **Optional?** | Yes; app works without them (no rate limiting) |
| **When to add** | When you want to protect geocode and data API usage (e.g. production) |
