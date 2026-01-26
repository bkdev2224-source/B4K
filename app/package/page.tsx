"use client"

import PageLayout from '@/components/layout/PageLayout'
import PackageCarousel from '@/components/features/package/PackageCarousel'
import { usePackages } from '@/lib/hooks/usePackages'
import { LoadingScreen } from '@/lib/utils/loading'

export default function PackagePage() {
  const { packages, loading, error } = usePackages()

  if (loading) {
    return (
      <PageLayout showSidePanel={false} className="pb-8">
        <LoadingScreen label="Loading..." />
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout showSidePanel={false} className="pb-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Failed to load</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 break-words">{error}</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showSidePanel={false} className="pb-8">
      {/* Normal mode: Package page content */}
      <div className="w-full">
        {/* Recommended packages section */}
        <PackageCarousel packages={packages} />
      </div>
    </PageLayout>
  )
}

