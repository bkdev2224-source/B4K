"use client"

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { TravelPackage } from '@/lib/data'

interface PackageCarouselProps {
  packages: TravelPackage[]
}

export default function PackageCarousel({ packages }: PackageCarouselProps) {
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
  }, [packages])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 400
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
    setTimeout(checkScroll, 300)
  }

  if (packages.length === 0) return null

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-2xl font-bold text-white hover:text-purple-300 cursor-pointer transition-colors">
          Recommended Packages
        </h2>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-14 flex items-center justify-center bg-gradient-to-r from-[#0a0a0f]/90 to-transparent hover:from-[#0a0a0f] transition-all"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto overflow-y-hidden px-6 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {packages.map((pkg) => (
            <Link
              key={pkg._id.$oid}
              href={`/package/${pkg._id.$oid}`}
              className="flex-shrink-0 w-[360px] group cursor-pointer no-underline"
            >
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-400/50 hover:from-purple-800/60 hover:to-pink-800/60 transition-all duration-200 h-full shadow-lg hover:shadow-purple-500/20">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                        {pkg.duration} days
                      </span>
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {pkg.cities.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                    {pkg.concept}
                  </p>
                  
                  {/* Highlights */}
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pkg.highlights.slice(0, 4).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-500/30 border border-purple-400/50 rounded-md text-purple-200 text-xs"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Category */}
                  <div className="flex items-center gap-2 text-purple-300 text-sm">
                    <span>{pkg.cities.length} cities</span>
                    <span>·</span>
                    <span>{pkg.itinerary.length} day itinerary</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-14 flex items-center justify-center bg-gradient-to-l from-[#0a0a0f]/90 to-transparent hover:from-[#0a0a0f] transition-all"
            aria-label="Next"
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

