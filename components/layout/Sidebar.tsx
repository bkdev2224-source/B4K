"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSidebar } from '@/components/providers/SidebarContext'
import { useCart } from '@/components/providers/CartContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useSidebar()
  const { cartItems } = useCart()
  
  // POI 타입만 필터링하여 개수 계산
  const poiCartCount = cartItems.filter(item => item.type === 'poi').length

  // Allow closing the sidebar with Escape (helps keyboard users, especially on mobile).
  useEffect(() => {
    if (!sidebarOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleSidebar()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [sidebarOpen, toggleSidebar])
  
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Map',
      href: '/maps',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
      badgeCount: poiCartCount,
    },
     {
      name: 'Contents',
      href: '/contents',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6h8M12 12h8M12 18h8M4 6h4v4H4V6zm0 6h4v4H4v-4zm0 6h4v4H4v-4z"
          />
        </svg>
      ),
    },
    {
      name: 'Info',
      href: '/info',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M12 4a8 8 0 100 16 8 8 0 000-16z"
          />
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: '/mypage/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ]

  return (
    <>
      {/* Overlay for mobile - use button for keyboard accessibility */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-50 lg:hidden border-0 p-0 cursor-pointer"
          aria-label="Close sidebar overlay"
        />
      )}
      
      <div className={`${sidebarOpen ? 'w-[80vw] max-w-sm lg:w-[12.75%] lg:max-w-none' : 'w-[80vw] max-w-sm lg:w-[80px] lg:max-w-none'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 z-[60] transition-transform duration-300 lg:duration-0 lg:translate-x-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 flex-shrink-0 relative">
          {/* Top area: B4K Home button */}
          <div className="mb-6 flex items-center h-6">
            {/* B4K Home button - always positioned at same spot */}
            <Link
              href="/"
              className={`text-xl font-bold transition-[opacity] duration-300 cursor-pointer text-gray-900 dark:text-gray-100 absolute left-4 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
              }`}
            >
              B4K
            </Link>
            {/* Centered placeholder when collapsed (invisible but maintains layout) */}
            <span className={`text-xl font-bold text-transparent pointer-events-none mx-auto ${
                sidebarOpen ? 'hidden' : 'lg:block'
              }`}>
              B4K
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/' && pathname === '/') ||
              (item.href !== '/' && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`focus-ring group relative flex items-center gap-3 px-5 py-1.5 rounded-full transition-colors ${
                  isActive
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                {/* Highlight: active + hover share the same style (circle -> pill). */}
                <span
                  aria-hidden="true"
                  className={`absolute left-5 top-1/2 -translate-y-1/2 h-11 rounded-full bg-gray-100 dark:bg-gray-800 transition-[width,opacity] duration-300 ease-out ${
                    sidebarOpen ? 'w-[calc(100%-2.5rem)]' : 'w-11'
                  } ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />

                <span
                  className="relative z-10 w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0"
                >
                  <span className={`${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'} [&>svg]:stroke-current`}>
                    {item.icon}
                    {item.badgeCount !== undefined && item.badgeCount > 0 && (
                      <span className="absolute top-0 right-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 translate-x-1/2 -translate-y-1/2">
                        {item.badgeCount > 9 ? '9+' : item.badgeCount}
                      </span>
                    )}
                  </span>
                </span>
                <span
                  className={`relative z-10 font-medium whitespace-nowrap overflow-hidden transition-[max-width,opacity,transform] duration-300 ${
                    sidebarOpen ? 'max-w-40 opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-2'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom button - always visible */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2 relative">
          <button
            type="button"
            onClick={toggleSidebar}
            className="focus-ring w-full py-3 rounded-lg flex items-center justify-center transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 relative"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {/* Expand icon - always centered */}
            <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-0' : 'opacity-100'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            {/* Collapse icon - right aligned when expanded */}
            <span className={`absolute inset-0 flex items-center transition-[opacity,transform] duration-300 ${
              sidebarOpen ? 'opacity-100 justify-end pr-4' : 'opacity-0 justify-center'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

