"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

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

// 기본 POI 4개
const DEFAULT_POI_ITEMS: CartItem[] = [
  { id: 'poi-poi_001', name: 'COEX', type: 'poi', poiId: 'poi_001' },
  { id: 'poi-poi_002', name: 'Myeongdong Street', type: 'poi', poiId: 'poi_002' },
  { id: 'poi-poi_003', name: 'HYBE Insight', type: 'poi', poiId: 'poi_003' },
  { id: 'poi-poi_004', name: 'Gwangjang Market', type: 'poi', poiId: 'poi_004' },
]

// Load cart items from localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      const items = JSON.parse(stored) as CartItem[]
      // package 타입 제거
      const filteredItems = items.filter((item) => item.type !== 'package')
      
      // package가 제거되었다면 localStorage 업데이트
      if (filteredItems.length !== items.length) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filteredItems))
      }
      
      return filteredItems
    }
    
    return DEFAULT_POI_ITEMS
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
  }
  
  // 에러 발생 시에도 기본 POI 반환
  return DEFAULT_POI_ITEMS
}

// Save cart items to localStorage
function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return
  
  try {
    // 기본 POI 4개는 항상 포함
    const defaultPoiIds = DEFAULT_POI_ITEMS.map(item => item.id)
    
    // 현재 items에서 기본 POI 제외
    const userItems = items.filter(item => !defaultPoiIds.includes(item.id))
    
    // 기본 POI와 사용자 아이템 합치기 (중복 제거)
    const itemsToSave = [
      ...DEFAULT_POI_ITEMS,
      ...userItems.filter(item => item.type !== 'package') // package 타입 제외
    ]
    
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itemsToSave))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // 서버와 클라이언트 간 Hydration 에러 방지를 위해 초기값은 빈 배열
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

  const addToCart = useCallback((item: CartItem) => {
        
    // package 타입은 추가하지 않음
    if (item.type === 'package') {
      return
    }
    
    setCartItems((prev) => {
      // 이미 장바구니에 있는지 확인
      const exists = prev.some((cartItem) => cartItem.id === item.id)
      if (exists) {
        return prev
      }
      
      const newCartItems = [...prev, item]
      return newCartItems
    })
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => {
      const removedItem = prev.find((item) => item.id === id)
      const newCartItems = prev.filter((item) => item.id !== id)
      
      return newCartItems
    })
  }, [])

  const isInCart = useCallback(
    (id: string) => cartItems.some((item) => item.id === id),
    [cartItems]
  )

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      isInCart,
      clearCart,
    }),
    [cartItems, addToCart, removeFromCart, isInCart, clearCart]
  )

  return (
    <CartContext.Provider value={value}>
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

