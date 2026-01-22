"use client"

import { useState, useEffect } from 'react'
import { KContent } from '@/lib/data'

/**
 * 클라이언트 컴포넌트에서 KContents를 가져오는 훅
 */
export function useKContents() {
  const [contents, setContents] = useState<KContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/kcontents')
      .then(res => res.json())
      .then(data => {
        setContents(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { contents, loading, error }
}

export function useKContentsByCategory(category: 'kpop' | 'kbeauty' | 'kfood' | 'kfestival') {
  const [contents, setContents] = useState<KContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/kcontents?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setContents(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [category])

  return { contents, loading, error }
}

export function useKContentsByPOIId(poiId: string) {
  const [contents, setContents] = useState<KContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!poiId) {
      setLoading(false)
      return
    }
    
    fetch(`/api/kcontents?poiId=${poiId}`)
      .then(res => res.json())
      .then(data => {
        setContents(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [poiId])

  return { contents, loading, error }
}

export function useKContentsBySubName(subName: string) {
  const [contents, setContents] = useState<KContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!subName) {
      setLoading(false)
      return
    }
    
    fetch(`/api/kcontents?subName=${encodeURIComponent(subName)}`)
      .then(res => res.json())
      .then(data => {
        setContents(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [subName])

  return { contents, loading, error }
}

