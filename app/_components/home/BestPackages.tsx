import PackageCarousel from '@/components/features/package/PackageCarousel'
import { getAllPackages } from '@/lib/db/packages'
import type { TravelPackageJson } from '@/types'
import BestPackagesTitle from './BestPackagesTitle'
import BestPackagesShowAll from './BestPackagesShowAll'

export const revalidate = 60

function toPackageJson(pkg: { _id: string } & Omit<TravelPackageJson, '_id'>): TravelPackageJson {
  return {
    ...pkg,
    _id: { $oid: pkg._id },
  }
}

export default async function BestPackages() {
  const pkgs = await getAllPackages()
  const packages = pkgs.map((p) => toPackageJson(p as any))

  return (
    <section id="best-packages" className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="px-6">
        {/* Title section - centered with border lines */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4 justify-start pl-2">
            <div className="w-10 h-px bg-gray-400 dark:bg-gray-600"></div>
            <BestPackagesTitle />
            <div className="flex-1 h-px bg-gradient-to-r from-gray-400 dark:from-gray-600 to-transparent"></div>
          </div>
          <div className="flex justify-end mt-2 pr-2">
            <BestPackagesShowAll />
          </div>
        </div>

        <PackageCarousel packages={packages} />
      </div>
    </section>
  )
}

