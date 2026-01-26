"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from "next-auth/react"
import Link from 'next/link'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
    )
  }

  if (session) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-400 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        >
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold">
              {session.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
            <div className="py-2">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {session.user?.email}
                </p>
              </div>
              
              <Link
                href="/mypage"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                MyPage
              </Link>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  signOut({ callbackUrl: "/" })
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href="/auth/signin"
      className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 transition-all font-semibold text-sm shadow-lg"
    >
      Sign In
    </Link>
  )
}

