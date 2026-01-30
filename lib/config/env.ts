/**
 * Centralized environment access (no hardcoded fallbacks).
 *
 * Goals:
 * - Avoid scattering `process.env.*` across the codebase
 * - Avoid hardcoded fallback values like `|| 'B4K_TEST'` or `|| ''`
 * - Provide "lazy" getters so we don't crash at import-time during builds
 */

export function env(name: string): string | undefined {
  const value = process.env[name]
  const trimmed = typeof value === "string" ? value.trim() : undefined
  return trimmed ? trimmed : undefined
}

export function requiredEnv(name: string): string {
  const value = env(name)
  if (!value) {
    throw new Error(`${name} is not set. Please configure it in your environment variables.`)
  }
  return value
}

export function inferMongoDbNameFromUri(uri: string): string | undefined {
  try {
    const url = new URL(uri)
    // pathname: "/B4K_TEST" or "/" (no db)
    const path = (url.pathname || "").replace(/^\//, "")
    const dbName = path.split("/").filter(Boolean)[0]
    return dbName ? dbName : undefined
  } catch {
    // If parsing fails, we can't infer the DB name.
    return undefined
  }
}

/**
 * Mongo DB name resolution order:
 * 1) MONGODB_DB_NAME (explicit)
 * 2) parse from MONGODB_URI (/dbName)
 *
 * Throws only when actually called.
 */
export function getMongoDbName(): string {
  const explicit = env("MONGODB_DB_NAME")
  if (explicit) return explicit

  const uri = env("MONGODB_URI")
  if (uri) {
    const inferred = inferMongoDbNameFromUri(uri)
    if (inferred) return inferred
  }

  throw new Error(
    "Mongo DB name could not be resolved. Set MONGODB_DB_NAME or include '/<dbName>' in MONGODB_URI."
  )
}

export function getMongoUriOptional(): string | undefined {
  return env("MONGODB_URI")
}

export function getMongoUriRequired(): string {
  return requiredEnv("MONGODB_URI")
}


export function getNaverMapClientId(): string | undefined {
  return env("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID") ?? env("NEXT_NAVER_MAP_CLIENT_ID") ?? env("NAVER_MAP_CLIENT_ID")
}


/**
 * NextAuth on Vercel: if NEXTAUTH_URL isn't explicitly set, infer it from VERCEL_URL.
 * We keep this as a side-effect because NextAuth v4 reads NEXTAUTH_URL from process.env.
 */
export function ensureNextAuthUrl(): void {
  if (env("NEXTAUTH_URL")) return
  const vercel = env("VERCEL_URL")
  if (vercel) {
    process.env.NEXTAUTH_URL = `https://${vercel}`
  }
}


