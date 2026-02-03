"use client"

import useSWR from 'swr'
import type { KContentJson } from '@/types'
import { fetcher } from '@/lib/utils/fetcher'

const DEDUPING_INTERVAL_MS = 30_000

async function kContentsFetcher(url: string): Promise<KContentJson[]> {
  const data = await fetcher<unknown>(url)
  if (!Array.isArray(data)) {
    throw new Error('Invalid kcontents response (expected array).')
  }
  return data as KContentJson[]
}

/**
 * 클라이언트 컴포넌트에서 KContents를 가져오는 훅
 */
export function useKContents(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const key = enabled ? '/api/kcontents' : null
  const { data, error, isLoading } = useSWR<KContentJson[]>(key, kContentsFetcher, {
    dedupingInterval: DEDUPING_INTERVAL_MS,
    revalidateOnFocus: false,
  })

  const contents = Array.isArray(data) ? data : []
  const loading = enabled && isLoading
  const err = error instanceof Error ? error.message : (error ? 'Failed to fetch kcontents' : null)

  return {
    contents,
    loading,
    error: err,
  }
}

export function useKContentsByCategory(category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival' | 'kdrama') {
  const key = `/api/kcontents?category=${category}`
  const { data, error, isLoading } = useSWR<KContentJson[]>(key, kContentsFetcher, {
    dedupingInterval: DEDUPING_INTERVAL_MS,
    revalidateOnFocus: false,
  })

  const contents = Array.isArray(data) ? data : []
  const loading = isLoading
  const err = error instanceof Error ? error.message : (error ? 'Failed to fetch kcontents' : null)

  return {
    contents,
    loading,
    error: err,
  }
}

export function useKContentsByPOIId(poiId: string) {
  const key = poiId ? `/api/kcontents?poiId=${encodeURIComponent(poiId)}` : null
  const { data, error, isLoading } = useSWR<KContentJson[]>(key, kContentsFetcher, {
    dedupingInterval: DEDUPING_INTERVAL_MS,
    revalidateOnFocus: false,
  })

  const contents = Array.isArray(data) ? data : []
  const loading = !!poiId && isLoading
  const err = error instanceof Error ? error.message : (error ? 'Failed to fetch kcontents' : null)

  return {
    contents,
    loading,
    error: err,
  }
}

export function useKContentsBySubName(subName: string) {
  const key = subName ? `/api/kcontents?subName=${encodeURIComponent(subName)}` : null
  const { data, error, isLoading } = useSWR<KContentJson[]>(key, kContentsFetcher, {
    dedupingInterval: DEDUPING_INTERVAL_MS,
    revalidateOnFocus: false,
  })

  const contents = Array.isArray(data) ? data : []
  const loading = !!subName && isLoading
  const err = error instanceof Error ? error.message : (error ? 'Failed to fetch kcontents' : null)

  return {
    contents,
    loading,
    error: err,
  }
}
