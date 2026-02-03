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
  // Monochrome season badges with different opacity
  const seasonColors = {
    'Spring': 'bg-gray-800 dark:bg-gray-200',
    'Summer': 'bg-gray-700 dark:bg-gray-300',
    'Autumn': 'bg-gray-600 dark:bg-gray-400',
    'Winter': 'bg-gray-900 dark:bg-gray-100'
  }

  return (
    <section id="seasonal-recommendations" className="w-full py-16 bg-white dark:bg-gray-950">
      <div className="px-6">
        {/* Title section */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4 justify-start pl-2">
            <div className="w-10 h-px bg-gray-400 dark:bg-gray-600"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-left">
              Seasonal Travel Recommendations
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-400 dark:from-gray-600 to-transparent"></div>
          </div>
          <div className="flex justify-end mt-2 pr-2">
            <button
              type="button"
              className="focus-ring rounded-md px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
              aria-label="Show all seasonal recommendations"
            >
              Show All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasonalRecommendations.map((item) => (
            <Link
              key={item.id}
              href={item.href || '#'}
              className="focus-ring group no-underline rounded-xl"
            >
              <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-[border-color,box-shadow,transform] duration-300 hover:shadow-lg hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 ${seasonColors[item.season]} rounded-full text-white dark:text-gray-900 text-xs font-semibold`}>
                      {item.season}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
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

