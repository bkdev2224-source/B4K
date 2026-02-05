"use client"

import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { Route } from '@/lib/services/routes'

interface RouteContextType {
  selectedRoute: Route | null
  setSelectedRoute: (route: Route | null) => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export function RouteProvider({ children }: { children: ReactNode }) {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  const value = useMemo(
    () => ({ selectedRoute, setSelectedRoute }),
    [selectedRoute]
  )

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const context = useContext(RouteContext)
  if (context === undefined) {
    throw new Error('useRoute must be used within a RouteProvider')
  }
  return context
}

