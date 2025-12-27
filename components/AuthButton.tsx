"use client"

import { useSession, signOut } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>로딩 중...</div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full border-2 border-purple-400"
          />
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-400 hover:to-pink-400 hover:scale-105 transition-all font-semibold text-sm shadow-lg shadow-purple-500/30"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <a
      href="/auth/signin"
      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-400 hover:to-pink-400 hover:scale-105 transition-all font-semibold text-sm shadow-lg shadow-purple-500/30"
    >
      로그인하기
    </a>
  )
}

