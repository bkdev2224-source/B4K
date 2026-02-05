import type { Metadata } from 'next'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import type { KContentJson as KContent } from '@/types'

export const metadata: Metadata = {
  title: 'Contents',
  description: 'Explore K-Pop, K-Beauty, K-Food, K-Festival, and K-Drama content and hot spots in Korea.',
}
import { getKContentsByCategory as getKContentsByCategoryDB } from '@/lib/db/kcontents'
import { getPOIById } from '@/lib/db/pois'
import { getContentTypeLabel } from '@/lib/utils/logo'
import { ArtistLogo } from '@/components/ui/ArtistLogo'
import { getKBeautyPlaceByName } from '@/lib/db/kbeauty-places'
import { getKpopArtistByName } from '@/lib/db/kpop-artists'
import { getKFoodBrandByName } from '@/lib/db/kfood-brands'
import { getKFestivalPlaceByName } from '@/lib/db/kfestival-places'
import { getKContentSubName } from '@/lib/utils/locale'
import { cookies } from 'next/headers'

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
  },
  {
    id: 'kdrama',
    title: 'Kdrama',
    subtitle: 'K-drama filming locations and iconic spots',
  }
]

async function LogoContentCard({
  content,
  poi,
  category,
}: {
  content: KContent
  poi?: { name: { name_en: string; name_ko: string } } | null
  category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival' | 'kdrama'
}) {
  // category에 따라 적절한 데이터 소스에서 logoUrl 가져오기
  let logoUrl: string | null = null
  // 서버에서 언어 가져오기
  const cookieStore = await cookies()
  const language = (cookieStore.get('language')?.value || 'en') as 'ko' | 'en'
  
  const subNameEn = typeof content.subName === 'string' ? content.subName : content.subName.subName_en
  
  if (category === 'kbeauty') {
    const place = await getKBeautyPlaceByName(subNameEn)
    logoUrl = place?.logoUrl ?? null
  } else if (category === 'kpop') {
    const artist = await getKpopArtistByName(subNameEn)
    logoUrl = artist?.logoUrl ?? null
  } else if (category === 'kfood') {
    const brand = await getKFoodBrandByName(subNameEn)
    logoUrl = brand?.logoUrl ?? null
  } else if (category === 'kfestival') {
    const place = await getKFestivalPlaceByName(subNameEn)
    logoUrl = place?.logoUrl ?? null
  }

  return (
    <Link
      href={`/contents/${subNameEn}`}
      className="group no-underline"
    >
      <div className="w-40 sm:w-44 shrink-0 snap-start">
        <div className="flex flex-col items-center text-center">
          <ArtistLogo
            subName={subNameEn}
            logoUrl={logoUrl}
            size="md"
            className="transition-[border-color,box-shadow] group-hover:shadow-md group-hover:border-gray-400 dark:group-hover:border-gray-600"
          />

          <div className="mt-4">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-1">
              {getKContentSubName(content, language)}
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
        const dbContents = await getKContentsByCategoryDB(section.id as 'kpop' | 'kbeauty' | 'kfood' | 'kfestival' | 'kdrama')
        const contents = dbContents.map((content) => ({
          subName: content.subName,
          poiId: { $oid: content.poiId },
          spotName: content.spotName,
          description: content.description,
          tags: content.tags,
          popularity: content.popularity,
          category: content.category,
        })) as KContent[]
        // 서버에서 언어 가져오기
        const cookieStore = await cookies()
        const language = (cookieStore.get('language')?.value || 'en') as 'ko' | 'en'
        
        // subName(아티스트/브랜드) 단위로 중복 제거 후 프리뷰 구성
        const uniqueBySubName = Array.from(
          contents.reduce((acc, item) => {
            const subNameKey = typeof item.subName === 'string' ? item.subName : item.subName.subName_en
            if (!acc.has(subNameKey)) acc.set(subNameKey, item)
            return acc
          }, new Map<string, KContent>()).values()
        )
        
        // logoUrl 또는 backgroundUrl이 있는 항목만 필터링
        const itemsWithLogo = await Promise.all(
          uniqueBySubName.map(async (content) => {
            let logoUrl: string | null = null
            let backgroundUrl: string | null = null
            const subNameEn = typeof content.subName === 'string' ? content.subName : content.subName.subName_en
            if (section.id === 'kbeauty') {
              const place = await getKBeautyPlaceByName(subNameEn)
              logoUrl = place?.logoUrl ?? null
              backgroundUrl = place?.backgroundUrl && place.backgroundUrl !== '' ? place.backgroundUrl : null
            } else if (section.id === 'kpop') {
              const artist = await getKpopArtistByName(subNameEn)
              logoUrl = artist?.logoUrl ?? null
              backgroundUrl = artist?.backgroundUrl && artist.backgroundUrl !== '' ? artist.backgroundUrl : null
            } else if (section.id === 'kfood') {
              const brand = await getKFoodBrandByName(subNameEn)
              logoUrl = brand?.logoUrl ?? null
              backgroundUrl = brand?.backgroundUrl && brand.backgroundUrl !== '' ? brand.backgroundUrl : null
            } else if (section.id === 'kfestival') {
              const place = await getKFestivalPlaceByName(subNameEn)
              logoUrl = place?.logoUrl ?? null
              backgroundUrl = place?.backgroundUrl && place.backgroundUrl !== '' ? place.backgroundUrl : null
            }
            return { content, logoUrl, backgroundUrl }
          })
        )
        
        // logoUrl 또는 backgroundUrl이 있는 항목만 선택
        const filteredItems = itemsWithLogo
          .filter(({ logoUrl, backgroundUrl }) => logoUrl !== null || backgroundUrl !== null)
          .map(({ content }) => content)
        
        const previewItems = filteredItems.slice(0, 12)

        return (
          <section key={section.id} id={section.id} className="w-full py-16">
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

              <div className="flex gap-8 overflow-x-auto pb-6 -mx-6 px-6 scroll-smooth snap-x snap-mandatory scrollbar-hide">
                {await Promise.all(
                  previewItems.map(async (content, index) => {
                    const poi = await getPOIById(content.poiId.$oid)
                    return (
                      <LogoContentCard
                        key={`${section.id}-${index}-${typeof content.subName === 'string' ? content.subName : content.subName.subName_en}`}
                        content={content}
                        poi={poi}
                        category={section.id as 'kpop' | 'kbeauty' | 'kfood' | 'kfestival' | 'kdrama'}
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

