import PageLayout from '@/components/layout/PageLayout'
import { BeautyBrandCard } from '@/components/ui/BeautyBrandCard'
import { getAllKBeautyPlaces } from '@/lib/db/kbeauty-places'

export const revalidate = 60

export default async function KBeautyPage() {
  const brands = await getAllKBeautyPlaces()

  return (
    <PageLayout>
      <div className="container mx-auto px-6 pt-8 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            K-Beauty Brands
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            한국의 대표적인 뷰티 브랜드를 만나보세요
          </p>
        </div>

        {brands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">등록된 브랜드가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <BeautyBrandCard key={brand.name} brand={brand} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

