"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from './AuthButton'

export default function TopNav() {
  const pathname = usePathname()
  
  const tabs = [
    { name: 'Package', href: '/package' },
    { name: 'Maps', href: '/maps' },
    { name: 'Contents', href: '/contents' },
  ]

  return (
    <div className="bg-black bg-opacity-30 backdrop-blur-sm h-16 fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 border-b border-purple-500/20">
      <Link
        href="/"
        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-colors cursor-pointer"
      >
        B-4K
      </Link>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || 
              (tab.href === '/' && pathname === '/') ||
              (tab.href !== '/' && pathname?.startsWith(tab.href))
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white border-b-2 border-purple-400 pb-1'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.name}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </div>
  )
}

