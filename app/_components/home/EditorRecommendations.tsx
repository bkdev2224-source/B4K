"use client"

import Image from 'next/image'

interface RecommendationItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
}

const editorRecommendations: RecommendationItem[] = [
  {
    id: '1',
    title: 'Forest Retreat',
    description: 'A moment to pause in a quiet winter forest in the heart of the city',
    imageUrl: 'https://picsum.photos/seed/forest/800/600',
    category: 'Relaxation',
  },
  {
    id: '2',
    title: 'Starfield Library',
    description: 'Sparkling Christmas atmosphere under a giant tree',
    imageUrl: 'https://picsum.photos/seed/library/800/600',
    category: 'Culture',
  },
  {
    id: '3',
    title: 'Lantern Festival',
    description: 'Seoul\'s night light festival that unfolds on winter nights',
    imageUrl: 'https://picsum.photos/seed/festival/800/600',
    category: 'Festival',
  },
  {
    id: '4',
    title: 'K-Pop Demon Hunters: Seoul 2-Day Golden Tour',
    description: 'An attractive 2-day travel course in Seoul following the main locations from K-Pop Demon Hunters',
    imageUrl: 'https://picsum.photos/seed/kpop-tour/800/600',
    category: 'K-Pop',
  },
  {
    id: '5',
    title: 'Autumn Flavors with Seoul\'s Seasonal Desserts',
    description: 'Autumn flavors with Seoul\'s seasonal desserts',
    imageUrl: 'https://picsum.photos/seed/dessert/800/600',
    category: 'K-Food',
  },
  {
    id: '6',
    title: 'Year-end Tree Spaces in Seoul',
    description: 'Year-end atmosphere-filled tree spaces to enjoy indoors in Seoul',
    imageUrl: 'https://picsum.photos/seed/winter/800/600',
    category: 'Event',
  }
]

export default function EditorRecommendations() {
  return (
    <section id="editor-recommendations" className="w-full py-16 bg-white dark:bg-gray-950">
      <div className="px-6">
        {/* Title section - centered with border lines */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4 justify-start pl-2">
            <div className="w-10 h-px bg-gray-400 dark:bg-gray-600"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-left">
              B4K Recommended Experiences
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-400 dark:from-gray-600 to-transparent"></div>
          </div>
          <div className="flex justify-end mt-2 pr-2">
            <button
              type="button"
              className="focus-ring rounded-md px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
              aria-label="Show all recommendations"
            >
              Show All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editorRecommendations.map((item) => (
            <div
              key={item.id}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300">
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
                      {item.category}
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

