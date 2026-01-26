"use client"

import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import AuthButton from '@/components/auth/AuthButton'
import { useSidebar } from '@/components/providers/SidebarContext'
import { useRoute } from '@/components/providers/RouteContext'
import { useSearchResult } from '@/components/providers/SearchContext'
import { getAllPOIs } from '@/lib/data/mock'
import { useKContents } from '@/lib/hooks/useKContents'

interface TopNavProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onSearchFocus?: () => void
  onBackToHome?: () => void
  isSearchMode?: boolean
  topNavClasses?: string
}

// 추천 검색어 목록
const RECOMMENDED_SEARCHES = [
  'COEX',
  'Myeongdong Street',
  'HYBE Insight',
  'Gwangjang Market',
  'BTS'
]

interface SearchResult {
  name: string
  type: 'poi' | 'content' // POI인지 Content(subName)인지 구분
  poiId?: string // POI일 때만 존재
  subName?: string // Content일 때만 존재
}

export default function TopNav({ 
  searchQuery = '', 
  onSearchChange, 
  onSearchFocus, 
  onBackToHome, 
  isSearchMode = false,
  topNavClasses
}: TopNavProps) {
  // Use provided classes or calculate fallback
  const router = useRouter()
  const { sidebarOpen } = useSidebar()
  const pathname = usePathname()
  const { selectedRoute } = useRoute()
  const { setSearchResult } = useSearchResult()
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Maps 페이지인지 확인
  const isMapsPage = pathname === '/maps' || pathname?.startsWith('/maps/route')
  
  const defaultClasses = useMemo(() => {
    const isRoutesPage = pathname === '/maps' || pathname?.startsWith('/maps/route')
    const hasRoutePanel = !isSearchMode && isRoutesPage && (selectedRoute || pathname?.startsWith('/maps/route'))
    const showSidePanel = !isSearchMode && ((sidebarOpen && (pathname === '/' || pathname === '/contents' || pathname?.startsWith('/contents'))) || hasRoutePanel)
    
    if (showSidePanel) {
      if (hasRoutePanel) {
        return sidebarOpen
          ? 'lg:left-[calc(12.75%+24rem)] lg:right-0'
          : 'lg:left-[calc(80px+24rem)] lg:right-0'
      }
      return 'lg:left-[calc(12.75%+16rem)] lg:right-0'
    }
    return sidebarOpen 
      ? 'lg:left-[12.75%] lg:right-0' 
      : 'lg:left-[80px] lg:right-0'
  }, [isSearchMode, sidebarOpen, pathname, selectedRoute])

  const navClasses = topNavClasses || defaultClasses

  // 관련 검색어 계산 (POI 이름, 주소, 태그, subName 포함)
  const { contents: allKContents } = useKContents()
  
  const relatedSearches = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const allPOIs = getAllPOIs()
    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []
    const addedNames = new Set<string>()
    
    // POI 이름, 주소, 태그에서 검색
    allPOIs.forEach(poi => {
      const nameMatch = poi.name.toLowerCase().includes(query)
      const addressMatch = poi.address.toLowerCase().includes(query)
      const tagMatch = poi.categoryTags.some(tag => tag.toLowerCase().includes(query))
      
      if ((nameMatch || addressMatch || tagMatch) && !addedNames.has(poi.name)) {
        results.push({ name: poi.name, type: 'poi', poiId: poi._id.$oid })
        addedNames.add(poi.name)
      }
    })
    
    // subName에서 검색 (Contents Detail로 이동)
    allKContents.forEach(content => {
      if (content.subName && content.subName.toLowerCase().includes(query) && !addedNames.has(content.subName)) {
        results.push({ name: content.subName, type: 'content', subName: content.subName })
        addedNames.add(content.subName)
      }
    })
    
    return results.slice(0, 5) // 최대 5개
  }, [searchQuery, allKContents])

  // 추천 검색어 결과 (POI ID 또는 subName 포함)
  const recommendedResults = useMemo(() => {
    const allPOIs = getAllPOIs()
    const results: SearchResult[] = []
    
    RECOMMENDED_SEARCHES.forEach(recommended => {
      // POI 이름으로 먼저 찾기
      const poi = allPOIs.find(p => p.name === recommended)
      if (poi) {
        results.push({ name: recommended, type: 'poi', poiId: poi._id.$oid })
      } else {
        // POI 이름이 아니면 subName으로 찾기
        const content = allKContents.find(c => c.subName === recommended)
        if (content) {
          results.push({ name: recommended, type: 'content', subName: recommended })
        }
      }
    })
    
    return results
  }, [allKContents])

  // 모든 검색 결과 (관련 검색어 + 추천 검색어)
  const allSearchResults = useMemo(() => {
    return [...relatedSearches, ...recommendedResults]
  }, [relatedSearches, recommendedResults])

  // 외부 클릭 시 포커스 해제 (단, 검색어가 있으면 유지하지 않음)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // 검색어가 없을 때만 포커스 해제
        if (!searchQuery.trim()) {
          setIsFocused(false)
          setSelectedIndex(-1)
        }
      }
    }

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isFocused, searchQuery])

  const handleSearchSelect = useCallback((result: SearchResult) => {
    if (isMapsPage) {
      // Maps 페이지일 때: 사이드 패널에 검색 결과 표시
      setSearchResult(result)
    } else {
      // 다른 페이지일 때: Detail Page로 이동
      if (result.type === 'poi' && result.poiId) {
        router.push(`/poi/${result.poiId}`)
      } else if (result.type === 'content' && result.subName) {
        router.push(`/contents/${encodeURIComponent(result.subName)}`)
      }
    }
    onSearchChange?.(result.name)
    setIsFocused(false)
    setSelectedIndex(-1)
  }, [isMapsPage, setSearchResult, router, onSearchChange])

  const handleSearchClick = useCallback((result: SearchResult) => {
    handleSearchSelect(result)
  }, [handleSearchSelect])

  const handleFocus = () => {
    setIsFocused(true)
    setSelectedIndex(-1)
    onSearchFocus?.()
  }

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < allSearchResults.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < allSearchResults.length) {
          handleSearchSelect(allSearchResults[selectedIndex])
        } else if (searchQuery.trim()) {
          // 검색어가 있으면 첫 번째 결과 선택
          if (allSearchResults.length > 0) {
            handleSearchSelect(allSearchResults[0])
          }
        }
      } else if (e.key === 'Escape') {
        setIsFocused(false)
        setSelectedIndex(-1)
      }
    }

    if (isFocused) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isFocused, selectedIndex, allSearchResults, searchQuery, handleSearchSelect])

  return (
    <>
      <div className={`h-16 fixed top-0 z-40 flex items-center gap-4 px-6 transition-all duration-300 ${navClasses}`}>
        {/* Search, Favorites, Auth - aligned to the right */}
        <div className="flex items-center gap-3 ml-auto" ref={searchRef}>
          {/* Search box */}
          <div className="relative w-[360px]">
            <input
              ref={inputRef}
              type="text"
              placeholder="FIND YOUR KOREA"
              value={searchQuery}
              onChange={(e) => {
                const newValue = e.target.value
                onSearchChange?.(newValue)
                setSelectedIndex(-1)
                // 검색어를 입력할 때 포커스 유지 (드롭다운 표시)
                if (!isFocused) {
                  setIsFocused(true)
                }
                // 검색어를 지워도 SearchContext는 유지 (사이드 패널 유지)
              }}
              onFocus={handleFocus}
              className="w-full px-6 py-2 pl-12 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 placeholder-white/70 dark:placeholder-gray-500"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white dark:text-gray-900"
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

            {/* 검색어 드롭다운 패널 */}
            {isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* 관련 검색어 */}
                {searchQuery.trim() && relatedSearches.length > 0 && (
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Related Searches
                    </div>
                    <div className="space-y-1">
                      {relatedSearches.map((result, index) => {
                        const globalIndex = index
                        const isSelected = selectedIndex === globalIndex
                        return (
                          <button
                            key={index}
                            onClick={() => handleSearchClick(result)}
                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                              isSelected 
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              {result.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                {/* 추천 검색어 */}
                <div className="p-4">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Recommended Searches
                  </div>
                  <div className="space-y-1">
                    {recommendedResults.map((result, index) => {
                      const globalIndex = relatedSearches.length + index
                      const isSelected = selectedIndex === globalIndex
                      return (
                        <button
                          key={index}
                          onClick={() => handleSearchClick(result)}
                          className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                            isSelected 
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {result.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Favorites button */}
          <button
            onClick={() => {
              // TODO: Navigate to favorites page or open modal
              console.log('Favorites clicked')
            }}
            className="p-2 rounded-full transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Favorites"
            title="Favorites"
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
    </>
  )
}

