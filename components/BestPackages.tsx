"use client"

import PackageCarousel from './PackageCarousel'
import { getAllPackages } from '@/lib/data'

export default function BestPackages() {
  const allPackages = getAllPackages()

  return (
    <section id="best-packages" className="w-full py-16 bg-white">
      <div className="px-6">
        {/* Title section - centered with border lines */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4 justify-start pl-2">
            <div className="w-10 h-px bg-purple-500"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-left">
              B4K Best Packages
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500 to-transparent"></div>
          </div>
          <div className="flex justify-end mt-2 pr-2">
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
              Show All
            </button>
          </div>
        </div>

        <PackageCarousel packages={allPackages} />
      </div>
    </section>
  )
}

