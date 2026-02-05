"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  isActive?: (pathname: string) => boolean
}

export default function MobileBottomNav() {
  const pathname = usePathname() || "/"

  const items: NavItem[] = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      isActive: (p) => p === "/",
    },
    {
      href: "/maps",
      label: "Map",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
      isActive: (p) => p === "/maps" || p.startsWith("/maps/"),
    },
    {
      href: "/contents",
      label: "Contents",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6h8M12 12h8M12 18h8M4 6h4v4H4V6zm0 6h4v4H4v-4zm0 6h4v4H4v-4z"
          />
        </svg>
      ),
      isActive: (p) => p === "/contents" || p.startsWith("/contents"),
    },
    {
      href: "/mypage/settings",
      label: "Settings",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      isActive: (p) => p === "/mypage/settings" || p.startsWith("/mypage/settings"),
    },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur"
      aria-label="Bottom navigation"
    >
      <div className="flex h-16 items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = item.isActive ? item.isActive(pathname) : pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "focus-ring flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0",
                active
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              {item.icon}
              <span className="text-[11px] font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

