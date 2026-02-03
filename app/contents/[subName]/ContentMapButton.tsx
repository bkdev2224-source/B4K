"use client"

import { useRouter } from 'next/navigation'
import { useSearchResult } from '@/components/providers/SearchContext'

export default function ContentMapButton({ subName }: { subName: string }) {
  const router = useRouter()
  const { setSearchResult } = useSearchResult()

  return (
    <button
      type="button"
      onClick={() => {
        setSearchResult({
          name: subName,
          type: 'content',
          subName,
        })
        router.push('/maps')
      }}
      className="focus-ring flex-shrink-0 p-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full hover:bg-black/50 transition-colors"
      aria-label="View on Map"
      title="View on Map"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    </button>
  )
}

