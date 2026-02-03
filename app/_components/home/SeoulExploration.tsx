"use client"

import Image from 'next/image'

interface ExplorationItem {
  id: string
  title: string
  description: string
  imageUrl: string
  area: string
}

const seoulExplorations: ExplorationItem[] = [
  {
    id: '1',
    title: 'Gangnam District',
    description: 'Explore the modern and vibrant attractions of Gangnam',
    imageUrl: 'https://picsum.photos/seed/gangnam/800/600',
    area: 'Gangnam-gu',
  },
  {
    id: '2',
    title: 'Hongdae Street Culture',
    description: 'Experience the unique culture of Hongdae, overflowing with youth and creativity',
    imageUrl: 'https://picsum.photos/seed/hongdae/800/600',
    area: 'Mapo-gu',
  },
  {
    id: '3',
    title: 'Gyeongbokgung Palace & Hanok Village',
    description: 'Explore the palace and hanok of the Joseon Dynasty, where tradition and history come alive',
    imageUrl: 'https://picsum.photos/seed/palace/800/600',
    area: 'Jongno-gu',
  },
  {
    id: '4',
    title: 'Myeongdong Shopping Street',
    description: 'Seoul\'s representative center for shopping and entertainment',
    imageUrl: 'https://picsum.photos/seed/myeongdong/800/600',
    area: 'Jung-gu',
  },
  {
    id: '5',
    title: 'Hangang Park',
    description: 'Various leisure activities along the Hangang River, the heart of Seoul',
    imageUrl: 'https://picsum.photos/seed/hangang/800/600',
    area: 'Yongsan-gu',
  },
  {
    id: '6',
    title: 'Bukchon Hanok Village',
    description: 'A beautiful village where traditional hanok and modern cafes coexist',
    imageUrl: 'https://picsum.photos/seed/bukchon/800/600',
    area: 'Jongno-gu',
  }
]

export default function SeoulExploration() {
  return (
    <section id="seoul-exploration" className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="px-6">
        {/* Title section - left aligned */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4 justify-start pl-2">
            <div className="w-10 h-px bg-gray-400 dark:bg-gray-600"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-left">
              Explore Seoul
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-400 dark:from-gray-600 to-transparent"></div>
          </div>
          <div className="flex justify-end mt-2 pr-2">
            <button
              type="button"
              className="focus-ring rounded-md px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
              aria-label="Show all Seoul explorations"
            >
              Show All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seoulExplorations.map((item) => (
            <div
              key={item.id}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-[border-color,box-shadow] duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {/* Coming Soon overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-800 dark:text-gray-200 text-sm font-semibold">
                      Coming Soon
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gray-900 dark:bg-gray-100 rounded-full text-white dark:text-gray-900 text-xs font-semibold">
                      {item.area}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

