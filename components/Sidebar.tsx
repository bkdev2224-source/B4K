"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from './SidebarContext'

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useSidebar()
  
  const navItems = [
    { name: 'Home', href: '/', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: 'Package', href: '/package', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { name: 'Maps', href: '/maps', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { name: 'Contents', href: '/contents', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
      
      <div className={`${sidebarOpen ? 'w-[12.75%]' : 'w-[80px]'} bg-gradient-to-b from-purple-800/30 to-purple-900/30 backdrop-blur-sm border-r border-purple-400/30 h-screen fixed left-0 top-0 z-40 transition-all duration-300 lg:translate-x-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className={`${sidebarOpen ? 'p-6' : 'p-4'} transition-all duration-300 flex-shrink-0`}>
          {/* 상단 영역: B4K 홈 버튼 */}
          <div className={`mb-6 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            {/* B4K 홈 버튼 */}
            <Link
              href="/"
              className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-colors cursor-pointer"
            >
              B-4K
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
                    ? `bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white ${sidebarOpen ? 'border-l-4 border-purple-400' : ''}`
                    : 'text-gray-400 hover:text-white hover:bg-purple-900/20'
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                {item.icon}
                <span className={`font-medium transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* 하단 버튼 - 항상 표시 */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <button
            onClick={toggleSidebar}
            className={`w-full py-3 text-white rounded-lg flex items-center transition-all ${
              sidebarOpen ? 'justify-end px-4' : 'justify-center'
            }`}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              // 접기 버튼: <<< 아이콘 (오른쪽 정렬)
              <>
                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <svg className="w-5 h-5 text-purple-300 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                <svg className="w-5 h-5 text-purple-300 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </>
            ) : (
              // 펼치기 버튼: >>> 아이콘
              <>
                <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-5 h-5 text-purple-300 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-5 h-5 text-purple-300 -ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

