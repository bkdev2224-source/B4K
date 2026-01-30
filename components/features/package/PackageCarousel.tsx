"use client"

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { TravelPackageJson as TravelPackage } from '@/types'

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">
          Recommended Packages
        </h2>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-14 flex items-center justify-center bg-gradient-to-r from-gray-50/90 dark:from-gray-900/90 to-transparent hover:from-gray-50 dark:hover:from-gray-900 transition-all"
            aria-label="Previous"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200 h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    fill
                    sizes="360px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 right-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold rounded-full">
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {pkg.concept}
                  </p>
                  
                  {/* Highlights */}
                  {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pkg.highlights.slice(0, 4).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 text-xs"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Category */}
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
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
            className="absolute right-0 top-0 bottom-0 z-10 w-14 flex items-center justify-center bg-gradient-to-l from-gray-50/90 dark:from-gray-900/90 to-transparent hover:from-gray-50 dark:hover:from-gray-900 transition-all"
            aria-label="Next"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

