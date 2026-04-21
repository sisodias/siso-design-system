'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface CartItem {
  source: string
  name: string
  displayName: string
  relativePath: string
  description: string
}

interface CartContextValue {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (source: string, name: string) => void
  clear: () => void
  has: (source: string, name: string) => boolean
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'siso-ds-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
  }, [items, hydrated])

  const add = (item: CartItem) => {
    setItems(prev => prev.some(p => p.source === item.source && p.name === item.name) ? prev : [...prev, item])
  }
  const remove = (source: string, name: string) => {
    setItems(prev => prev.filter(p => !(p.source === source && p.name === name)))
  }
  const clear = () => setItems([])
  const has = (source: string, name: string) => items.some(p => p.source === source && p.name === name)

  return (
    <CartContext.Provider value={{ items, add, remove, clear, has, count: items.length }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
