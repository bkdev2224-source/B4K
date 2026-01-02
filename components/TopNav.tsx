"use client"

import AuthButton from './AuthButton'
import { useSidebar } from './SidebarContext'

interface TopNavProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onSearchFocus?: () => void
  onBackToHome?: () => void
}

export default function TopNav({ searchQuery = '', onSearchChange, onSearchFocus, onBackToHome }: TopNavProps) {
  const { sidebarOpen } = useSidebar()

  return (
    <>
      <div className={`bg-purple-900/40 backdrop-blur-sm h-16 fixed top-0 z-40 flex items-center gap-4 px-6 border-b border-purple-400/30 transition-all duration-300 ${
        sidebarOpen ? 'lg:left-[17%] lg:right-0' : 'lg:left-20 lg:right-0'
      }`}>
        {/* 즐겨찾기 버튼과 AuthButton - 맨 오른쪽 고정 */}
        <div className="flex items-center gap-3 ml-auto">
          {/* 즐겨찾기 버튼 */}
          <button
            onClick={() => {
              // TODO: 즐겨찾기 페이지로 이동 또는 모달 열기
              console.log('즐겨찾기 클릭')
            }}
            className="p-2 text-white hover:bg-purple-900/30 rounded-full transition-colors"
            aria-label="Favorites"
            title="즐겨찾기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
          
          <AuthButton />
        </div>
      </div>
      
      {/* 검색창 - 화면 전체 기준으로 중앙에 고정 (사이드바 영향 없음) - 항상 표시 */}
      <div className="fixed left-1/2 -translate-x-1/2 top-4 z-50 w-full max-w-2xl pointer-events-none">
        <div className="relative pointer-events-auto">
          <input
            type="text"
            placeholder="FIND YOUR KOREA"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange?.(e.target.value)
            }}
            onFocus={() => {
              onSearchFocus?.()
            }}
            className="w-full px-6 py-2 pl-12 bg-purple-800/70 border-2 border-purple-400/50 rounded-xl text-white text-sm placeholder-purple-200/70 focus:outline-none focus:border-purple-300/70 focus:ring-2 focus:ring-purple-400/50 transition-all"
          />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}
    </>
  )
}

