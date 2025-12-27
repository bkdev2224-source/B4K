"use client"

import { useState, useEffect, useCallback } from 'react'

const images = [
  {
    id: 1,
    url: '/image/maincarousel/1.jpg',
    title: 'K-Pop',
    description: '세계를 매혹하는 한국의 음악과 댄스 문화를 경험하세요'
  },
  {
    id: 2,
    url: '/image/maincarousel/2.jpg',
    title: 'K-Beauty',
    description: '혁신적인 화장품과 스킨케어로 아름다움을 발견하세요'
  },
  {
    id: 3,
    url: '/image/maincarousel/3.jpg',
    title: 'K-Food',
    description: '맛과 건강을 모두 갖춘 한국의 독특한 요리를 맛보세요'
  },
  {
    id: 4,
    url: '/image/maincarousel/4.jpg',
    title: 'K-Festival',
    description: '전통과 현대가 어우러진 축제와 이벤트를 즐기세요'
  },
  {
    id: 5,
    url: '/image/maincarousel/5.jpg',
    title: '눈 덮인 성벽',
    description: '따뜻한 조명으로 물든 겨울밤의 아름다운 성벽 풍경'
  }
]

export default function MainCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

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
    if (isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused, nextSlide])

  return (
    <div 
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 이미지 슬라이드 */}
      <div 
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="min-w-full h-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-purple-900/30 to-transparent z-10" />
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 z-20">
              <div className="container mx-auto max-w-7xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                  {image.title}
                </h2>
                <p className="text-lg md:text-xl text-purple-100 drop-shadow-lg max-w-2xl">
                  {image.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 이전/다음 버튼 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-3 text-white transition-all"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-3 text-white transition-all"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

