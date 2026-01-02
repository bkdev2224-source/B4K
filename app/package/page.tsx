"use client"

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import PackageCarousel from '@/components/PackageCarousel'
import POIGrid from '@/components/POIGrid'
import { getAllPackages, getAllPOIs } from '@/lib/data'
import { useSidebar } from '@/components/SidebarContext'

export default function PackagePage() {
  const allPackages = getAllPackages()
  const allPOIs = getAllPOIs()
  const { sidebarOpen } = useSidebar()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#2a1a3e] to-[#1a1a2e]">
      <Sidebar />
      <TopNav 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchFocus={handleSearchFocus}
      />

      <main className={`pt-16 pb-8 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-[12.75%] lg:w-[87.25%]' : 'lg:ml-[80px] lg:w-[calc(100%-80px)]'
      }`}>
        {isSearchFocused || searchQuery ? (
          /* 검색 모드: POI 그리드 표시 */
          <div className="w-full pb-8">
            <POIGrid 
              pois={allPOIs} 
              searchQuery={searchQuery} 
              isSearchFocused={isSearchFocused}
              onSearchChange={setSearchQuery}
              onBack={() => {
                setIsSearchFocused(false)
                setSearchQuery('')
              }}
            />
          </div>
        ) : (
          /* 일반 모드: 패키지 페이지 콘텐츠 */
          <div className="w-full">
            {/* 패키지 추천 섹션 */}
            <PackageCarousel packages={allPackages} />
          </div>
        )}
      </main>
    </div>
  )
}

