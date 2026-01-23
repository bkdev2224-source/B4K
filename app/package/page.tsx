"use client"

import PageLayout from '@/components/PageLayout'
import PackageCarousel from '@/components/PackageCarousel'
import { getAllPackages } from '@/lib/data/mock'

export default function PackagePage() {
  const allPackages = getAllPackages()

  return (
    <PageLayout showSidePanel={false} className="pb-8">
      {/* Normal mode: Package page content */}
      <div className="w-full">
        {/* Recommended packages section */}
        <PackageCarousel packages={allPackages} />
      </div>
    </PageLayout>
  )
}

