'use client'

import { useState, useEffect } from 'react'
import type { KFestivalPlace } from '@/lib/db/kfestival-places'

async function fetchKFestivalPlace(name: string): Promise<KFestivalPlace | null> {
  const res = await fetch(`/api/kfestival-places?name=${encodeURIComponent(name)}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.place ?? null
}

/**
 * name(축제명)으로 kfestival_places 1건 조회
 */
export function useKFestivalPlace(name: string | null) {
  const [place, setPlace] = useState<KFestivalPlace | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!name?.trim()) {
      setPlace(null)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchKFestivalPlace(name.trim())
      .then((data) => {
        if (!cancelled) setPlace(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [name])

  return { place, loading }
}

