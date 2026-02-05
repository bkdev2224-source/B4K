"use client"

import { useMemo } from 'react'
import { CalendarPlus } from 'lucide-react'
import { useCart } from '@/components/providers/CartContext'

export default function PackageCartButton({
  packageId,
  name,
}: {
  packageId: string
  name: string
}) {
  const { addToCart, removeFromCart, isInCart } = useCart()

  const cartItemId = useMemo(() => `package-${packageId}`, [packageId])
  const inCart = isInCart(cartItemId)

  return (
    <button
      type="button"
      onClick={() => {
        if (inCart) {
          removeFromCart(cartItemId)
        } else {
          addToCart({
            id: cartItemId,
            name,
            type: 'package',
            packageId,
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
      <CalendarPlus
        className={`w-7 h-7 transition-colors ${inCart ? 'text-white dark:text-gray-900' : 'text-white'}`}
      />
    </button>
  )
}

