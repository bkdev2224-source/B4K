"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import PageLayout from '@/components/PageLayout'

export default function MyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <PageLayout showSidePanel={false} className="pb-8 px-6">
        <div className="container mx-auto">
          <p className="text-purple-600">Loading...</p>
        </div>
      </PageLayout>
    )
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <PageLayout showSidePanel={false} className="pb-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">MyPage</h1>
          
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-purple-400"
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
                <h3 className="text-lg font-semibold text-white mb-2">Profile Information</h3>
                <p className="text-purple-200 text-sm">You can manage your profile information here.</p>
              </div>
            </div>
          </div>
        </div>
    </PageLayout>
  )
}

