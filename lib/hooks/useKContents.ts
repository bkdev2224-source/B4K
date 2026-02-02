"use client"

import { useState, useEffect } from 'react'
import type { KContentJson } from '@/types'

async function fetchKContents(url: string): Promise<KContentJson[]> {
  const res = await fetch(url)
  if (!res.ok) {
    // API가 500이면 보통 { error: "..." } 형태가 오므로 텍스트로 남김
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch kcontents (${res.status}). ${text}`)
  }

  const data = await res.json()
  if (!Array.isArray(data)) {
    // { error: ... } 같은 형태가 오면 여기로 들어옴 → UI 크래시 방지
    throw new Error('Invalid kcontents response (expected array).')
  }
  return data as KContentJson[]
}

/**
 * 클라이언트 컴포넌트에서 KContents를 가져오는 훅
 */
export function useKContents() {
  const [contents, setContents] = useState<KContentJson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchKContents('/api/kcontents')
      .then((data) => {
        if (cancelled) return
        setContents(data)
      })
      .catch((err) => {
        if (cancelled) return
        setContents([])
        setError(err instanceof Error ? err.message : 'Failed to fetch kcontents')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { contents, loading, error }
}

export function useKContentsByCategory(category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival' | 'kdrama') {
  const [contents, setContents] = useState<KContentJson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchKContents(`/api/kcontents?category=${category}`)
      .then((data) => {
        if (cancelled) return
        setContents(data)
      })
      .catch((err) => {
        if (cancelled) return
        setContents([])
        setError(err instanceof Error ? err.message : 'Failed to fetch kcontents')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [category])

  return { contents, loading, error }
}

export function useKContentsByPOIId(poiId: string) {
  const [contents, setContents] = useState<KContentJson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!poiId) {
      setLoading(false)
      return
    }
    
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchKContents(`/api/kcontents?poiId=${encodeURIComponent(poiId)}`)
      .then((data) => {
        if (cancelled) return
        setContents(data)
      })
      .catch((err) => {
        if (cancelled) return
        setContents([])
        setError(err instanceof Error ? err.message : 'Failed to fetch kcontents')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [poiId])

  return { contents, loading, error }
}

export function useKContentsBySubName(subName: string) {
  const [contents, setContents] = useState<KContentJson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!subName) {
      setLoading(false)
      return
    }
    
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchKContents(`/api/kcontents?subName=${encodeURIComponent(subName)}`)
      .then((data) => {
        if (cancelled) return
        setContents(data)
      })
      .catch((err) => {
        if (cancelled) return
        setContents([])
        setError(err instanceof Error ? err.message : 'Failed to fetch kcontents')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [subName])

  return { contents, loading, error }
}

