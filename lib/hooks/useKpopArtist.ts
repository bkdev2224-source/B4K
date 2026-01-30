'use client'

import { useState, useEffect } from 'react'
import type { KpopArtist } from '@/lib/db/kpop-artists'

async function fetchKpopArtist(name: string): Promise<KpopArtist | null> {
  const res = await fetch(`/api/kpop-artists?name=${encodeURIComponent(name)}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.artist ?? null
}

/**
 * subName(아티스트명)으로 kpop_artists 1건 조회
 */
export function useKpopArtist(name: string | null) {
  const [artist, setArtist] = useState<KpopArtist | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!name?.trim()) {
      setArtist(null)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchKpopArtist(name.trim())
      .then((data) => {
        if (!cancelled) setArtist(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [name])

  return { artist, loading }
}
