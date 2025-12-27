"use client"

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { KContent, getPOIById } from '@/lib/data'

interface CategoryCarouselProps {
  title: string
  items: KContent[]
}

export default function CategoryCarousel({ title, items }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const handleResize = () => checkScroll()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [items])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
    setTimeout(checkScroll, 300)
  }

  if (items.length === 0) return null

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-2xl font-bold text-white hover:text-purple-300 cursor-pointer transition-colors">
          {title}
        </h2>
        <button className="text-sm text-purple-300 hover:text-purple-200 font-medium transition-colors">
          모두 표시
        </button>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-14 flex items-center justify-center bg-gradient-to-r from-[#0a0a0f]/90 to-transparent hover:from-[#0a0a0f] transition-all"
            aria-label="이전"
          >
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto overflow-y-hidden px-6 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {items.map((item) => {
            const poi = getPOIById(item.poiId.$oid)
            return (
              <Link
                key={`${item.poiId.$oid}-${item.spotName}`}
                href={`/poi/${item.poiId.$oid}`}
                className="flex-shrink-0 w-[180px] group cursor-pointer no-underline"
              >
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 hover:from-purple-800/60 hover:to-pink-800/60 border border-purple-500/30 hover:border-purple-400/50 rounded-xl p-4 transition-all duration-200 h-full shadow-lg hover:shadow-purple-500/20">
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20 shadow-inner">
                      <img
                        src={`https://picsum.photos/seed/${item.poiId.$oid}-${item.spotName}/300/300`}
                        alt={item.spotName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-300 truncate transition-colors">
                    {item.spotName}
                  </h3>
                  <p className="text-purple-200 text-sm line-clamp-2">
                    {poi?.name || item.subName}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-14 flex items-center justify-center bg-gradient-to-l from-[#0a0a0f]/90 to-transparent hover:from-[#0a0a0f] transition-all"
            aria-label="다음"
          >
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
