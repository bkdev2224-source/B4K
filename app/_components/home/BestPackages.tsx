"use client"

import PackageCarousel from '@/components/features/package/PackageCarousel'
import { usePackages } from '@/lib/hooks/usePackages'
import { Loading } from '@/lib/utils/loading'

export default function BestPackages() {
  const { packages, loading } = usePackages()

  return (
    <section id="best-packages" className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="px-6">
        {/* Title section - centered with border lines */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4 justify-start pl-2">
            <div className="w-10 h-px bg-gray-400 dark:bg-gray-600"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-left">
              B4K Best Packages
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-400 dark:from-gray-600 to-transparent"></div>
          </div>
          <div className="flex justify-end mt-2 pr-2">
            <button
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors"
              aria-label="Show all packages"
            >
              Show All
            </button>
          </div>
        </div>

        {loading ? <Loading /> : <PackageCarousel packages={packages} />}
      </div>
    </section>
  )
}

