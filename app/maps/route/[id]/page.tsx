"use client"

import { useRouter, useParams } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import { getRouteById } from '@/lib/services/routes'

export default function RouteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string || ''
  
  const route = getRouteById(id)

  if (!route) {
    return (
      <PageLayout showSidePanel={true} sidePanelWidth="routes">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Route Not Found</h1>
            <button
              onClick={() => router.push('/maps')}
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Return to Routes
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout showSidePanel={true} sidePanelWidth="routes">
      {/* Main content area - reserved for map */}
      <div className="h-[calc(100vh-4rem)] w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-lg">Map will be displayed here</p>
          <p className="text-sm mt-2">{route.name}</p>
        </div>
      </div>
    </PageLayout>
  )
}

