"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import { useSidebar } from '@/components/SidebarContext'

export default function MyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { sidebarOpen } = useSidebar()

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
        <Sidebar />
        <TopNav />
        <main className={`pt-16 pb-8 px-6 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-[12.75%] lg:w-[87.25%]' : 'lg:ml-[80px] lg:w-[calc(100%-80px)]'
        }`}>
          <div className="container mx-auto">
            <p className="text-purple-300">로딩 중...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      <Sidebar />
      <TopNav />

      <main className={`pt-16 pb-8 px-6 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-[17%] lg:w-[83%]' : 'lg:ml-20 lg:w-[calc(100%-5rem)]'
      }`}>
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-white mb-8">MyPage</h1>
          
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-20 h-20 rounded-full border-2 border-purple-400"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-purple-400">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">{session.user?.name || 'User'}</h2>
                <p className="text-purple-300">{session.user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-800/30 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">프로필 정보</h3>
                <p className="text-purple-200 text-sm">이곳에서 프로필 정보를 관리할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

