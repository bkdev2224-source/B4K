"use client"

import Link from 'next/link'
import Image from 'next/image'

interface SeasonalItem {
  id: string
  title: string
  description: string
  imageUrl: string
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter'
  href?: string
}

const seasonalRecommendations: SeasonalItem[] = [
  {
    id: '1',
    title: 'Cherry Blossom Festival',
    description: 'Spring\'s representative festival, enjoying Seoul\'s spring while admiring beautiful cherry blossoms',
    imageUrl: 'https://picsum.photos/seed/spring-cherry/800/600',
    season: 'Spring',
    href: '/seasons/spring'
  },
  {
    id: '2',
    title: 'Summer Hangang Picnic',
    description: 'Summer night picnics and outdoor concerts enjoyed at the cool Hangang River',
    imageUrl: 'https://picsum.photos/seed/summer-hangang/800/600',
    season: 'Summer',
    href: '/seasons/summer'
  },
  {
    id: '3',
    title: 'Autumn Foliage Tour',
    description: 'Explore Seoul\'s parks and mountains painted with brilliant autumn leaves',
    imageUrl: 'https://picsum.photos/seed/autumn-leaves/800/600',
    season: 'Autumn',
    href: '/seasons/autumn'
  },
  {
    id: '4',
    title: 'Winter Snow Festival',
    description: 'Winter festivals and warm hot springs enjoyed in snow-covered Seoul',
    imageUrl: 'https://picsum.photos/seed/winter-snow/800/600',
    season: 'Winter',
    href: '/seasons/winter'
  },
  {
    id: '5',
    title: 'Spring Flower Festival',
    description: 'Seoul\'s parks and gardens filled with various spring flowers',
    imageUrl: 'https://picsum.photos/seed/spring-flowers/800/600',
    season: 'Spring',
    href: '/seasons/spring-flowers'
  },
  {
    id: '6',
    title: 'Summer Water Festival',
    description: 'Seoul\'s summer festival enjoyed with cool water activities',
    imageUrl: 'https://picsum.photos/seed/summer-water/800/600',
    season: 'Summer',
    href: '/seasons/summer-festival'
  }
]

export default function SeasonalRecommendations() {
  const seasonColors = {
    'Spring': 'from-green-500/80 to-pink-500/80',
    'Summer': 'from-blue-500/80 to-cyan-500/80',
    'Autumn': 'from-orange-500/80 to-red-500/80',
    'Winter': 'from-blue-400/80 to-purple-500/80'
  }

  return (
    <section id="seasonal-recommendations" className="w-full py-16 bg-white">
      <div className="px-6">
        {/* Title section */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4 justify-start pl-2">
            <div className="w-10 h-px bg-emerald-500"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-left">
              Seasonal Travel Recommendations
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500 to-transparent"></div>
          </div>
          <div className="flex justify-end mt-2 pr-2">
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              Show All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasonalRecommendations.map((item) => (
            <Link
              key={item.id}
              href={item.href || '#'}
              className="group no-underline"
            >
              <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 bg-gradient-to-r ${seasonColors[item.season]} rounded-full text-white text-xs font-semibold`}>
                      {item.season}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

