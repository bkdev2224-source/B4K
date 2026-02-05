import type { Metadata } from 'next'
import PageLayout from '@/components/layout/PageLayout'
import MainCarousel from '@/app/_components/home/MainCarousel'
import BestPackages from '@/app/_components/home/BestPackages'
import EditorRecommendations from '@/app/_components/home/EditorRecommendations'
import SeoulExploration from '@/app/_components/home/SeoulExploration'
import SeasonalRecommendations from '@/app/_components/home/SeasonalRecommendations'

export const metadata: Metadata = {
  title: 'Korea Travel & Culture',
  description:
    'Discover K-Pop spots, K-Beauty, K-Food, festivals, and K-Drama locations. Plan your Korea trip with curated packages and interactive maps.',
}

export default function Home() {
  return (
    <PageLayout showSidePanel={true} sidePanelWidth="default">
      <h1 className="sr-only">B4K</h1>
      {/* Main carousel */}
      <MainCarousel />
      
      {/* B4K Best packages */}
      <BestPackages />
      
      {/* Editor recommendations */}
      <EditorRecommendations />
      
      {/* Explore Seoul */}
      <SeoulExploration />
      
      {/* Seasonal travel recommendations */}
      <SeasonalRecommendations />
    </PageLayout>
  )
}
