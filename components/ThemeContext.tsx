"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to light unless user explicitly chooses otherwise.
  const [theme, setTheme] = useState<Theme>('light')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedTheme(theme)
      }
    }

    updateResolvedTheme()

    mediaQuery.addEventListener('change', updateResolvedTheme)
    return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
  }, [theme])

  // Apply theme to document (skip first run — inline script in head already set it)
  const isFirstApply = useRef(true)
  useEffect(() => {
    if (isFirstApply.current) {
      isFirstApply.current = false
      return
    }
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  // Save theme preference
  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme: handleSetTheme, resolvedTheme }),
    [theme, handleSetTheme, resolvedTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
