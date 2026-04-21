import { useEffect, useState } from 'react'
import { StarRating } from '@ui/components/StarRating'
import { MAX_CART_ITEM_QTY } from '@/config/constants'

type Props = {
  productTitle: string
  productDesc: string
  price: number
  compareAtPrice?: number
  discountPercentOverride?: number
  badge?: string
  ratingValue: number
  ratingLabel: string
  canonicalUrl: string
  onAdd: () => void
  onBuy: () => void
  isAdding: boolean
  justAdded: boolean
  quantity: number
  setQuantity: (qty: number) => void
}

type TrustMicroProps = {
  ratingValue: number
  reviewCountLabel: string
  showShipping?: boolean
  compact?: boolean
}

export const TrustMicro = ({ ratingValue, reviewCountLabel, showShipping = true, compact = false }: TrustMicroProps) => (
  <div className={`flex items-center gap-2 text-sm font-semibold text-semantic-text-primary/80 ${compact ? 'justify-center' : ''}`}>
    <div className="flex items-center gap-1.5">
      <StarRating value={ratingValue} size={15} />
      <span className="text-base font-semibold text-semantic-text-primary">{ratingValue.toFixed(1)}</span>
    </div>
    <span className="text-semantic-text-primary/75">({reviewCountLabel})</span>
    {showShipping ? <span className="text-semantic-text-primary/70">• Free returns • Ships in 48h</span> : null}
  </div>
)

export const PriceBlock = ({
  productTitle,
  productDesc,
  price,
  compareAtPrice,
  discountPercentOverride,
  badge,
  ratingValue,
  ratingLabel,
  canonicalUrl,
  onAdd,
  onBuy,
  isAdding,
  justAdded,
  quantity,
  setQuantity,
}: Props) => {
  const [shareToast, setShareToast] = useState<string | null>(null)

  useEffect(() => {
    if (!shareToast) return
    const id = window.setTimeout(() => setShareToast(null), 2000)
    return () => window.clearTimeout(id)
  }, [shareToast])

  return (
    <div className="space-y-5 text-semantic-text-primary min-w-0 w-full md:pl-0 overflow-visible">
      <div className="overflow-visible">
        <div id="pdp-hero-text" className="h-0 scroll-mt-24" />
        <div className="mt-2 flex items-start gap-3">
          <h1 className="font-heading text-[1.95rem] font-bold leading-tight md:text-4xl">{productTitle}</h1>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {shareToast ? (
              <span className="rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-3 py-1 text-xs font-semibold text-semantic-text-primary shadow-soft">
                {shareToast}
              </span>
            ) : null}
            <button
              type="button"
              aria-label="Share product"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary shadow-soft transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/50"
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({ title: productTitle, url: canonicalUrl })
                    setShareToast('Shared')
                  } catch {
                    // User cancelled / share not completed — avoid noisy errors.
                  }
                  return
                }

                try {
                  if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(canonicalUrl)
                    setShareToast('Link copied')
                    return
                  }

                  window.prompt('Copy this link:', canonicalUrl)
                  setShareToast('Copy link')
                } catch {
                  window.prompt('Copy this link:', canonicalUrl)
                  setShareToast('Copy link')
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                <path d="M16 6l-4-4-4 4" />
                <path d="M12 2v14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Short subtitle/hook - uses productDesc prop */}
        <p className="mt-2 text-base font-medium text-semantic-text-primary">{productDesc}</p>

        {/* Trust signal - rating above the fold */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <StarRating value={ratingValue} size={16} />
            <span className="text-sm font-semibold text-semantic-text-primary">{ratingValue.toFixed(1)}</span>
            <span className="text-sm text-semantic-text-primary/70">({ratingLabel})</span>
          </div>
          <span className="h-4 w-px bg-semantic-text-primary/20" />
          <span className="text-sm text-semantic-text-primary/70 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Free returns
          </span>
        </div>

        {/* Review snippet - social proof near CTA */}
        <div className="mt-3 rounded-xl bg-semantic-legacy-brand-blush/20 p-3 border border-semantic-legacy-brand-blush/30">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-amber-500 text-sm">★★★★★</span>
          </div>
          <p className="text-sm text-semantic-text-primary/80 italic leading-relaxed">
            "Finally a towel that actually fits all my hair. Dries so much faster and my frizz is basically gone!"
          </p>
          <p className="text-xs text-semantic-text-primary/60 mt-2">
            — Amelia, verified buyer
          </p>
        </div>

        <div id="pdp-hero-price" className="h-0 scroll-mt-24" />
        <div id="pdp-hero-badge" className="h-0 scroll-mt-24" />

        {/* Price section - larger, more prominent */}
        <div className="mt-4">
          {compareAtPrice && compareAtPrice > price ? (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-4xl font-bold text-semantic-text-primary leading-tight md:text-5xl">£{price.toFixed(2)}</span>
              <span className="text-base font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Save {discountPercentOverride ?? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%
              </span>
              <span className="text-base text-semantic-text-primary/50 line-through">
                £{compareAtPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-4xl font-bold text-semantic-text-primary leading-tight md:text-5xl">£{price.toFixed(2)}</span>
          )}
        </div>

        {/* Badges row - below price */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {/* Stock indicator - creates urgency */}
          <div className="inline-flex items-center gap-2 rounded-full bg-semantic-legacy-brand-blush/20 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-semantic-legacy-brand-cocoa" aria-hidden="true" />
            <span className="font-semibold text-semantic-text-primary">
              Selling fast
            </span>
          </div>

          {/* Shipping indicator */}
          <div className="inline-flex items-center gap-1.5 text-semantic-text-primary/80">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="font-semibold">Free shipping</span>
          </div>

          {/* Remove promotional badges like "Buy 2, save 10%" */}
          {badge && badge.toLowerCase() !== 'buy 2, save 10%' && badge.toLowerCase() !== 'buy 2, save 5%' && (
            <div className="inline-flex items-center rounded-full bg-white px-4 py-1 font-semibold uppercase tracking-[0.3em] text-semantic-text-primary shadow-soft">
              {badge}
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-semantic-text-primary/60">
          Dispatch target: 48h · Free 30-day returns
        </div>
        <div className="mt-3 space-y-1">
          <label htmlFor="pdp-quantity" className="sr-only">
            Quantity
          </label>
          <div className="flex items-center justify-between rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-2 py-2 shadow-sm">
            {/* Decrease button */}
            <button
              type="button"
              id="pdp-quantity-decrease"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-semantic-legacy-brand-blush/30 text-semantic-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/50"
              aria-label="Decrease quantity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
              </svg>
            </button>

            {/* Quantity and total display */}
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-semantic-text-primary">
                {quantity}
              </span>
              <span className="text-[11px] font-semibold text-semantic-text-primary/60 uppercase tracking-wider">
                £{(price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Increase button */}
            <button
              type="button"
              id="pdp-quantity-increase"
              onClick={() => quantity < MAX_CART_ITEM_QTY && setQuantity(quantity + 1)}
              disabled={quantity >= MAX_CART_ITEM_QTY}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-semantic-accent-cta text-semantic-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/50"
              aria-label="Increase quantity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          {quantity >= MAX_CART_ITEM_QTY && (
            <p className="mt-1 text-xs text-semantic-text-primary/60 text-center">
              Maximum {MAX_CART_ITEM_QTY} per order
            </p>
          )}
        </div>
        <div className="mt-4 grid gap-3">
          <button
            className={`inline-flex w-full items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-4 text-base font-bold text-white shadow-[0_12px_28px_rgba(85,54,42,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(85,54,42,0.35)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-semantic-legacy-brand-cocoa/50 focus-visible:ring-offset-2 ${justAdded ? 'motion-safe:animate-pulse motion-reduce:animate-none' : ''}`}
            onClick={onAdd}
            disabled={isAdding}
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Adding to Cart...
              </span>
            ) : 'Add to Cart'}
          </button>
          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-semantic-legacy-brand-blush/70 px-6 py-3 text-base font-semibold text-semantic-legacy-brand-cocoa shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-semantic-legacy-brand-cocoa/50 focus-visible:ring-offset-2"
            onClick={onBuy}
            disabled={isAdding}
          >
            {isAdding ? 'Processing...' : 'Buy Now'}
          </button>
        </div>

        {/* Trust badges - payment methods and security */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-3 text-xs text-semantic-text-primary/50">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secure checkout
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              30-day guarantee
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 opacity-60">
            <span className="text-xs font-semibold bg-white px-2 py-1 rounded border">VISA</span>
            <span className="text-xs font-semibold bg-white px-2 py-1 rounded border">MC</span>
            <span className="text-xs font-semibold bg-white px-2 py-1 rounded border">Apple Pay</span>
            <span className="text-xs font-semibold bg-white px-2 py-1 rounded border">G Pay</span>
          </div>
        </div>

      </div>
    </div>
  )
}
