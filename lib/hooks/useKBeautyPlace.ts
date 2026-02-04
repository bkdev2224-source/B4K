'use client'

import { useState, useEffect } from 'react'
import type { KBeautyPlace } from '@/lib/db/kbeauty-places'

async function fetchKBeautyPlace(name: string): Promise<KBeautyPlace | null> {
  const res = await fetch(`/api/kbeauty-places?name=${encodeURIComponent(name)}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.place ?? null
}

/**
 * name(브랜드명)으로 kbeauty_places 1건 조회
 */
export function useKBeautyPlace(name: string | null) {
  const [place, setPlace] = useState<KBeautyPlace | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!name?.trim()) {
      setPlace(null)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchKBeautyPlace(name.trim())
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

