import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import { getPOIById } from '@/lib/data/mock'
import type { KContentJson as KContent } from '@/types'
import { getKContentsByCategory as getKContentsByCategoryDB } from '@/lib/db/kcontents'
import { getContentTypeLabel, getLogoSrcBySubName } from '@/lib/utils/logo'

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

function getInitials(input: string) {
  const s = input.trim()
  if (!s) return '?'
  const words = s.split(/\s+/).slice(0, 2)
  const letters = words.map((w) => w[0]).join('')
  return letters.toUpperCase()
}

function LogoContentCard({
  content,
  poi,
  category,
}: {
  content: KContent
  poi?: { name: string }
  category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival'
}) {
  const logoSrc = getLogoSrcBySubName(content.subName)
  return (
    <Link
      href={`/contents/${content.subName}`}
      className="group no-underline"
    >
      <div className="w-40 sm:w-44 shrink-0 snap-start">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm group-hover:shadow-md group-hover:border-gray-400 dark:group-hover:border-gray-600 transition-all">
            {logoSrc ? (
              // next/image는 SVG에서 설정 이슈가 생길 수 있어 img로 통일
              // (src는 /api/logo/* 로 동일 origin)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={`${content.subName} logo`}
                className="w-full h-full object-contain p-4"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-200 font-bold text-xl">
                {getInitials(content.subName)}
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-1">
              {content.subName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {getContentTypeLabel(category)}
            </div>
          </div>
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
        // subName(아티스트/브랜드) 단위로 중복 제거 후 프리뷰 구성
        const uniqueBySubName = Array.from(
          contents.reduce((acc, item) => {
            if (!acc.has(item.subName)) acc.set(item.subName, item)
            return acc
          }, new Map<string, KContent>()).values()
        )
        const previewItems = uniqueBySubName.slice(0, 12)

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

              <div className="flex gap-8 overflow-x-auto pb-6 -mx-6 px-6 scroll-smooth snap-x snap-mandatory">
                {await Promise.all(
                  previewItems.map(async (content, index) => {
                    const poi = await getPOIById(content.poiId.$oid)
                    return (
                      <LogoContentCard
                        key={`${section.id}-${index}-${content.subName}`}
                        content={content}
                        poi={poi}
                        category={section.id as 'kpop' | 'kbeauty' | 'kfood' | 'kfestival'}
                      />
                    )
                  })
                )}
              </div>
            </div>
          </section>
        )
      }))}
    </PageLayout>
  )
}

