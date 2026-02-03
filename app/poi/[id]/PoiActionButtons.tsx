"use client"

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/providers/CartContext'
import { useSearchResult } from '@/components/providers/SearchContext'

export default function PoiActionButtons({
  poiId,
  poiName,
}: {
  poiId: string
  poiName: string
}) {
  const router = useRouter()
  const { setSearchResult } = useSearchResult()
  const { addToCart, removeFromCart, isInCart } = useCart()

  const cartItemId = useMemo(() => `poi-${poiId}`, [poiId])
  const inCart = isInCart(cartItemId)

  return (
    <div className="ml-4 flex gap-3">
      {/* Cart button */}
      <button
        type="button"
        onClick={() => {
          if (inCart) {
            removeFromCart(cartItemId)
          } else {
            addToCart({
              id: cartItemId,
              name: poiName,
              type: 'poi',
              poiId,
            })
          }
        }}
        className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-[transform,box-shadow] hover:scale-105 ${
          inCart
            ? 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200'
            : 'bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/50'
        }`}
        aria-label={inCart ? 'Remove from Cart' : 'Add to Cart'}
        title={inCart ? 'Remove from Cart' : 'Add to Cart'}
      >
        <svg
          className={`w-7 h-7 transition-colors ${inCart ? 'text-white dark:text-gray-900' : 'text-white'}`}
          fill={inCart ? 'currentColor' : 'none'}
          stroke={inCart ? 'none' : 'currentColor'}
          viewBox="0 0 24 24"
        >
          {inCart ? (
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.15.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          )}
        </svg>
      </button>

      {/* Map button */}
      <button
        type="button"
        onClick={() => {
          setSearchResult({
            name: poiName,
            type: 'poi',
            poiId,
          })
          router.push('/maps')
        }}
        className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full shadow-lg hover:shadow-xl transition-[transform,box-shadow] hover:scale-105"
        aria-label="View on Map"
        title="View on Map"
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      </button>
    </div>
  )
}

