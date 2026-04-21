import { Link } from 'react-router-dom'
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react'

export interface Order {
  id: string
  orderNumber: string
  processedAt: string
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
      variant?: {
        price: { amount: number }
        image?: {
          url: string
          altText?: string
        }
      }
    }>
  }
}

interface OrderCardProps {
  order: Order
}

const statusConfig = {
  financial: {
    paid: { label: 'Paid', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    partially_paid: { label: 'Partially Paid', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    voided: { label: 'Voided', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  },
  fulfillment: {
    fulfilled: { label: 'Shipped', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    unfulfilled: { label: 'Processing', icon: Package, color: 'text-gray-600', bg: 'bg-gray-50' },
    restocked: { label: 'Restocked', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  },
} as const

function StatusBadge({ type, status }: { type: keyof typeof statusConfig; status: string }) {
  const statusConfigMap = statusConfig[type]
  if (!statusConfigMap) return null

  const config = statusConfigMap[status as keyof typeof statusConfigMap] as {
    icon: typeof CheckCircle
    label: string
    color: string
    bg: string
  } | undefined

  if (!config) return null

  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${config.bg}`}>
      <Icon className={`h-3.5 w-3.5 ${config.color}`} />
      <span className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${config.color}`}>
        {config.label}
      </span>
    </div>
  )
}

export function OrderCard({ order }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
    }).format(amount / 100)
  }

  // Get first item image for thumbnail
  const thumbnailUrl = order.lineItems.nodes[0]?.variant?.image?.url
  const thumbnailAlt = order.lineItems.nodes[0]?.variant?.image?.altText || order.lineItems.nodes[0]?.title

  return (
    <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Order info */}
        <div className="flex min-w-0 flex-1 gap-4 sm:flex-row sm:items-center">
          {/* Thumbnail */}
          {thumbnailUrl && (
            <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-semantic-legacy-brand-blush/40 sm:block">
              <img
                src={thumbnailUrl}
                alt={thumbnailAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Order details */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <p className="font-mono text-[13px] font-semibold text-semantic-text-primary">
                #{order.orderNumber}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge type="financial" status={order.financialStatus} />
                <StatusBadge type="fulfillment" status={order.fulfillmentStatus} />
              </div>
            </div>
            <p className="text-xs text-semantic-text-primary/60">
              Placed on {formatDate(order.processedAt)}
            </p>
          </div>
        </div>

        {/* Right: Price and CTA */}
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-semantic-text-primary/60">
              Total
            </p>
            <p className="text-lg font-bold text-semantic-text-primary">
              {formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
            </p>
          </div>
          <Link
            to={`/account/orders/${order.id}`}
            className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-5 py-2.5 text-sm font-semibold text-semantic-text-primary shadow-sm transition hover:bg-brand-porcelain/60"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}
