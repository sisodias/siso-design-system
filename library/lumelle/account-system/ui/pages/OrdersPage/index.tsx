import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth as useClerkAuth } from '@clerk/clerk-react'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { Seo } from '@/components/Seo'
import { SUPPORT_EMAIL, WHATSAPP_SUPPORT_URL } from '@/config/constants'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'
import { OrderCard, fetchShopifyOrders, type Order } from '../../shared'

type StatusFilter = 'all' | 'processing' | 'shipped' | 'delivered'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [customerExists, setCustomerExists] = useState<boolean | undefined>(undefined)
  const { getToken, isSignedIn } = useClerkAuth()

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      setError(null)

      if (!isSignedIn) {
        setLoading(false)
        setError('Please sign in to view your orders')
        return
      }

      try {
        // Get Clerk session token
        const clerkToken = await getToken()

        if (!clerkToken) {
          setError('Authentication required. Please sign in again.')
          setLoading(false)
          return
        }

        const result = await fetchShopifyOrders(clerkToken)

        if (result.error) {
          setError(result.error)
        } else {
          setOrders(result.orders)
          setCustomerExists(result.customerExists)
        }
      } catch (err) {
        console.error('Error loading orders:', err)
        setError('Failed to load orders. Please try again.')
      }

      setLoading(false)
    }

    loadOrders()
  }, [getToken, isSignedIn])

  // Filter orders based on status and search
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter === 'processing' && order.fulfillmentStatus !== 'unfulfilled') return false
    if (statusFilter === 'shipped' && order.fulfillmentStatus !== 'fulfilled') return false
    // Note: 'delivered' would require tracking API to determine

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.lineItems.nodes.some((item) => item.title.toLowerCase().includes(query))
      )
    }

    return true
  })

  const filteredCount = filteredOrders.length
  const hasOrders = orders.length > 0

  return (
    <>
      <Seo title="Orders" description="Your Lumelle receipts and tracking links." url={toPublicUrl('/account/orders')} type="website" />
      <MarketingLayout navItems={[]} subtitle="Orders">
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-5 py-14 md:px-6">
            {/* Header */}
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Account</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-semantic-text-primary">Your orders</h1>
            <p className="mt-2 text-sm leading-relaxed text-semantic-text-primary/70">
              Track your order history, view details, and manage returns.
            </p>

            {/* Support links - shown when no orders */}
            {!hasOrders && !loading && (
              <div className="mt-8 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/50 p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">
                  {customerExists === false ? 'No orders found for this account' : 'No orders yet'}
                </p>
                <p className="mt-2 text-sm text-semantic-text-primary/70">
                  {customerExists === false
                    ? "We couldn't find any orders associated with your email address. If you've placed an order, please make sure you're signed in with the same email you used at checkout."
                    : "If you've placed an order, please make sure you're signed in with the same account you used at checkout."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/order/track"
                    className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                  >
                    Track an order
                  </Link>
                  <Link
                    to="/returns"
                    className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                  >
                    Start a return
                  </Link>
                  <a
                    href={WHATSAPP_SUPPORT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                  >
                    Message support (WhatsApp)
                  </a>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Order help')}`}
                    className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                  >
                    Email support
                  </a>
                </div>
              </div>
            )}

            {/* Orders list */}
            {hasOrders && (
              <div className="mt-8">
                {/* Filters and search */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Search */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20 sm:max-w-xs"
                    />
                  </div>

                  {/* Status filter */}
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'processing', 'shipped'] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setStatusFilter(filter)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                          statusFilter === filter
                            ? 'bg-semantic-legacy-brand-cocoa text-white'
                            : 'border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary hover:bg-brand-porcelain/60'
                        }`}
                      >
                        {filter}
                        {filter !== 'all' && <span className="ml-1 opacity-70">({filteredCount})</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loading state */}
                {loading && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-32 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/30 motion-safe:animate-pulse motion-reduce:animate-none" />
                    ))}
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-semibold text-red-800">Failed to load orders</p>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    <p className="mt-3 text-xs text-red-600">
                      Please ensure you're signed in with the same account used at checkout.
                    </p>
                  </div>
                )}

                {/* Orders */}
                {!loading && !error && (
                  <>
                    {filteredOrders.length === 0 ? (
                      <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/60 p-10 text-center">
                        <p className="text-sm text-semantic-text-primary/70">
                          {searchQuery || statusFilter !== 'all'
                            ? `No orders match your ${searchQuery ? 'search' : 'filter'} criteria.`
                            : 'No orders found.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((order) => (
                          <OrderCard key={order.id} order={order} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Bottom navigation */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/account"
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white"
              >
                Back to account
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                View cart
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                Back to shop
              </Link>
            </div>
          </div>
        </section>
      </MarketingLayout>
    </>
  )
}
