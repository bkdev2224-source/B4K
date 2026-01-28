"use client"

import { useState, useRef, useEffect } from 'react'
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
      <div className="w-8 h-8 rounded-full bg-purple-500/20 animate-pulse" />
    )
  }

  if (session) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400 hover:border-purple-300 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
        >
          {session.user?.image ? (
            // Use a plain <img> so this does NOT go through Next.js Image Optimizer.
            // This reduces the attack surface of `/_next/image` (and avoids remotePatterns for Google avatars).
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {session.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-purple-900/95 backdrop-blur-md rounded-lg shadow-xl border border-purple-500/30 overflow-hidden z-50">
            <div className="py-2">
              <div className="px-4 py-3 border-b border-purple-500/30">
                <p className="text-sm font-semibold text-white truncate">
                  {session.user?.name || 'User'}
                </p>
                <p className="text-xs text-purple-300 truncate">
                  {session.user?.email}
                </p>
              </div>
              
              <Link
                href="/mypage"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-800/50 hover:text-white transition-colors"
              >
                MyPage
              </Link>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  signOut({ callbackUrl: "/" })
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-purple-800/50 hover:text-red-300 transition-colors"
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
      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-400 hover:to-pink-400 hover:scale-105 transition-all font-semibold text-sm shadow-lg shadow-purple-500/30"
    >
      Sign In
    </Link>
  )
}

