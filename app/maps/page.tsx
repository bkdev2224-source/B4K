"use client"

import TopNav from '@/components/TopNav'

export default function MapsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      <TopNav />

      <main className="w-full pt-20 pb-8 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Maps</h1>
          <p className="text-purple-300">지도 페이지입니다.</p>
        </div>
      </main>
    </div>
  )
}

