"use client"

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import POIGrid from '@/components/POIGrid'
import { getAllPOIs } from '@/lib/data'
import { useSidebar } from '@/components/SidebarContext'

export default function MapsPage() {
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
        sidebarOpen ? 'lg:ml-[17%] lg:w-[83%]' : 'lg:ml-20 lg:w-[calc(100%-5rem)]'
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
          /* 일반 모드: Maps 페이지 콘텐츠 */
          <div className="px-6">
            <div className="container mx-auto">
              <h1 className="text-3xl font-bold text-white mb-8">Maps</h1>
              <p className="text-purple-300">지도 페이지입니다.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

