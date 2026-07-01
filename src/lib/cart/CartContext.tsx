'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem } from '@/lib/cart/types'

const STORAGE_KEY = 'miestampa:cart'

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  incrementQuantity: (id: string) => void
  decrementQuantity: (id: string) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // localStorage no disponible o dato corrupto: arrancamos con carrito vacío
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    return {
      items,
      addItem: (item) =>
        setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }]),
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      incrementQuantity: (id) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))),
      decrementQuantity: (id) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
        ),
      clear: () => setItems([]),
      count,
      subtotal
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
