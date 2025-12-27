"use client"

import TopNav from '@/components/TopNav'
import MainCarousel from '@/components/MainCarousel'
import POIGrid from '@/components/POIGrid'
import { getAllPOIs } from '@/lib/data'

export default function Home() {
  const allPOIs = getAllPOIs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      <TopNav />

      <main className="w-full pt-16">        
        {/* 메인 캐러셀 */}
        <MainCarousel />
        
        <div className="w-full pb-8">
          {/* POI 그리드 */}
          <POIGrid pois={allPOIs} />
        </div>
      </main>
    </div>
  )
}
