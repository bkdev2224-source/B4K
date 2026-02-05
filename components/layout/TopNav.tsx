"use client"

import { useDeferredValue, useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import AuthButton from '@/components/auth/AuthButton'
import { useSidebar } from '@/components/providers/SidebarContext'
import { useRoute } from '@/components/providers/RouteContext'
import { useSearchResult } from '@/components/providers/SearchContext'
import { useLanguage } from '@/components/providers/LanguageContext'
import { getPOIName, getKContentSubName } from '@/lib/utils/locale'
import { useKContents } from '@/lib/hooks/useKContents'
import { usePOIs } from '@/lib/hooks/usePOIs'

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
  const { sidebarOpen, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const { selectedRoute } = useRoute()
  const { setSearchResult } = useSearchResult()
  const { language, setLanguage } = useLanguage()
  
  const searchPlaceholder = language === 'ko' ? '당신의 한국을 찾아보세요…' : 'FIND YOUR KOREA…'
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const searchInputId = 'topnav-search-input'
  const listboxId = 'topnav-search-results'
  const optionId = (idx: number) => `topnav-search-option-${idx}`
  const deferredSearchQuery = useDeferredValue(searchQuery)
  
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
  // Avoid eager fetching on every page load; only load data when search is used.
  const shouldLoadSearchData = isFocused || Boolean(searchQuery.trim())
  const { contents: allKContents, loading: kContentsLoading } = useKContents({ enabled: shouldLoadSearchData })
  const { pois: allPOIs, loading: poisLoading } = usePOIs({ enabled: shouldLoadSearchData })
  const isSearchDataLoading = shouldLoadSearchData && (kContentsLoading || poisLoading)
  
  const relatedSearches = useMemo(() => {
    if (!deferredSearchQuery.trim()) return []
    
    const query = deferredSearchQuery.toLowerCase()
    const results: SearchResult[] = []
    const addedNames = new Set<string>()
    
    // POI 이름, 주소, 태그에서 검색
    allPOIs.forEach(poi => {
      const poiName = getPOIName(poi, language)
      const nameMatch = poiName.toLowerCase().includes(query) || 
                        poi.name.name_en.toLowerCase().includes(query) ||
                        poi.name.name_ko.toLowerCase().includes(query)
      const addressEn = poi.address.address_en.toLowerCase()
      const addressKo = poi.address.address_ko.toLowerCase()
      const addressMatch = addressEn.includes(query) || addressKo.includes(query)
      const tagMatch = poi.categoryTags.some(tag => tag.toLowerCase().includes(query))
      
      if ((nameMatch || addressMatch || tagMatch) && !addedNames.has(poiName)) {
        results.push({ name: poiName, type: 'poi', poiId: poi._id.$oid })
        addedNames.add(poiName)
      }
    })
    
    // subName에서 검색 (Contents Detail로 이동)
    allKContents.forEach(content => {
      const subNameEn = typeof content.subName === 'string' ? content.subName : content.subName.subName_en
      const subNameKo = typeof content.subName === 'string' ? '' : content.subName.subName_ko
      const subNameDisplay = getKContentSubName(content, language)
      
      if (subNameEn && (subNameEn.toLowerCase().includes(query) || subNameKo.toLowerCase().includes(query)) && !addedNames.has(subNameEn)) {
        results.push({ name: subNameDisplay, type: 'content', subName: subNameEn })
        addedNames.add(subNameEn)
      }
    })
    
    return results.slice(0, 5) // 최대 5개
  }, [deferredSearchQuery, allKContents, allPOIs])

  // 추천 검색어 결과 (POI ID 또는 subName 포함)
  const recommendedResults = useMemo(() => {
    const results: SearchResult[] = []
    
    RECOMMENDED_SEARCHES.forEach(recommended => {
      // POI 이름으로 먼저 찾기 (name_en 또는 name_ko에서 검색)
      const poi = allPOIs.find(p => p.name.name_en === recommended || p.name.name_ko === recommended)
      if (poi) {
        results.push({ name: getPOIName(poi, language), type: 'poi', poiId: poi._id.$oid })
      } else {
        // POI 이름이 아니면 subName으로 찾기
        const content = allKContents.find(c => {
          const subNameEn = typeof c.subName === 'string' ? c.subName : c.subName.subName_en
          return subNameEn === recommended
        })
        if (content) {
          const subNameEn = typeof content.subName === 'string' ? content.subName : content.subName.subName_en
          results.push({ name: getKContentSubName(content, language), type: 'content', subName: subNameEn })
        }
      }
    })
    
    return results
  }, [allKContents, allPOIs])

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
      // 언어 메뉴 외부 클릭 감지
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false)
      }
    }

    if (isFocused || isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isFocused, searchQuery, isLanguageMenuOpen])

  const handleSearchSelect = useCallback((result: SearchResult) => {
    if (isMapsPage) {
      // Maps 페이지일 때: 사이드 패널에 검색 결과 표시
      setSearchResult(result)
    } else {
      // 다른 페이지일 때: Detail Page로 이동
      if (result.type === 'poi' && result.poiId) {
        router.push(`/poi/${result.poiId}`)
      } else if (result.type === 'content' && result.subName) {
        router.push(`/contents/${result.subName}`)
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
      <div className={`h-16 fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 transition-[left,right] duration-300 ${navClasses}`}>
        {/* Left: logo + search */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            type="button"
            onClick={toggleSidebar}
            className="focus-ring lg:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative w-full sm:max-w-[520px] lg:max-w-[360px] min-w-0" ref={searchRef}>
            <label htmlFor={searchInputId} className="sr-only">
              Search places and contents
            </label>
            <input
              id={searchInputId}
              ref={inputRef}
              type="text"
              placeholder={searchPlaceholder}
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
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isFocused}
              aria-controls={listboxId}
              aria-activedescendant={selectedIndex >= 0 ? optionId(selectedIndex) : undefined}
              className="focus-ring w-full px-4 sm:px-6 py-2 pl-10 sm:pl-12 rounded-full text-sm transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 border border-gray-300/80 dark:border-gray-700/70"
            />
            <svg
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
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
              <div
                id={listboxId}
                role="listbox"
                aria-label="Search results"
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
              >
                <div role="status" aria-live="polite" className="sr-only">
                  {searchQuery.trim()
                    ? `Showing ${allSearchResults.length} results.`
                    : `Showing ${recommendedResults.length} recommended searches.`}
                </div>
                {/* 관련 검색어 */}
                {searchQuery.trim() && relatedSearches.length > 0 && (
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
                      Related Searches
                    </div>
                    <div className="space-y-1">
                      {relatedSearches.map((result, index) => {
                        const globalIndex = index
                        const isSelected = selectedIndex === globalIndex
                        return (
                          <button
                            type="button"
                            key={`${result.type}-${result.poiId ?? result.subName ?? result.name}`}
                            onClick={() => handleSearchClick(result)}
                            id={optionId(globalIndex)}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={-1}
                            className={`focus-ring w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                              isSelected 
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Recommended Searches
                  </div>
                  <div className="space-y-1">
                    {isSearchDataLoading && recommendedResults.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                        Loading suggestions…
                      </div>
                    )}
                    {recommendedResults.map((result, index) => {
                      const globalIndex = relatedSearches.length + index
                      const isSelected = selectedIndex === globalIndex
                      return (
                        <button
                          type="button"
                          key={`${result.type}-${result.poiId ?? result.subName ?? result.name}`}
                          onClick={() => handleSearchClick(result)}
                          id={optionId(globalIndex)}
                          role="option"
                          aria-selected={isSelected}
                          tabIndex={-1}
                          className={`focus-ring w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                            isSelected 
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
        </div>

        {/* Right: language selector + account button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Language Selector */}
          <div className="relative" ref={languageMenuRef}>
            <button
              type="button"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="focus-ring flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-[transform,background-color] hover:scale-105"
              aria-label="Select language"
              aria-haspopup="menu"
              aria-expanded={isLanguageMenuOpen}
            >
              <span className="text-xs font-semibold">{language === 'ko' ? 'KO' : 'EN'}</span>
            </button>

            {isLanguageMenuOpen && (
              <div
                role="menu"
                aria-label="Language options"
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
              >
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('ko')
                      setIsLanguageMenuOpen(false)
                      // 서버 컴포넌트를 다시 렌더링하여 언어 변경 반영
                      router.refresh()
                    }}
                    className={`focus-ring w-full text-left px-4 py-2 text-sm transition-colors ${
                      language === 'ko'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    role="menuitem"
                  >
                    한국어
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en')
                      setIsLanguageMenuOpen(false)
                      // 서버 컴포넌트를 다시 렌더링하여 언어 변경 반영
                      router.refresh()
                    }}
                    className={`focus-ring w-full text-left px-4 py-2 text-sm transition-colors ${
                      language === 'en'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    role="menuitem"
                  >
                    English
                  </button>
                </div>
              </div>
            )}
          </div>

          <AuthButton />
        </div>
      </div>
    </>
  )
}

