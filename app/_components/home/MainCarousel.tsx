"use client"

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const images = [
  {
    id: 1,
    url: '/image/maincarousel/1.jpg',
    title: 'K-Pop',
    description: 'Experience Korea\'s music and dance culture that captivates the world'
  },
  {
    id: 2,
    url: '/image/maincarousel/2.jpg',
    title: 'K-Beauty',
    description: 'Discover beauty with innovative cosmetics and skincare'
  },
  {
    id: 3,
    url: '/image/maincarousel/4.jpg',
    title: 'K-Food',
    description: 'Taste Korea\'s unique cuisine that combines flavor and health'
  },
  {
    id: 4,
    url: '/image/maincarousel/3.jpg',
    title: 'K-Festival',
    description: 'Enjoy festivals and events where tradition and modernity blend'
  },
]

export default function MainCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)
    update()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update)
      return () => mediaQuery.removeEventListener('change', update)
    }

    // Safari fallback
    const legacyMediaQuery = mediaQuery as unknown as {
      addListener?: (cb: () => void) => void
      removeListener?: (cb: () => void) => void
    }

    legacyMediaQuery.addListener?.(update)
    return () => legacyMediaQuery.removeListener?.(update)
  }, [])

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return

    const interval = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused, prefersReducedMotion, nextSlide])

  return (
    <div 
      className="relative w-full h-[340px] sm:h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured categories"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
    >
      {/* Image slides */}
      <div 
        className={`flex transition-transform ease-in-out h-full ${prefersReducedMotion ? 'duration-0' : 'duration-1000'}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, idx) => (
          <div
            key={image.id}
            className="min-w-full h-full relative"
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${images.length}`}
            aria-hidden={idx !== currentIndex}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <Image
              src={image.url}
              alt={image.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={image.id === 1}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 z-20">
              <div className="container mx-auto max-w-7xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                  {image.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 drop-shadow-lg max-w-2xl">
                  {image.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Previous/Next buttons */}
      <button
        type="button"
        onClick={prevSlide}
        className="focus-ring absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-3 text-white transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="focus-ring absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-3 text-white transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {images.map((image, index) => (
          <button
            type="button"
            key={image.id}
            onClick={() => goToSlide(index)}
            className={`focus-ring h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}

