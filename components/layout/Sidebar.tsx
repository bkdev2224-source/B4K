"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/components/providers/SidebarContext'
import { useCart } from '@/components/providers/CartContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useSidebar()
  const { cartItems } = useCart()
  
  // POI 타입만 필터링하여 개수 계산
  const poiCartCount = cartItems.filter(item => item.type === 'poi').length
  
  const navItems = [
    { name: 'Home', href: '/', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: 'Map', href: '/maps', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ), badgeCount: poiCartCount },
    { name: 'Contents', href: '/contents', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h8M12 12h8M12 18h8M4 6h4v4H4V6zm0 6h4v4H4v-4zm0 6h4v4H4v-4z" />
      </svg>
    )},
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
      
      <div className={`${sidebarOpen ? 'w-[12.75%]' : 'w-[80px]'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 z-40 transition-all duration-300 lg:translate-x-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className={`${sidebarOpen ? 'p-6' : 'p-4'} transition-all duration-300 flex-shrink-0`}>
          {/* Top area: B4K Home button */}
          <div className={`mb-6 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            {/* B4K Home button */}
            <Link
              href="/"
              className="text-xl font-bold transition-colors cursor-pointer text-gray-900 dark:text-gray-100"
            >
              B4K
            </Link>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/' && pathname === '/') ||
              (item.href !== '/' && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-all ${
                  isActive
                    ? `${sidebarOpen ? 'border-l-4' : ''} bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100` 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={isActive && sidebarOpen ? { borderLeftColor: 'currentColor' } : {}}
                title={!sidebarOpen ? item.name : undefined}
              >
                <span className={`${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'} [&>svg]:stroke-current relative flex-shrink-0`}>
                  {item.icon}
                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className="absolute top-0 right-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 translate-x-1/2 -translate-y-1/2">
                      {item.badgeCount > 9 ? '9+' : item.badgeCount}
                    </span>
                  )}
                </span>
                <span className={`font-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom button - always visible */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <button
            onClick={toggleSidebar}
            className={`w-full py-3 rounded-lg flex items-center transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 ${
              sidebarOpen ? 'justify-end px-4' : 'justify-center'
            }`}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              // Collapse button: <<< icon (right aligned)
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </>
            ) : (
              // Expand button: >>> icon
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-5 h-5 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

