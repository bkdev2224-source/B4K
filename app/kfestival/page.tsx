import PageLayout from '@/components/layout/PageLayout'
import { FestivalCard } from '@/components/ui/FestivalCard'
import { getAllKFestivalPlaces } from '@/lib/db/kfestival-places'

export const revalidate = 60

export default async function KFestivalPage() {
  const festivals = await getAllKFestivalPlaces()

  return (
    <PageLayout>
      <div className="container mx-auto px-6 pt-8 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            K-Festival
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            한국의 대표적인 축제를 만나보세요
          </p>
        </div>

        {festivals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">등록된 축제가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map((festival) => (
              <FestivalCard key={festival.name} festival={festival} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

