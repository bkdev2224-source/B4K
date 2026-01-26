"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { pageview } from '@/lib/analytics'

/**
 * Hook to track page views on route changes
 * 
 * Required for Next.js App Router because GA4's default page view
 * tracking doesn't work reliably with client-side navigation.
 * 
 * Usage: Call useAnalytics() once in a client component that wraps your app.
 */
function useAnalyticsInternal() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    
    // Construct full path with search params
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname

    pageview(url)
  }, [pathname, searchParams])
}

/**
 * Analytics tracker component
 * Wrap this in Suspense because useSearchParams requires it in App Router
 */
function AnalyticsTrackerInner() {
  useAnalyticsInternal()
  return null
}

/**
 * Analytics Tracker Component
 * 
 * Add this component once in your app to enable automatic page view tracking.
 * It handles client-side navigation tracking for GA4 in Next.js App Router.
 * 
 * Usage in layout.tsx or a client wrapper:
 * ```tsx
 * <AnalyticsTracker />
 * ```
 */
export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerInner />
    </Suspense>
  )
}
