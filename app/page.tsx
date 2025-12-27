"use client"

import AuthButton from '@/components/AuthButton'
import PackageCarousel from '@/components/PackageCarousel'
import POIGrid from '@/components/POIGrid'
import { getAllPOIs, getAllPackages } from '@/lib/data'

export default function Home() {
  const allPOIs = getAllPOIs()
  const allPackages = getAllPackages()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">B-4K</h1>
          <AuthButton />
        </div>
      </header>

      <main className="w-full py-8">        
        <div className="w-full">
          {/* 패키지 추천 섹션 */}
          <PackageCarousel packages={allPackages} />
          
          {/* POI 그리드 */}
          <POIGrid pois={allPOIs} />
        </div>
      </main>
    </div>
  )
}
