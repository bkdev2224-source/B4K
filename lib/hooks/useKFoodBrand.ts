'use client'

import { useState, useEffect } from 'react'
import type { KFoodBrand } from '@/lib/db/kfood-brands'

async function fetchKFoodBrand(name: string): Promise<KFoodBrand | null> {
  const res = await fetch(`/api/kfood-brands?name=${encodeURIComponent(name)}`)
  if (!res.ok) return null
  const data = await res.json()
  return data.brand ?? null
}

/**
 * name(브랜드명)으로 kfood_brands 1건 조회
 */
export function useKFoodBrand(name: string | null) {
  const [brand, setBrand] = useState<KFoodBrand | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!name?.trim()) {
      setBrand(null)
      return
    }
    let cancelled = false
    setLoading(true)
    fetchKFoodBrand(name.trim())
      .then((data) => {
        if (!cancelled) setBrand(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [name])

  return { brand, loading }
}

