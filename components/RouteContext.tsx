"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { Route } from '@/lib/services/routes'

interface RouteContextType {
  selectedRoute: Route | null
  setSelectedRoute: (route: Route | null) => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export function RouteProvider({ children }: { children: ReactNode }) {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  return (
    <RouteContext.Provider value={{ selectedRoute, setSelectedRoute }}>
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

