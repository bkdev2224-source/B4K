"use client"

import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import PageLayout from '@/components/layout/PageLayout'
import { getPOIById } from '@/lib/data/mock'
import { useKContentsByPOIId } from '@/lib/hooks/useKContents'
import { useSearchResult } from '@/components/providers/SearchContext'
import { useCart } from '@/components/providers/CartContext'
import { useState } from 'react'

export default function POIDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { setSearchResult } = useSearchResult()
  const { addToCart, removeFromCart, isInCart } = useCart()
  const id = params?.id as string || ''
  
  const poi = getPOIById(id)
  const { contents: kContents } = useKContentsByPOIId(id)
  const cartItemId = poi ? `poi-${poi._id.$oid}` : ''
  const inCart = cartItemId ? isInCart(cartItemId) : false

  const handleMapClick = () => {
    if (poi) {
      // SearchContext에 POI 검색 결과 저장
      setSearchResult({
        name: poi.name,
        type: 'poi',
        poiId: poi._id.$oid
      })
      // Maps 페이지로 이동
      router.push('/maps')
    }
  }

  const handleCartClick = () => {
    if (poi) {
      if (inCart) {
        removeFromCart(cartItemId)
      } else {
        addToCart({
          id: cartItemId,
          name: poi.name,
          type: 'poi',
          poiId: poi._id.$oid
        })
      }
    }
  }

  if (!poi) {
    return (
      <PageLayout showSidePanel={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Location Not Found</h1>
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showSidePanel={false}>
        {/* Banner image */}
        <div className="relative h-96">
          <Image
            src={`https://picsum.photos/seed/${poi._id.$oid}/1920/600`}
            alt={poi.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
            <div className="container mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* 1. 이름 */}
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">{poi.name}</h1>
                  
                  {/* 2. 카테고리, 장소 개수 */}
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-white/90 text-sm md:text-base">
                    <div className="flex gap-2 flex-wrap">
                      {poi.categoryTags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-white/70">·</span>
                    <span>{kContents.length} spots</span>
                  </div>

                  {/* 3. Location Information */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                      <div className="space-y-1">
                        <p className="text-white/80 text-xs font-medium mb-1">📍 Address</p>
                        <p className="text-white text-sm">{poi.address}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/80 text-xs font-medium mb-1">💰 Entry Fee</p>
                        <p className="text-white text-sm">{poi.entryFee}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/80 text-xs font-medium mb-1">🕐 Opening Hours</p>
                        <p className="text-white text-sm">{poi.openingHours}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/80 text-xs font-medium mb-1">📞 Reservation Required</p>
                        <p className="text-white text-sm">{poi.needsReservation ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 액션 버튼들 */}
                <div className="ml-4 flex gap-3">
                  {/* 장바구니 버튼 */}
                  <button
                    onClick={handleCartClick}
                    className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                      inCart 
                        ? 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200' 
                        : 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30'
                    }`}
                    aria-label={inCart ? "Remove from Cart" : "Add to Cart"}
                    title={inCart ? "Remove from Cart" : "Add to Cart"}
                  >
                    <svg className={`w-7 h-7 transition-colors ${inCart ? 'text-white dark:text-gray-900' : 'text-white'}`} fill={inCart ? "currentColor" : "none"} stroke={inCart ? "none" : "currentColor"} viewBox="0 0 24 24">
                      {inCart ? (
                        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      )}
                    </svg>
                  </button>
                  {/* 지도 아이콘 */}
                  <button
                    onClick={handleMapClick}
                    className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    aria-label="View on Map"
                    title="View on Map"
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="container mx-auto px-6 pt-8 pb-16">
          {/* K-Contents section */}
          {kContents.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 px-8 flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Spots to Visit
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kContents.map((content, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {/* Use spotName as title */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{content.spotName}</h3>
                        {/* Use subName as hashtag */}
                        {content.subName && (
                          <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
                            #{content.subName}
                          </span>
                        )}
                      </div>
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        <Image
                          src={`https://picsum.photos/seed/${poi._id.$oid}-${content.spotName}/100/100`}
                          alt={content.spotName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {content.description}
                    </p>
                    {content.tags && content.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {content.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </PageLayout>
  )
}
