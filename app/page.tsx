"use client"

import PageLayout from '@/components/layout/PageLayout'
import MainCarousel from '@/app/_components/home/MainCarousel'
import BestPackages from '@/app/_components/home/BestPackages'
import EditorRecommendations from '@/app/_components/home/EditorRecommendations'
import SeoulExploration from '@/app/_components/home/SeoulExploration'
import SeasonalRecommendations from '@/app/_components/home/SeasonalRecommendations'

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
