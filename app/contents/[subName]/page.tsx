import Image from 'next/image'
import PageLayout from '@/components/layout/PageLayout'
import type { KContentJson, POIJson } from '@/types'
import Link from 'next/link'
import { ArtistLogo } from '@/components/ui/ArtistLogo'
import { SOCIAL_ICON_URLS } from '@/lib/config/social-icons'
import ContentMapButton from './ContentMapButton'
import { getKContentsBySubName } from '@/lib/db/kcontents'
import { getPOIById } from '@/lib/db/pois'
import { getKpopArtistByName } from '@/lib/db/kpop-artists'

export const revalidate = 60

function toPOIJson(poi: { _id: string } & Omit<POIJson, '_id'>): POIJson {
  return { ...poi, _id: { $oid: poi._id } }
}

export default async function ContentDetailPage({
  params,
}: {
  params: { subName: string }
}) {
  const rawSubName = params?.subName || ''
  const subName = decodeURIComponent(rawSubName)

  try {
    const dbContents = await getKContentsBySubName(subName)
    const contents = dbContents.map(
      (content) =>
        ({
          subName: content.subName,
          poiId: { $oid: content.poiId },
          spotName: content.spotName,
          description: content.description,
          tags: content.tags,
          popularity: content.popularity,
          category: content.category,
        }) as KContentJson
    )

    if (contents.length === 0) {
      return (
        <PageLayout showSidePanel={false}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Content Not Found</h1>
              <a
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Return to home"
              >
                Return to Home
              </a>
            </div>
          </div>
        </PageLayout>
      )
    }

    const firstContent = contents[0]
    const poiId = firstContent?.poiId?.$oid ?? ''
    const category = (firstContent as any)?.category as string | undefined

    const uniquePoiIds = Array.from(new Set(contents.map((c) => c.poiId?.$oid).filter(Boolean))) as string[]
    const poiEntries = await Promise.all(
      uniquePoiIds.map(async (id) => {
        const dbPoi = await getPOIById(id)
        return [id, dbPoi ? toPOIJson(dbPoi as any) : null] as const
      })
    )
    const poiById = new Map(poiEntries.filter(([, poi]) => poi).map(([id, poi]) => [id, poi!]))

    const dbPoiForBanner = poiId ? await getPOIById(poiId) : null
    const poi = dbPoiForBanner ? toPOIJson(dbPoiForBanner as any) : null

    const artist = category === 'kpop' ? await getKpopArtistByName(subName) : null

  // 카테고리별 아이콘
  const categoryIcons = {
    kpop: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    kbeauty: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    kfood: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
      </svg>
    ),
    kfestival: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      </svg>
    ),
    kdrama: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  }

  const categoryLabels = {
    kpop: 'K-Pop',
    kbeauty: 'K-Beauty',
    kfood: 'K-Food',
    kfestival: 'K-Festival',
    kdrama: 'K-Drama',
  }

  return (
    <PageLayout showSidePanel={false}>
      {/* Banner image */}
      <div className="relative h-96">
        <Image
          src={`https://picsum.photos/seed/${subName}/1920/600`}
          alt={subName}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
          <div className="container mx-auto">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 flex flex-col sm:flex-row items-start gap-6">
                {/* 로고 — 목록 페이지와 동일한 로직(흰 원 + 로고/이니셜) */}
                <ArtistLogo
                  subName={category === 'kpop' && artist ? artist.name : subName}
                  logoUrl={category === 'kpop' ? artist?.logoUrl ?? null : null}
                  size="lg"
                />
                {/* 정보: 1행 = 이름 + agency(노란 영역), 2행 = SNS 아이콘(파란 영역) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {category && category in categoryIcons && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        <span className="text-sm font-medium">{categoryLabels[category as keyof typeof categoryLabels]}</span>
                      </div>
                    )}
                  </div>
                  {/* 노란 영역: 아티스트 이름 + 소속사(같은 줄 오른쪽) */}
                  <div className="flex flex-wrap items-baseline gap-3 mb-3">
                    <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
                      {category === 'kpop' && artist ? artist.name : subName}
                    </h1>
                    {category === 'kpop' && artist?.agency && (
                      <span className="text-white/80 text-sm md:text-base font-medium">{artist.agency}</span>
                    )}
                  </div>
                  {/* 파란 영역: 유튜브, 인스타, X, 위키피디아 링크 아이콘 */}
                  {category === 'kpop' && artist && (artist.youtube || artist.instagram || artist.twitter || artist.wikipedia) && (
                    <div className="flex items-center gap-3 mb-3">
                      {artist.youtube && (
                        <a
                          href={artist.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring p-2.5 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-black/50 transition-all inline-flex items-center justify-center"
                          aria-label="YouTube"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={SOCIAL_ICON_URLS.youtube} alt="" className="w-5 h-5 object-contain" />
                        </a>
                      )}
                      {artist.instagram && (
                        <a
                          href={artist.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring p-2.5 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-black/50 transition-all inline-flex items-center justify-center"
                          aria-label="Instagram"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={SOCIAL_ICON_URLS.instagram} alt="" className="w-5 h-5 object-contain" />
                        </a>
                      )}
                      {artist.twitter && (
                        <a
                          href={artist.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring p-2.5 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-black/50 transition-all inline-flex items-center justify-center"
                          aria-label="X"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={SOCIAL_ICON_URLS.x} alt="" className="w-5 h-5 object-contain" />
                        </a>
                      )}
                      {artist.wikipedia && (
                        <a
                          href={artist.wikipedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring p-2.5 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-black/50 transition-all inline-flex items-center justify-center"
                          aria-label="Wikipedia"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={SOCIAL_ICON_URLS.wikipedia} alt="" className="w-5 h-5 object-contain" />
                        </a>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm md:text-base">
                    <span>{contents.length} spots</span>
                    {poi && (
                      <>
                        <span className="text-white/70">·</span>
                        <Link
                          href={`/poi/${poi._id.$oid}`}
                          className="hover:text-white underline transition-colors"
                        >
                          {poi.name}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <ContentMapButton subName={subName} />
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto px-6 pt-8 pb-16">
        {/* Contents section */}
        {contents.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 px-8 flex items-center gap-3">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Related Spots
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contents.map((content, index) => {
                  const contentPoi = poiById.get(content.poiId.$oid) ?? null
                  return (
                    <Link
                      key={`${content.poiId?.$oid ?? 'no-poi'}-${content.spotName}-${index}`}
                      href={`/poi/${content.poiId.$oid}`}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-lg h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{content.spotName}</h3>
                            {content.subName && (
                              <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
                                #{content.subName}
                              </span>
                            )}
                          </div>
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <Image
                              src={`https://picsum.photos/seed/${content.poiId.$oid}-${content.spotName}/100/100`}
                              alt={content.spotName}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                          {content.description}
                        </p>
                        {contentPoi && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                            📍 {contentPoi.name}
                          </p>
                        )}
                        {content.tags && content.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {content.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
    </PageLayout>
  )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load'
    return (
      <PageLayout showSidePanel={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Failed to load</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 break-words">{message}</p>
            <a
              href="/"
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition inline-block"
            >
              Home
            </a>
          </div>
        </div>
      </PageLayout>
    )
  }
}

