import type { Order } from '../components/OrderCard'

interface ShopifyOrdersResponse {
  orders: Order[]
  error?: string
  customerExists?: boolean
}

interface ClerkOrdersApiResponse {
  orders: Array<{
    id: string
    orderNumber: string
    name: string
    processedAt: string
    createdAt: string
    financialStatus: string
    fulfillmentStatus: string
    currentTotalPrice: {
      amount: number
      currencyCode: string
    }
    lineItems: {
      nodes: Array<{
        id: string
        title: string
        quantity: number
        variant: {
          price: { amount: number }
          image: { url: string; altText?: string } | null
        } | null
      }>
    }
  }>
  customerExists: boolean
  customerEmail?: string
}

/**
 * Fetch orders using Clerk authentication via our API
 * @param clerkToken - Clerk session token from getToken()
 * @returns Orders with error state
 */
export async function fetchShopifyOrders(clerkToken?: string): Promise<ShopifyOrdersResponse> {
  if (!clerkToken) {
    return { orders: [] }
  }

  try {
    const response = await fetch('/api/customer/orders-by-clerk', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${clerkToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        return { orders: [], error: 'Please sign in again' }
      }
      const errorData = await response.json().catch(() => ({}))
      return { orders: [], error: errorData.error || `Server error: ${response.status}` }
    }

    const data = await response.json() as ClerkOrdersApiResponse

    // Transform orders to match the Order interface exactly
    const orders: Order[] = (data.orders || []).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      processedAt: order.processedAt,
      financialStatus: order.financialStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      currentTotalPrice: order.currentTotalPrice,
      lineItems: {
        nodes: order.lineItems.nodes.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          variant: item.variant
            ? {
                price: item.variant.price,
                image: item.variant.image || undefined,
              }
            : undefined,
        })),
      },
    }))

    return {
      orders,
      customerExists: data.customerExists,
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return {
      orders: [],
      error: error instanceof Error ? error.message : 'Failed to fetch orders',
    }
  }
}
