"use client"

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import MainCarousel from '@/components/MainCarousel'
import BestPackages from '@/components/BestPackages'
import EditorRecommendations from '@/components/EditorRecommendations'
import SeoulExploration from '@/components/SeoulExploration'
import SeasonalRecommendations from '@/components/SeasonalRecommendations'
import POIGrid from '@/components/POIGrid'
import { getAllPOIs } from '@/lib/data'
import { useSidebar } from '@/components/SidebarContext'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { sidebarOpen } = useSidebar()
  const allPOIs = getAllPOIs()

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  // blur 이벤트 제거 - 명시적으로 홈 버튼이나 뒤로가기 버튼을 눌러야 홈으로 이동
  // const handleSearchBlur = () => {
  //   // 검색어가 없을 때만 포커스 해제
  //   if (!searchQuery) {
  //     setIsSearchFocused(false)
  //   }
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]">
      <Sidebar />
      <TopNav 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        onSearchFocus={handleSearchFocus}
        onBackToHome={() => {
          setIsSearchFocused(false)
          setSearchQuery('')
        }}
      />

      <main className={`pt-16 transition-all duration-300 ${
        sidebarOpen ? 'ml-[17%] w-[83%]' : 'ml-0 w-full'
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
          /* 일반 모드: 메인 페이지 콘텐츠 */
          <>
            {/* 메인 캐러셀 */}
            <MainCarousel />
            
            {/* B4K Best 패키지 추천 */}
            <BestPackages />
            
            {/* 에디터 추천 여행 */}
            <EditorRecommendations />
            
            {/* 서울 탐방하기 */}
            <SeoulExploration />
            
            {/* 시즌별 여행 추천 */}
            <SeasonalRecommendations />
          </>
        )}
      </main>
    </div>
  )
}
