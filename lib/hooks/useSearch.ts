"use client"

import { useState, useMemo } from 'react'

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const isSearchMode = useMemo(() => {
    return isSearchFocused || searchQuery.length > 0
  }, [isSearchFocused, searchQuery])

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSearchBack = () => {
    setIsSearchFocused(false)
    setSearchQuery('')
  }

  return {
    searchQuery,
    isSearchFocused,
    isSearchMode,
    setSearchQuery,
    setIsSearchFocused,
    handleSearchFocus,
    handleSearchChange,
    handleSearchBack,
  }
}

