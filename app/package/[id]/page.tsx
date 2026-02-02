import Image from 'next/image'
import PageLayout from '@/components/layout/PageLayout'
import PackageCartButton from './PackageCartButton'
import { getPackageById } from '@/lib/db/packages'
import type { TravelPackageJson } from '@/types'

export const revalidate = 60

function toPackageJson(pkg: { _id: string } & Omit<TravelPackageJson, '_id'>): TravelPackageJson {
  return {
    ...pkg,
    _id: { $oid: pkg._id },
  }
}

export default async function PackageDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const id = params?.id || ''

  try {
    const dbPkg = await getPackageById(id)
    const pkg = dbPkg ? toPackageJson(dbPkg as any) : null

    if (!pkg) {
      return (
        <PageLayout showSidePanel={false}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Package Not Found</h1>
              <a
                href="/package"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Return to Packages
              </a>
            </div>
          </div>
        </PageLayout>
      )
    }

    return (
      <PageLayout showSidePanel={false}>
        {/* Banner image */}
        <div className="relative h-96">
          <Image
            src={pkg.imageUrl || `https://picsum.photos/seed/${pkg._id.$oid}/1920/600`}
            alt={pkg.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 to-transparent">
            <div className="container mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Package name */}
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">{pkg.name}</h1>

                  {/* Category, duration, cities */}
                  <div className="mb-4 flex flex-wrap items-center gap-3 text-white/90 text-sm md:text-base">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium uppercase">
                      {pkg.category}
                    </span>
                    <span className="text-white/70">·</span>
                    <span>{pkg.duration} Days</span>
                    <span className="text-white/70">·</span>
                    <span>{pkg.cities.join(' → ')}</span>
                  </div>

                  {/* Concept */}
                  <p className="text-white/90 text-lg max-w-3xl leading-relaxed">{pkg.concept}</p>
                </div>
                {/* Action buttons */}
                <div className="ml-4 flex gap-3">
                  <PackageCartButton packageId={pkg._id.$oid} name={pkg.name} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="container mx-auto px-6 pt-8 pb-16">
          {/* Highlights section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 px-8 flex items-center gap-3">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Highlights
                </h2>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pkg.highlights.map((highlight, index) => (
                <div
                  key={`${highlight}-${index}`}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 shadow-sm hover:shadow-lg flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-700 dark:text-gray-300 font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

        {/* Included Services section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 px-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Included Services
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pkg.includedServices.map((service, index) => (
                <div key={`${service}-${index}`} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Itinerary section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 px-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {pkg.duration}-Day Itinerary
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400 dark:via-gray-600 to-gray-400 dark:to-gray-600"></div>
            </div>
          </div>

          <div className="space-y-6">
            {pkg.itinerary.map((day, index) => (
              <div
                key={`${day.day}-${day.city}-${index}`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-900 dark:bg-gray-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white dark:text-gray-900">
                    <span className="text-xs font-medium">DAY</span>
                    <span className="text-2xl font-bold">{day.day}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{day.city}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {day.activities.map((activity, actIdx) => (
                        <span
                          key={`${activity}-${actIdx}`}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 text-sm"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
              href="/package"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Return to Packages
            </a>
          </div>
        </div>
      </PageLayout>
    )
  }
}
