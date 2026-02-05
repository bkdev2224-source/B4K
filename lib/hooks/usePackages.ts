"use client"

import { useEffect, useState } from 'react'
import type { TravelPackageJson } from '@/types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch (${res.status}). ${text}`)
  }
  return (await res.json()) as T
}

export function usePackages(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const [packages, setPackages] = useState<TravelPackageJson[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchJson<TravelPackageJson[]>('/api/packages')
      .then((data) => {
        if (cancelled) return
        setPackages(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (cancelled) return
        setPackages([])
        setError(err instanceof Error ? err.message : 'Failed to fetch packages')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return { packages, loading, error }
}

export function usePackageById(packageId: string, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const [pkg, setPkg] = useState<TravelPackageJson | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    if (!packageId) {
      setPkg(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    fetchJson<TravelPackageJson | null>(`/api/packages?packageId=${encodeURIComponent(packageId)}`)
      .then((data) => {
        if (cancelled) return
        setPkg(data ?? null)
      })
      .catch((err) => {
        if (cancelled) return
        setPkg(null)
        setError(err instanceof Error ? err.message : 'Failed to fetch package')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [packageId, enabled])

  return { pkg, loading, error }
}


