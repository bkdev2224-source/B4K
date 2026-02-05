import type { Metadata } from 'next'
import PageLayout from '@/components/layout/PageLayout'
import PackageCarousel from '@/components/features/package/PackageCarousel'
import { getAllPackages } from '@/lib/db/packages'
import type { TravelPackageJson } from '@/types'

export const metadata: Metadata = {
  title: 'Travel Packages',
  description: 'Curated Korea travel packages — explore K-Pop, K-Beauty, K-Food, and more with guided itineraries.',
}

export const revalidate = 60

function toPackageJson(pkg: { _id: string } & Omit<TravelPackageJson, '_id'>): TravelPackageJson {
  return {
    ...pkg,
    _id: { $oid: pkg._id },
  }
}

export default async function PackagePage() {
  try {
    const pkgs = await getAllPackages()
    const packages = pkgs.map((p) => toPackageJson(p as any))

    return (
      <PageLayout className="pb-8">
        <div className="w-full">
          <PackageCarousel packages={packages} />
        </div>
      </PageLayout>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load packages'
    return (
      <PageLayout className="pb-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Failed to load</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 break-words">{message}</p>
          </div>
        </div>
      </PageLayout>
    )
  }
}

