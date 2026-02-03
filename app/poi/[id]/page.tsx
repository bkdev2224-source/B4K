import Image from 'next/image'
import type { Metadata } from 'next'
import PageLayout from '@/components/layout/PageLayout'
import PoiActionButtons from './PoiActionButtons'
import { getPOIById } from '@/lib/db/pois'
import { getKContentsByPOIId } from '@/lib/db/kcontents'
import type { KContentJson, POIJson } from '@/types'
import { getSiteUrl } from '@/lib/config/env'

export const revalidate = 60

function toPOIJson(poi: { _id: string } & Omit<POIJson, '_id'>): POIJson {
  return { ...poi, _id: { $oid: poi._id } }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params?.id || ''
  try {
    const dbPoi = await getPOIById(id)
    if (!dbPoi) return { title: 'Location Not Found' }
    const poi = toPOIJson(dbPoi as any)
    const title = poi.name
    const description = `${poi.name} — ${poi.address}. ${poi.categoryTags?.join(', ') || ''} spot in Korea. Explore on B4K.`
    const imageUrl = `https://picsum.photos/seed/${id}/1200/630`
    const baseUrl = getSiteUrl()
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [imageUrl],
        url: `${baseUrl}/poi/${id}`,
      },
      twitter: { card: 'summary_large_image', title, description },
    }
  } catch {
    return { title: 'Location' }
  }
}

export default async function POIDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const id = params?.id || ''

  try {
    const dbPoi = await getPOIById(id)
    const poi = dbPoi ? toPOIJson(dbPoi as any) : null
    const dbContents = await getKContentsByPOIId(id)
    const kContents = dbContents.map(
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

    if (!poi) {
      return (
        <PageLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Location Not Found</h1>
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

  return (
    <PageLayout>
        {/* Banner image */}
        <div className="relative h-96">
          <Image
            src={`https://picsum.photos/seed/${poi._id.$oid}/1920/600`}
            alt={poi.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
            <div className="container mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* 1. 이름 */}
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">{poi.name}</h1>
                  
                  {/* 2. 카테고리, 장소 개수 */}
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-white/90 text-sm md:text-base">
                    <div className="flex gap-2 flex-wrap">
                      {poi.categoryTags.map((tag, idx) => (
                        <span key={`${tag}-${idx}`} className="px-3 py-1 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-white/70">·</span>
                    <span>{kContents.length} spots</span>
                  </div>

                  {/* 3. Location Information */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                      <div className="space-y-1">
                        <p className="text-white/80 text-xs font-medium mb-1">📍 Address</p>
                        <p className="text-white text-sm">{poi.address}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/80 text-xs font-medium mb-1">💰 Entry Fee</p>
                        <p className="text-white text-sm">{poi.entryFee}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/80 text-xs font-medium mb-1">🕐 Opening Hours</p>
                        <p className="text-white text-sm">{poi.openingHours}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/80 text-xs font-medium mb-1">📞 Reservation Required</p>
                        <p className="text-white text-sm">{poi.needsReservation ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <PoiActionButtons poiId={poi._id.$oid} poiName={poi.name} />
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="container mx-auto px-6 pt-8 pb-16">
          {/* K-Contents section */}
          {kContents.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 px-8 flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Spots to Visit
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kContents.map((content, index) => (
                  <div
                    key={`${content.poiId?.$oid ?? poi._id.$oid}-${content.spotName}-${index}`}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-[border-color,box-shadow] duration-200 shadow-sm hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {/* Use spotName as title */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{content.spotName}</h3>
                        {/* Use subName as hashtag */}
                        {content.subName && (
                          <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium mb-3">
                            #{content.subName}
                          </span>
                        )}
                      </div>
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        <Image
                          src={`https://picsum.photos/seed/${poi._id.$oid}-${content.spotName}/100/100`}
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
                ))}
              </div>
            </div>
          )}
        </div>
    </PageLayout>
  )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load'
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Failed to load</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 break-words">{message}</p>
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
}
