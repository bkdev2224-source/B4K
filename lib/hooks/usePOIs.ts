"use client"

import useSWR from 'swr'
import type { POIJson } from '@/types'
import { fetcher } from '@/lib/utils/fetcher'

const DEDUPING_INTERVAL_MS = 30_000

export function usePOIs(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const key = enabled ? '/api/pois' : null
  const { data, error, isLoading } = useSWR<POIJson[]>(
    key,
    fetcher,
    {
      dedupingInterval: DEDUPING_INTERVAL_MS,
      revalidateOnFocus: false,
    }
  )

  const pois = Array.isArray(data) ? data : []
  const loading = enabled && isLoading
  const err = error instanceof Error ? error.message : (error ? 'Failed to fetch pois' : null)

  return {
    pois,
    loading,
    error: err,
  }
}

export function usePOIById(poiId: string, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const key = enabled && poiId ? `/api/pois?poiId=${encodeURIComponent(poiId)}` : null
  const { data, error, isLoading } = useSWR<POIJson | null>(key, fetcher, {
    dedupingInterval: DEDUPING_INTERVAL_MS,
    revalidateOnFocus: false,
  })

  const poi = data ?? null
  const loading = enabled && poiId ? isLoading : false
  const err = error instanceof Error ? error.message : (error ? 'Failed to fetch poi' : null)

  return {
    poi,
    loading,
    error: err,
  }
}
