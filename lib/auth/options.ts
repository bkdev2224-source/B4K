import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env, ensureNextAuthUrl } from "@/lib/config/env"

/**
 * NextAuth v4 reads NEXTAUTH_URL from process.env.
 *
 * IMPORTANT:
 * - Setting NEXTAUTH_URL to the deployment's `*.vercel.app` URL will cause Google OAuth
 *   to use that as the `redirect_uri`, which breaks sign-in on custom domains unless
 *   you also whitelist the vercel.app callback in Google Cloud Console.
 * - On Vercel *Preview* we can safely infer NEXTAUTH_URL from VERCEL_URL to avoid
 *   having to manage per-preview-domain env vars.
 * - On Vercel *Production* (especially with custom domains), prefer an explicit
 *   NEXTAUTH_URL (e.g. https://b4korea.com). If it's not set, let NextAuth infer
 *   from the incoming request host headers.
 */
const vercelEnv = env("VERCEL_ENV")
if (!env("NEXTAUTH_URL") && vercelEnv === "preview") {
  ensureNextAuthUrl()
}

const googleClientId = env("GOOGLE_CLIENT_ID")
const googleClientSecret = env("GOOGLE_CLIENT_SECRET")
// Feature flag: Set NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false to temporarily disable Google auth
// Defaults to true if not set (backward compatible)
const googleAuthEnabled = env("NEXT_PUBLIC_GOOGLE_AUTH_ENABLED") !== "false"
const nodeEnv = env("NODE_ENV")

// Require NEXTAUTH_SECRET in production to prevent JWT forgery
const nextAuthSecret =
  nodeEnv === "production"
    ? (() => {
        const secret = env("NEXTAUTH_SECRET")
        if (!secret || secret.length < 32) {
          throw new Error(
            "NEXTAUTH_SECRET must be set and at least 32 characters in production. Generate with: openssl rand -base64 32"
          )
        }
        return secret
      })()
    : env("NEXTAUTH_SECRET")

export const authOptions: NextAuthOptions = {
  providers:
    googleAuthEnabled && googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 초기 로그인 시 사용자 정보를 토큰에 저장
      if (account && user) {
        token.accessToken = account.access_token
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      // 세션에 사용자 id 추가 (accessToken은 클라이언트에 노출하지 않음 - 보안)
      if (session.user) {
        session.user.id = token.id as string || ""
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // 로그인 성공 후 홈으로 리다이렉트
      // 상대 경로인 경우 baseUrl과 결합
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // 같은 도메인인 경우 허용
      if (new URL(url).origin === baseUrl) {
        return url
      }
      // 기본적으로 홈으로 리다이렉트
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: nextAuthSecret,
  debug: nodeEnv === "development",
  logger: {
    error(code, metadata) {
      console.error("[next-auth][error]", code, metadata)
    },
    warn(code) {
      console.warn("[next-auth][warn]", code)
    },
    debug(code, metadata) {
      if (nodeEnv === "development") {
        console.log("[next-auth][debug]", code, metadata)
      }
    },
  },
}
