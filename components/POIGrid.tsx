"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { POI, getAllKContents, getKContentsByPOIId, getContentCategory } from '@/lib/data'

interface POIGridProps {
  pois: POI[]
}

export default function POIGrid({ pois }: POIGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [selectedKContents, setSelectedKContents] = useState<string[]>([])
  
  const allKContents = getAllKContents()
  
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
    { key: 'kpop', label: 'K-Pop' },
    { key: 'kbeauty', label: 'K-Beauty' },
    { key: 'kfood', label: 'K-Food' },
    { key: 'kfestival', label: 'K-Festival' },
  ]

  // 필터링된 POI
  const filteredPois = useMemo(() => {
    return pois.filter(poi => {
      // 검색어 필터
      const matchesSearch = searchQuery === '' || 
        poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poi.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getKContentsByPOIId(poi._id.$oid).some(content => 
          content.spotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          content.subName.toLowerCase().includes(searchQuery.toLowerCase())
        )

      // 해시태그 필터
      const matchesHashtag = selectedHashtags.length === 0 || 
        getKContentsByPOIId(poi._id.$oid).some(content =>
          selectedHashtags.includes(content.subName)
        )

      // K-Contents 카테고리 필터
      const matchesKContent = selectedKContents.length === 0 ||
        getKContentsByPOIId(poi._id.$oid).some(content => {
          const category = getContentCategory(content)
          return category && selectedKContents.includes(category)
        })

      return matchesSearch && matchesHashtag && matchesKContent
    })
  }, [pois, searchQuery, selectedHashtags, selectedKContents])

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    )
  }

  const toggleKContent = (category: string) => {
    setSelectedKContents(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="w-full">
      {/* 검색창 */}
      <div className="mb-6 px-6">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="장소, 스팟, 해시태그로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-purple-900/40 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/30 transition-all"
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

      {/* K-Contents 카테고리 필터 */}
      <div className="mb-4 px-6">
        <div className="flex flex-wrap gap-2">
          {kContentCategories.map(category => {
            const isSelected = selectedKContents.includes(category.key)
            return (
              <button
                key={category.key}
                onClick={() => toggleKContent(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:border-purple-400/50'
                }`}
              >
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 해시태그 필터 (5개만) */}
      <div className="mb-6 px-6">
        <div className="flex flex-wrap gap-2">
          {allHashtags.map(hashtag => {
            const isSelected = selectedHashtags.includes(hashtag)
            return (
              <button
                key={hashtag}
                onClick={() => toggleHashtag(hashtag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:border-purple-400/50'
                }`}
              >
                #{hashtag}
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
