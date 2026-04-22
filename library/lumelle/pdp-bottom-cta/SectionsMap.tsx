import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { homeConfig } from '@/content/home.config'
import type { Review as ReviewType } from '@/content/home.config'
import { FeatureCallouts, DetailsAccordion, ReviewsAutoCarousel, FaqSectionShop, FeaturedTikTok } from '@client/shop/products/ui/sections'
import { HeroMedia } from './HeroMedia'
import { PriceBlock } from './PriceBlock'
import { HowToSection } from './HowToSection'
import { ShoppingBag, Zap, X } from 'lucide-react'

// Mobile sticky CTA component
const MobileStickyCta = ({ price, onAdd, onBuy, isAdding, justAdded }: { price: number; onAdd: () => void; onBuy: () => void; isAdding: boolean; justAdded: boolean }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('pdp-hero')
      if (!hero) return

      const heroBottom = hero.getBoundingClientRect().bottom
      // Show when hero section has scrolled mostly out of view
      const shouldShow = heroBottom < 100 && !isDismissed

      // Hide when near the footer (bottom 300px of the page)
      const scrollPosition = window.scrollY + window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      const nearFooter = scrollPosition > pageHeight - 300

      setIsVisible(shouldShow && !nearFooter)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-semantic-accent-cta/30 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-safe sm:hidden">
      <div className="mx-auto flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 top-2 rounded-full p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-semantic-text-primary/50 hover:bg-semantic-legacy-brand-blush/30 hover:text-semantic-text-primary transition"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-1 flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-semantic-text-primary/50">Ready to try?</span>
          <span className="text-sm font-bold text-semantic-text-primary">
            £{price.toFixed(2)}
          </span>
        </div>
        <button
          className={`inline-flex items-center gap-2 rounded-full bg-semantic-accent-cta px-5 py-3 min-h-[44px] text-sm font-semibold text-semantic-legacy-brand-cocoa shadow-sm transition active:scale-95 ${justAdded ? 'motion-safe:animate-pulse motion-reduce:animate-none' : ''}`}
          onClick={onAdd}
          disabled={isAdding}
        >
          <ShoppingBag className="h-5 w-5" />
          {isAdding ? 'Adding…' : 'Add to Cart'}
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa p-3 min-h-[44px] min-w-[44px] text-white shadow-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onBuy}
          disabled={isAdding}
          aria-label="Buy now"
        >
          <Zap className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export type SectionProps = {
  productHandle: string
  gallery: string[]
  activeImage: number
  setActiveImage: (idx: number) => void
  price: number
  compareAtPrice?: number
  discountPercentOverride?: number
  badge?: string
  bottomCtaChips?: string[]
  productTitle: string
  productDesc: string
  ratingValue: number
  ratingCountLabel: string
  ratingCount: number
  canonicalUrl: string
  onAdd: () => void
  onBuy: () => void
  isAdding: boolean
  justAdded: boolean
  quantity: number
  setQuantity: (qty: number) => void
  how: { title: string; body: string }[]
  care: { icon?: string; title: string; body: string }[]
  careLabel?: string
  proofStrip?: { label: string; body: string }[]
  featureCopy: any
  reasons: any
  essentials: any
  faqs: any
  featuredTikTokHeading: any
  featuredTikToks?: {
    name: string
    handle: string
    embedUrl: string
    videoUrl?: string
  }[]
  reviews?: ReviewType[]
  hideDetailsAccordion?: boolean
  productBadges?: Array<{ label: string; variant?: 'peach' | 'cocoa' | 'rose' }>
}

export function renderSections(props: SectionProps): ReactNode {
  const reviewsData = props.reviews?.length ? props.reviews : homeConfig.reviews
  const showLaunchBanner = !props.productHandle.startsWith('satin-overnight-curler')
  const bottomCtaChips = Array.isArray(props.bottomCtaChips)
    ? props.bottomCtaChips.map((chip) => (typeof chip === 'string' ? chip.trim() : '')).filter(Boolean)
    : []

  return (
    <>
      {/* Mobile sticky CTA - appears after scrolling past hero */}
      <MobileStickyCta
        price={props.price}
        onAdd={props.onAdd}
        onBuy={props.onBuy}
        isAdding={props.isAdding}
        justAdded={props.justAdded}
      />

      {/* Mobile section nav removed - users can scroll naturally */}
      <div id="pdp-hero" className="mx-auto max-w-6xl px-5 md:px-6 md:grid md:grid-cols-2 md:items-start md:gap-8 md:pt-6 overflow-visible">
        <HeroMedia
          gallery={props.gallery}
          activeImage={props.activeImage}
          onSelect={props.setActiveImage}
          productTitle={props.productTitle}
          showLaunchBanner={showLaunchBanner}
          badges={props.productBadges}
        />

        <PriceBlock
          productTitle={props.productTitle}
          productDesc={props.productDesc}
          price={props.price}
          compareAtPrice={props.compareAtPrice}
          discountPercentOverride={props.discountPercentOverride}
          badge={props.badge}
          ratingValue={props.ratingValue}
          ratingLabel={props.ratingCountLabel}
          canonicalUrl={props.canonicalUrl}
          onAdd={props.onAdd}
          onBuy={props.onBuy}
          isAdding={props.isAdding}
          justAdded={props.justAdded}
          quantity={props.quantity}
          setQuantity={props.setQuantity}
        />
      </div>

      <div id="pdp-care" className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
        <HowToSection steps={props.how} />
      </div>

      {/* Reviews moved up - social proof before features */}
      <ReviewsAutoCarousel
        reviews={reviewsData as ReviewType[]}
        heading={{
          eyebrow: 'Creator testimonials',
          title: 'Real feedback, real hair saved',
          description: 'Scroll through stories from TikTok Shop + verified shoppers.',
          alignment: 'center',
        }}
      />

      <div id="pdp-try">
        <FeatureCallouts
          sectionId="details"
          className="bg-semantic-legacy-brand-blush/10"
          variant="story"
          mediaSrc={props.featureCopy?.mediaSrc}
          mediaAlt={props.featureCopy?.mediaAlt}
          mediaLabel={props.featureCopy?.mediaLabel}
          mediaNote={props.featureCopy?.mediaNote}
          heading={props.featureCopy?.heading}
          pills={props.featureCopy?.pills}
          items={props.reasons as any}
        />
      </div>

      {!props.hideDetailsAccordion ? (
        <DetailsAccordion
          sectionId="essentials"
          heading={{
            eyebrow: 'Everything you need',
            title: 'Materials, care & fit',
            description: 'Quick references before you add it to your cart.',
            alignment: 'center',
          }}
          items={props.essentials as any}
        />
      ) : null}

      {/* TikTok moved up - video engagement before text FAQ */}
      <FeaturedTikTok heading={props.featuredTikTokHeading} sectionId="tiktok" tiktoks={props.featuredTikToks} />

      <FaqSectionShop
        sectionId="faq"
        items={props.faqs as any}
        heading={{
          eyebrow: 'Need help?',
          title: "Questions?\nWe've got answers.",
          description: undefined,
          alignment: 'center',
        }}
        hideCta
      />

      {/* Bottom CTA just above footer */}
      <section id="pdp-bottom-cta" className="border-t border-semantic-legacy-brand-blush/50 bg-semantic-legacy-brand-blush/10 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center md:px-6">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-semantic-text-primary/60">Ready when you are</p>
            <h3 className="font-heading text-2xl font-bold text-semantic-text-primary md:text-[28px]">
              {props.productHandle === 'lumelle-xl-microfibre-hair-towel'
                ? "Frizz-free hair starts today"
                : props.productHandle === 'satin-overnight-curler'
                  ? "Wake up to flawless curls"
                  : "Shower without the frizz"}
            </h3>
            <p className="text-sm font-semibold text-semantic-text-primary/65">
              Free returns · Ships in 48h · {props.ratingValue.toFixed(1)}★
            </p>
          </div>
          <div className="flex w-full max-w-lg flex-col items-center gap-3">
            <button
              id="pdp-bottom-cta-add"
              className={`inline-flex w-full items-center justify-center rounded-full bg-semantic-accent-cta px-6 py-3.5 text-base font-semibold text-semantic-legacy-brand-cocoa shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/30 ${props.justAdded ? 'motion-safe:animate-pulse motion-reduce:animate-none' : ''}`}
              onClick={props.onAdd}
              disabled={props.isAdding}
            >
              {props.isAdding ? 'Adding…' : 'Add to Cart'}
            </button>
            <button
              id="pdp-bottom-cta-buy"
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full bg-semantic-legacy-brand-blush/70 px-6 py-3 text-base font-semibold text-semantic-legacy-brand-cocoa shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/30 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={props.onBuy}
              disabled={props.isAdding}
            >
              {props.isAdding ? 'Processing…' : 'Buy Now'}
            </button>
            {bottomCtaChips.length ? (
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-semantic-text-primary/70">
                {bottomCtaChips.map((chip) => (
                  <span key={chip} className="rounded-full bg-white px-3 py-1 shadow-soft">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

export default renderSections
