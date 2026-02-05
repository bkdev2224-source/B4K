"use client"

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarPlus } from 'lucide-react'
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
          console.log('🔘 [PoiActionButtons] Cart 버튼 클릭:', {
            poiId,
            poiName,
            cartItemId,
            inCart,
            timestamp: new Date().toISOString(),
          })
          
          if (inCart) {
            console.log('➖ [PoiActionButtons] 장바구니에서 제거:', cartItemId)
            removeFromCart(cartItemId)
          } else {
            const cartItem = {
              id: cartItemId,
              name: poiName,
              type: 'poi' as const,
              poiId,
            }
            console.log('➕ [PoiActionButtons] 장바구니에 추가 시도:', cartItem)
            addToCart(cartItem)
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
        <CalendarPlus
          className={`w-7 h-7 transition-colors ${inCart ? 'text-white dark:text-gray-900' : 'text-white'}`}
        />
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

