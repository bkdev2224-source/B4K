"use client"

import { useSession, signOut } from "next-auth/react"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>로딩 중...</div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{session.user?.name}</span>
          <span className="text-xs text-gray-500">{session.user?.email}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <a
      href="/auth/signin"
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      로그인
    </a>
  )
}

