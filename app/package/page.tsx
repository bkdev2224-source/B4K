"use client"

import TopNav from '@/components/TopNav'
import PackageCarousel from '@/components/PackageCarousel'
import { getAllPackages } from '@/lib/data'

export default function PackagePage() {
  const allPackages = getAllPackages()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      <TopNav />

      <main className="w-full pt-20 pb-8">        
        <div className="w-full">
          {/* 패키지 추천 섹션 */}
          <PackageCarousel packages={allPackages} />
        </div>
      </main>
    </div>
  )
}

