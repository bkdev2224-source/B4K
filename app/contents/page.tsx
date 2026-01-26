import Link from 'next/link'
import Image from 'next/image'
import PageLayout from '@/components/layout/PageLayout'
import { getPOIById } from '@/lib/data/mock'
import type { KContentJson as KContent } from '@/types'
import { getKContentsByCategory as getKContentsByCategoryDB } from '@/lib/db/kcontents'

const categorySections = [
  {
    id: 'kpop',
    title: 'Kpop',
    subtitle: 'K-pop hot spots and fandom destinations',
  },
  {
    id: 'kbeauty',
    title: 'Kbeauty',
    subtitle: 'Beauty landmarks, flagship stores, and skin care hubs',
  },
  {
    id: 'kfood',
    title: 'Kfood',
    subtitle: 'Taste-driven content and food discovery spots',
  },
  {
    id: 'kfestival',
    title: 'Kfestival',
    subtitle: 'Seasonal festivals and cultural highlights',
  }
]

function ContentCard({ content, poi }: { content: KContent; poi?: { name: string } }) {
  return (
    <Link
      href={`/contents/${encodeURIComponent(content.subName)}`}
      className="group no-underline"
    >
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={`https://picsum.photos/seed/${content.poiId.$oid}-${content.spotName}/800/600`}
            alt={content.spotName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-900 dark:bg-gray-100 rounded-full text-white dark:text-gray-900 text-xs font-semibold">
              {content.subName}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            {content.spotName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {content.description}
          </p>
          {poi && (
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
              📍 {poi.name}
            </p>
          )}
          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.tags.slice(0, 3).map((tag, tagIdx) => (
                <span
                  key={tagIdx}
                  className="px-2 py-1 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default async function ContentsPage() {
  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      {await Promise.all(categorySections.map(async (section) => {
        const dbContents = await getKContentsByCategoryDB(section.id as 'kpop' | 'kbeauty' | 'kfood' | 'kfestival')
        const contents = dbContents.map((content) => ({
          subName: content.subName,
          poiId: { $oid: content.poiId },
          spotName: content.spotName,
          description: content.description,
          tags: content.tags,
          popularity: content.popularity,
          category: content.category,
        })) as KContent[]
        const previewItems = contents.slice(0, 6)

        return (
          <section key={section.id} id={section.id} className="w-full py-16 bg-gray-50 dark:bg-gray-900 odd:bg-white odd:dark:bg-gray-950">
            <div className="px-6">
              <div className="text-center mb-12">
                <div className="flex items-center gap-4 mb-4 justify-start pl-2">
                  <div className="w-10 h-px bg-gray-400 dark:bg-gray-600"></div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-left">
                    {section.title}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-400 dark:from-gray-600 to-transparent"></div>
                </div>
                <div className="flex justify-end mt-2 pr-2">
                  <Link
                    href={`/contents?category=${section.id}`}
                    className="text-sm font-medium transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    Show All
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {await Promise.all(previewItems.map(async (content, index) => {
                  const poi = await getPOIById(content.poiId.$oid)
                  return (
                    <ContentCard 
                      key={`${section.id}-${index}`} 
                      content={content} 
                      poi={poi}
                    />
                  )
                }))}
              </div>
            </div>
          </section>
        )
      }))}
    </PageLayout>
  )
}

