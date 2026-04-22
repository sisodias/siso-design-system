import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { Seo } from '@/components/Seo'
import { SUPPORT_EMAIL, WHATSAPP_SUPPORT_URL } from '@/config/constants'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'
import { Package, MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react'

interface ShopifyOrderResponse {
  order?: {
    id: string
    orderNumber: number
    processedAt: string
    financialStatus: string
    fulfillmentStatus: string
    currentTotalPrice: {
      amount: string
      currencyCode: string
    }
    totalShippingPrice: {
      amount: string
      currencyCode: string
    } | null
    subtotalPrice: {
      amount: string
      currencyCode: string
    }
    shippingAddress: {
      firstName: string
      lastName: string
      address1: string
      address2?: string
      city: string
      province: string
      zip: string
      country: string
    } | null
    billingAddress: {
      firstName: string
      lastName: string
      address1: string
      address2?: string
      city: string
      province: string
      zip: string
      country: string
    } | null
    lineItems: {
      edges: Array<{
        node: {
          id: string
          title: string
          quantity: number
          variant: {
            price: string
            compareAtPrice?: string
            image?: {
              url: string
              altText?: string
            }
          }
        }
      }>
    }
    successfulFulfillments: Array<{
      trackingInfo?: Array<{
        trackingNumber: string
        trackingUrl?: string
      }>
    }>
  }
  error?: { message: string }
}

async function fetchShopifyOrder(
  orderId: string,
  customerAccessToken?: string
): Promise<{ order?: ShopifyOrderResponse['order']; error?: string }> {
  if (!orderId) {
    return { error: 'Order ID is required' }
  }

  const query = `
    query customerOrder($customerAccessToken: String!, $orderId: ID!) {
      customer(customerAccessToken: $customerAccessToken) {
        order(id: $orderId) {
          id
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          currentTotalPrice {
            amount
            currencyCode
          }
          totalShippingPrice {
            amount
            currencyCode
          }
          subtotalPrice {
            amount
            currencyCode
          }
          shippingAddress {
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            country
          }
          billingAddress {
            firstName
            lastName
            address1
            address2
            city
            province
            zip
            country
          }
          lineItems(first: 20) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  price
                  compareAtPrice
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
          successfulFulfillments {
            trackingInfo {
              trackingNumber
              trackingUrl
            }
          }
        }
      }
    }
  `

  try {
    const response = await fetch(import.meta.env.VITE_SHOPIFY_STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: {
          customerAccessToken: customerAccessToken || '',
          orderId: `gid://shopify/Order/${orderId}`,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      return { error: data.errors[0].message }
    }

    const order = data.data?.customer?.order

    if (!order) {
      return { error: 'Order not found' }
    }

    return { order }
  } catch (error) {
    console.error('Error fetching order:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch order details',
    }
  }
}

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<ShopifyOrderResponse['order']>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true)
      setError(null)

      const customerAccessToken = localStorage.getItem('shopifyCustomerAccessToken')
      const result = await fetchShopifyOrder(orderId || '', customerAccessToken || undefined)

      if (result.error) {
        setError(result.error)
      } else {
        setOrder(result.order)
      }

      setLoading(false)
    }

    loadOrder()
  }, [orderId])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(t)
  }, [toast])

  const formatPrice = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
    }).format(parseFloat(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatAddress = (address: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    province: string
    zip: string
    country: string
  }) => {
    const { firstName, lastName, address1, address2, city, province, zip, country } = address
    const parts = [`${firstName} ${lastName}`, address1]
    if (address2) parts.push(address2)
    parts.push(`${city}`, `${province} ${zip}`, country)
    return parts.join(', ')
  }

  const reference = order ? order.orderNumber.toString() : (orderId || '').trim()

  const mailtoHref = useMemo(() => {
    const subject = `Order help${reference ? ` — ${reference}` : ''}`
    const lines = [
      'Hi Lumelle support,',
      '',
      'I need help with my order.',
      '',
      `Order reference: ${reference || '(not sure)'}`,
      '',
      'Thanks,',
    ]
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }, [reference])

  return (
    <>
      <Seo
        title="Order details"
        description="Order reference and quick links to tracking and support."
        url={toPublicUrl(reference ? `/account/orders/${reference}` : '/account/orders')}
        type="website"
      />
      <MarketingLayout navItems={[]} subtitle="Order">
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-5 py-14 md:px-6">
            {/* Header */}
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Account</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-semantic-text-primary">Order details</h1>

            {/* Loading */}
            {loading && (
              <div className="mt-8 space-y-6">
                <div className="h-48 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/30 motion-safe:animate-pulse motion-reduce:animate-none" />
                <div className="h-64 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/30 motion-safe:animate-pulse motion-reduce:animate-none" />
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <Package className="mx-auto h-12 w-12 text-red-400" />
                <p className="mt-4 text-sm font-semibold text-red-800">Unable to load order</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-sm"
                  >
                    Contact support
                  </a>
                  <Link
                    to="/account/orders"
                    className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
                  >
                    Back to orders
                  </Link>
                </div>
              </div>
            )}

            {/* Order details */}
            {order && !loading && (
              <div className="mt-8 space-y-6">
                {/* Order header */}
                <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-[13px] font-semibold text-semantic-text-primary">#{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-semantic-text-primary/60">Placed on {formatDate(order.processedAt)}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:items-end">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-semantic-text-primary/60">Total</p>
                      <p className="text-2xl font-bold text-semantic-text-primary">
                        {formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
                      </p>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.financialStatus === 'paid' && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1">
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-green-600">Paid</span>
                      </div>
                    )}
                    {order.fulfillmentStatus === 'fulfilled' ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1">
                        <Truck className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-600">Shipped</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1">
                        <Package className="h-3.5 w-3.5 text-gray-600" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-600">Processing</span>
                      </div>
                    )}
                  </div>

                  {/* Copy reference */}
                  <div className="mt-4 pt-4 border-t border-semantic-legacy-brand-blush/40">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-semantic-text-primary/60">Order reference</p>
                        <p className="mt-1 text-xs text-semantic-text-primary/60">Include this when contacting support</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {toast && (
                          <span
                            className="rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-3 py-1 text-xs font-semibold text-semantic-text-primary shadow-sm"
                            role="status"
                            aria-live="polite"
                          >
                            {toast}
                          </span>
                        )}
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-5 py-2.5 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                          onClick={async () => {
                            try {
                              if (navigator.clipboard?.writeText) {
                                await navigator.clipboard.writeText(order.orderNumber.toString())
                                setToast('Copied')
                                return
                              }
                            } catch {
                              // fall through
                            }
                            window.prompt('Copy this order reference:', order.orderNumber.toString())
                            setToast('Copied')
                          }}
                        >
                          Copy reference
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line items */}
                <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-semantic-text-primary">Items</h2>
                  <div className="mt-4 space-y-4">
                    {order.lineItems.edges.map(({ node: item }) => (
                      <div key={item.id} className="flex gap-4 border-b border-semantic-legacy-brand-blush/30 pb-4 last:border-0 last:pb-0">
                        {item.variant.image && (
                          <img
                            src={item.variant.image.url}
                            alt={item.variant.image.altText || item.title}
                            className="h-20 w-20 shrink-0 rounded-xl border border-semantic-legacy-brand-blush/40 object-cover"
                            loading="lazy"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-semantic-text-primary">{item.title}</p>
                          <p className="mt-1 text-xs text-semantic-text-primary/60">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-semantic-text-primary">
                            {formatPrice(item.variant.price, order.currentTotalPrice.currencyCode)}
                          </p>
                          {item.variant.compareAtPrice && (
                            <p className="mt-1 text-xs text-semantic-text-primary/50 line-through">
                              {formatPrice(item.variant.compareAtPrice, order.currentTotalPrice.currencyCode)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping and billing addresses */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {order.shippingAddress && (
                    <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6 shadow-sm">
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-semantic-text-primary">
                        <MapPin className="h-4 w-4" />
                        Shipping address
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-semantic-text-primary">
                        {formatAddress(order.shippingAddress)}
                      </p>
                    </div>
                  )}

                  {order.billingAddress && (
                    <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6 shadow-sm">
                      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-semantic-text-primary">
                        <CreditCard className="h-4 w-4" />
                        Billing address
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-semantic-text-primary">
                        {formatAddress(order.billingAddress)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Price summary */}
                <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/50 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-semantic-text-primary">Payment summary</h2>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-semantic-text-primary/80">Subtotal</span>
                      <span className="font-semibold text-semantic-text-primary">
                        {formatPrice(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}
                      </span>
                    </div>
                    {order.totalShippingPrice && (
                      <div className="flex justify-between text-sm">
                        <span className="text-semantic-text-primary/80">Shipping</span>
                        <span className="font-semibold text-semantic-text-primary">
                          {formatPrice(order.totalShippingPrice.amount, order.totalShippingPrice.currencyCode)}
                        </span>
                      </div>
                    )}
                    <div className="mt-3 flex justify-between border-t border-semantic-legacy-brand-blush/40 pt-3">
                      <span className="text-sm font-semibold text-semantic-text-primary">Total</span>
                      <span className="text-lg font-bold text-semantic-text-primary">
                        {formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tracking */}
                {order.successfulFulfillments && order.successfulFulfillments.length > 0 && (
                  <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-semantic-text-primary">Tracking</h2>
                    <div className="mt-4 space-y-3">
                      {order.successfulFulfillments.map((fulfillment, idx) => (
                        <div key={idx}>
                          {fulfillment.trackingInfo?.map((tracking) => (
                            <div key={tracking.trackingNumber} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-semantic-legacy-brand-blush/40 bg-white p-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-semantic-text-primary/60">
                                  Tracking number
                                </p>
                                <p className="font-mono text-sm text-semantic-text-primary">{tracking.trackingNumber}</p>
                              </div>
                              {tracking.trackingUrl && (
                                <a
                                  href={tracking.trackingUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-4 py-2 text-sm font-semibold text-semantic-text-primary hover:bg-brand-porcelain/60"
                                >
                                  Track shipment
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Support links */}
            <div className="mt-10 flex flex-wrap gap-3">
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
                Message on WhatsApp
              </a>
              <a
                href={mailtoHref}
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
              >
                Email support
              </a>
            </div>

            {/* Bottom navigation */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/account/orders"
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white"
              >
                Back to orders
              </Link>
              <Link
                to="/account"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                Account home
              </Link>
            </div>
          </div>
        </section>
      </MarketingLayout>
    </>
  )
}
