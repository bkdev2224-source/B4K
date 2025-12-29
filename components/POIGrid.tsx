"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { POI, getAllKContents, getKContentsByPOIId, getContentCategory } from '@/lib/data'

interface POIGridProps {
  pois: POI[]
  searchQuery?: string
  isSearchFocused?: boolean
  onSearchChange?: (query: string) => void
  onBack?: () => void
}

export default function POIGrid({ pois, searchQuery: externalSearchQuery = '', isSearchFocused = false, onSearchChange, onBack }: POIGridProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const searchQuery = externalSearchQuery || internalSearchQuery
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [selectedKContents, setSelectedKContents] = useState<string[]>([])
  const router = useRouter()
  
  const allKContents = getAllKContents()
  
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      // onBack이 없으면 브라우저 뒤로가기
      router.back()
    }
  }
  
  // 카테고리 이름 매핑
  const categoryMap: { [key: string]: string } = {
    'k-pop': 'kpop',
    'kpop': 'kpop',
    'k-beauty': 'kbeauty',
    'kbeauty': 'kbeauty',
    'k-food': 'kfood',
    'kfood': 'kfood',
    'k-festival': 'kfestival',
    'kfestival': 'kfestival',
  }
  
  // 검색어에서 모든 카테고리 자동 감지 (다중 선택 지원)
  const detectedCategories = useMemo(() => {
    if (!searchQuery) return []
    const lowerQuery = searchQuery.toLowerCase().trim()
    const detected: string[] = []
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerQuery.includes(key) && !detected.includes(value)) {
        detected.push(value)
      }
    }
    return detected
  }, [searchQuery])
  
  // 검색어에서 카테고리 이름과 해시태그를 제거한 실제 검색어 추출
  const actualSearchQuery = useMemo(() => {
    if (!searchQuery) return ''
    let cleaned = searchQuery
    // 카테고리 이름 제거
    for (const [key] of Object.entries(categoryMap)) {
      const regex = new RegExp(`#?${key.replace('-', '[- ]?')}`, 'gi')
      cleaned = cleaned.replace(regex, '')
    }
    // 해시태그 제거 (#로 시작하는 단어)
    cleaned = cleaned.replace(/#\w+/g, '')
    // 공백 정리
    cleaned = cleaned.replace(/\s+/g, ' ').trim()
    return cleaned
  }, [searchQuery])
  
  // 검색어가 카테고리 이름이면 해당 카테고리 자동 선택
  // 검색창이 포커스되어 있으면 필터 적용
  // 다중 선택 가능하도록 수정
  const effectiveSelectedKContents = useMemo(() => {
    // 검색창이 포커스되지 않고 검색어도 없으면 필터 비활성화
    if (!isSearchFocused && !searchQuery) {
      return []
    }
    
    // 선택된 카테고리 목록 생성 (다중 선택 지원)
    let result = [...selectedKContents]
    
    // 검색어에서 감지된 모든 카테고리 추가 (중복 제거)
    detectedCategories.forEach(category => {
      if (!result.includes(category)) {
        result.push(category)
      }
    })
    
    return result
  }, [detectedCategories, selectedKContents, isSearchFocused, searchQuery])
  
  // 모든 해시태그 추출 (subName들) - 5개만
  const allHashtags = useMemo(() => {
    const hashtags = new Set<string>()
    allKContents.forEach(content => {
      if (content.subName) {
        hashtags.add(content.subName)
      }
    })
    return Array.from(hashtags).sort().slice(0, 5)
  }, [allKContents])

  // K-Contents 카테고리
  const kContentCategories = [
    { 
      key: 'kpop', 
      label: 'K-Pop',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    { 
      key: 'kbeauty', 
      label: 'K-Beauty',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    { 
      key: 'kfood', 
      label: 'K-Food',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      )
    },
    { 
      key: 'kfestival', 
      label: 'K-Festival',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      )
    },
  ]

  // 필터링된 POI
  const filteredPois = useMemo(() => {
    return pois.filter(poi => {
      // 검색어 필터 - subName 중심으로 검색 (실제 검색어가 있을 때만)
      // 카테고리 이름이 포함된 경우는 카테고리 필터링으로 처리하므로 검색어 필터는 실제 검색어만 사용
      const matchesSearch = actualSearchQuery === '' || 
        getKContentsByPOIId(poi._id.$oid).some(content => 
          content.subName && content.subName.toLowerCase().includes(actualSearchQuery.toLowerCase())
        )

      // 해시태그 필터
      const matchesHashtag = selectedHashtags.length === 0 || 
        getKContentsByPOIId(poi._id.$oid).some(content =>
          selectedHashtags.includes(content.subName)
        )

      // K-Contents 카테고리 필터 (다중 선택 지원)
      // effectiveSelectedKContents가 비어있으면 모든 카테고리 표시
      // 하나 이상 선택되어 있으면 선택된 카테고리 중 하나라도 포함된 POI만 표시
      const matchesKContent = effectiveSelectedKContents.length === 0 ||
        getKContentsByPOIId(poi._id.$oid).some(content => {
          const category = getContentCategory(content)
          return category && effectiveSelectedKContents.includes(category)
        })

      return matchesSearch && matchesHashtag && matchesKContent
    })
  }, [pois, actualSearchQuery, selectedHashtags, effectiveSelectedKContents])

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    )
  }

  const toggleKContent = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      'kpop': 'K-Pop',
      'kbeauty': 'K-Beauty',
      'kfood': 'K-Food',
      'kfestival': 'K-Festival'
    }
    
    const isCurrentlySelected = selectedKContents.includes(category)
    const categoryTag = `#${categoryLabels[category]}`
    
    if (isCurrentlySelected) {
      // 이미 선택된 경우 해제
      setSelectedKContents(prev => prev.filter(c => c !== category))
      // 검색창에서도 제거
      if (onSearchChange) {
        const updatedQuery = searchQuery
          .replace(new RegExp(`\\s*${categoryTag}\\s*`, 'g'), ' ')
          .replace(/\s+/g, ' ')
          .trim()
        onSearchChange(updatedQuery)
      }
    } else {
      // 선택되지 않은 경우 추가
      setSelectedKContents(prev => [...prev, category])
      // 검색창에 추가
      if (onSearchChange) {
        const newQuery = searchQuery ? `${searchQuery} ${categoryTag}`.trim() : categoryTag
        onSearchChange(newQuery)
      }
    }
  }

  return (
    <div className="w-full">
      {/* 뒤로가기 버튼 - 검색 상태일 때만 표시 */}
      {isSearchFocused && (
        <div className="mb-4 px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400/50 rounded-lg transition-all"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">뒤로가기</span>
          </button>
        </div>
      )}
      
      {/* K-Contents 카테고리 필터 */}
      <div className="mb-8 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {kContentCategories.map(category => {
            const isSelected = effectiveSelectedKContents.includes(category.key)
            return (
              <button
                key={category.key}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleKContent(category.key)
                }}
                type="button"
                className={`relative aspect-square rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400 shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-purple-900/40 border-2 border-purple-500/30 text-purple-200 hover:border-purple-400/50 hover:bg-purple-900/60'
                }`}
              >
                <div className={`mb-3 ${isSelected ? 'text-purple-300 drop-shadow-lg' : 'text-purple-400'}`}>
                  {category.icon}
                </div>
                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-purple-200'}`}>
                  {category.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* POI 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
        {filteredPois.map(poi => {
          const kContents = getKContentsByPOIId(poi._id.$oid)
          const allSubNames = [...new Set(kContents.map(c => c.subName))].slice(0, 5)
          
          return (
            <Link
              key={poi._id.$oid}
              href={`/poi/${poi._id.$oid}`}
              className="group no-underline"
            >
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 hover:from-purple-800/60 hover:to-pink-800/60 transition-all duration-200 h-full shadow-lg hover:shadow-purple-500/20">
                {/* 이미지 */}
                <div className="relative mb-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                    <img
                      src={`https://picsum.photos/seed/${poi._id.$oid}/400/400`}
                      alt={poi.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* 제목 (POI 이름) */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {poi.name}
                  </h3>
                </div>

                {/* 해시태그 (subName들) - 최대 5개 */}
                {allSubNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {allSubNames.map(subName => (
                      <span
                        key={subName}
                        className="px-2 py-1 bg-purple-500/30 border border-purple-400/50 rounded-md text-purple-200 text-xs"
                      >
                        #{subName}
                      </span>
                    ))}
                  </div>
                )}

                {/* 장소 정보 */}
                <div className="space-y-1">
                  <p className="text-purple-300/70 text-xs line-clamp-1">
                    {poi.address}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-purple-300 text-xs">
                      {kContents.length}개 스팟
                    </span>
                    {poi.categoryTags.length > 0 && (
                      <>
                        <span className="text-purple-500">·</span>
                        <span className="text-purple-300 text-xs">
                          {poi.categoryTags.slice(0, 2).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filteredPois.length === 0 && (
        <div className="text-center py-12 px-6">
          <p className="text-purple-300 text-lg">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}
