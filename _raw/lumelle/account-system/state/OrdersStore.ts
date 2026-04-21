import { createSupabaseClient, supabase } from '@platform/storage/supabase'

export type OrderItem = { id: string; title: string; price: number; qty: number }
export type OrderEvent = { at: string; message: string }
export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  placedAt: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  events: OrderEvent[]
  tracking?: string
}

const KEY = 'lumelle_orders'
const TABLE = 'orders'

const getClient = (authToken?: string) => {
  if (authToken) return createSupabaseClient(authToken)
  return supabase
}

const getCachedOrders = (): Order[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch (error) {
    console.warn('Failed to read cached orders', error)
    return []
  }
}

const saveOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(orders))
  } catch (error) {
    console.warn('Failed to cache orders locally', error)
  }
}

const mergeIntoCache = (order: Order) => {
  const next = [order, ...getCachedOrders().filter((existing) => existing.id !== order.id)]
  saveOrders(next)
}

export const fetchOrders = async (authToken?: string): Promise<Order[]> => {
  const client = getClient(authToken)
  if (!client) return getCachedOrders()

  const { data, error } = await client.from(TABLE).select('*').order('placedAt', { ascending: false })

  if (error) {
    console.error('Supabase fetchOrders failed; falling back to cache', error)
    return getCachedOrders()
  }

  const orders = (data ?? []) as Order[]
  saveOrders(orders)
  return orders
}

export const fetchOrderById = async (id: string, authToken?: string): Promise<Order | null> => {
  if (!id) return null

  const client = getClient(authToken)

  if (!client) {
    return getCachedOrders().find((order) => order.id.toLowerCase() === id.toLowerCase()) ?? null
  }

  const { data, error } = await client.from(TABLE).select('*').eq('id', id).maybeSingle()

  if (error) {
    console.error(`Supabase fetchOrderById failed for ${id}; using cache`, error)
    return getCachedOrders().find((order) => order.id.toLowerCase() === id.toLowerCase()) ?? null
  }

  if (!data) return null

  const order = data as Order
  mergeIntoCache(order)
  return order
}

export const addOrder = async (order: Order, authToken?: string): Promise<void> => {
  mergeIntoCache(order)

  const client = getClient(authToken)
  if (!client) return

  const { error } = await client.from(TABLE).insert(order)
  if (error) {
    console.error('Supabase addOrder failed; order is only saved locally', error)
  }
}
