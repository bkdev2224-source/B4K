"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  type: 'poi' | 'content' | 'package'
  poiId?: string
  subName?: string
  packageId?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  isInCart: (id: string) => boolean
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'b4k_cart_items'

// Load cart items from localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as CartItem[]
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
  }
  return []
}

// Save cart items to localStorage
function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadedItems = loadCartFromStorage()
    setCartItems(loadedItems)
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(cartItems)
    }
  }, [cartItems, isInitialized])

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // 이미 장바구니에 있는지 확인
      const exists = prev.some((cartItem) => cartItem.id === item.id)
      if (exists) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isInCart = (id: string) => {
    return cartItems.some((item) => item.id === id)
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        isInCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

