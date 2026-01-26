"use client"

import { useEffect, useState } from 'react'
import type { POIJson } from '@/types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch (${res.status}). ${text}`)
  }
  return (await res.json()) as T
}

export function usePOIs() {
  const [pois, setPois] = useState<POIJson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchJson<POIJson[]>('/api/pois')
      .then((data) => {
        if (cancelled) return
        setPois(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (cancelled) return
        setPois([])
        setError(err instanceof Error ? err.message : 'Failed to fetch pois')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { pois, loading, error }
}

export function usePOIById(poiId: string) {
  const [poi, setPoi] = useState<POIJson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!poiId) {
      setPoi(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    fetchJson<POIJson | null>(`/api/pois?poiId=${encodeURIComponent(poiId)}`)
      .then((data) => {
        if (cancelled) return
        setPoi(data ?? null)
      })
      .catch((err) => {
        if (cancelled) return
        setPoi(null)
        setError(err instanceof Error ? err.message : 'Failed to fetch poi')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [poiId])

  return { poi, loading, error }
}


