import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { homeConfig } from '@/content/home.config'
import { cdnUrl } from '@/utils/cdn'
import { useCart } from '@client/shop/cart/providers/CartContext'
import { productConfigs } from '@client/shop/products/data/product-config'
import { CANONICAL_PRODUCT_HANDLES } from '@client/shop/products/data/product-handle-aliases'
import { renderSections } from './sections/SectionsMap'
import { useProductContent } from '@client/shop/products/hooks/useProductContent'
import { formatShopifyContentId, trackAddToCart, trackViewContent } from '@/lib/analytics/metapixel'
import { trackAddToCartWithCAPI, trackViewContentWithCAPI } from '@/lib/analytics/capi'
import SpinWheelPrompt from '@client/shop/products/ui/components/SpinWheelPrompt'
import { Seo } from '@/components/Seo'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'
import NotFoundPage from '@ui/pages/NotFoundPage'

const KNOWN_PRODUCT_HANDLES = new Set<string>([
  ...Object.keys(productConfigs),
  ...Object.values(productConfigs).map((cfg) => cfg.handle),
])

const ProductPageInner = ({ handleKey }: { handleKey: string }) => {
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const {
    config,
    gallery,
    setGallery,
    activeImage,
    setActiveImage,
    isAdding,
    setIsAdding,
    variantId,
    price,
    setPrice,
    sections,
    productTitle,
    setProductTitle,
    productDesc,
    setProductDesc,
    heroImage,
    productId,
  } = useProductContent(handleKey)
  const [draftOverrides, setDraftOverrides] = useState<any | null>(null)
  const [justAdded, setJustAdded] = useState(false)

  const canonicalUrl = useMemo(() => toPublicUrl(`/product/${config.handle}`), [config.handle])

  const metaDescription = useMemo(() => {
    const base = (productDesc || '').trim()
    if (!base) return 'Luxury satin hair essentials designed for effortless, protective, everyday self-care.'

    const suffix = 'Free returns in 30 days.'
    if (base.toLowerCase().includes('free returns')) return base

    const needsSpace = base.endsWith('.') || base.endsWith('!') || base.endsWith('?')
    return `${base}${needsSpace ? ' ' : '. '}${suffix}`
  }, [productDesc])

  const parseReviewCountLabel = (label: string): number | null => {
    const raw = label.trim().toLowerCase().replace(/,/g, '')
    if (!raw) return null

    const abbreviated = raw.match(/^(\d+(?:\.\d+)?)\s*([km])\+?$/)
    if (abbreviated) {
      const value = Number(abbreviated[1])
      const unit = abbreviated[2]
      if (!Number.isFinite(value)) return null
      const multiplier = unit === 'm' ? 1_000_000 : 1_000
      return Math.round(value * multiplier)
    }

    const digits = raw.replace(/[^0-9]/g, '')
    if (!digits) return null
    const value = Number(digits)
    return Number.isFinite(value) ? value : null
  }

  const ratingValue = (() => {
    const raw = draftOverrides?.ratingValue
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw
    if (typeof raw === 'string' && raw.trim() && Number.isFinite(Number(raw))) return Number(raw)
    return config.ratingValueOverride ?? homeConfig.socialProof.rating
  })()

  const ratingCountLabel = (() => {
    const raw = draftOverrides?.ratingCountLabel
    if (typeof raw === 'string' && raw.trim()) return raw
    if (raw != null && Number.isFinite(Number(raw))) return String(raw)
    return config.ratingCountLabelOverride ?? homeConfig.socialProof.count?.toString() ?? '100+'
  })()

  const ratingCount = useMemo(() => parseReviewCountLabel(ratingCountLabel), [ratingCountLabel])
  const aggregateRating =
    Number.isFinite(ratingValue) && typeof ratingCount === 'number' && ratingCount > 0
      ? {
        '@type': 'AggregateRating' as const,
        ratingValue: Math.round(ratingValue * 10) / 10,
        reviewCount: ratingCount,
      }
      : undefined

  const navigate = useNavigate()

  const handleAddToCart = async () => {
    if (!variantId) return
    setIsAdding(true)
    try {
      await add(
        {
          id: variantId,
          title: productTitle || config.defaultTitle,
          price: price,
          compareAt: config.compareAtPrice,
          image: heroImage,
        },
        quantity,
      )
      const contentId = formatShopifyContentId(productId, variantId)
      trackAddToCart({
        content_name: productTitle || config.defaultTitle,
        content_ids: [contentId],
        value: price,
        currency: 'GBP',
      })
      // Also send to CAPI for better coverage
      trackAddToCartWithCAPI({
        contentIds: [contentId],
        contentType: 'product',
        value: price,
        currency: 'GBP',
      }).catch(() => { /* ignore CAPI errors */ })
      window.dispatchEvent(new CustomEvent('lumelle:open-cart'))
      setJustAdded(true)
      window.setTimeout(() => setJustAdded(false), 800)
    } catch (error) {
      console.error('Add to cart failed:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!variantId) return
    setIsAdding(true)
    try {
      await add(
        {
          id: variantId,
          title: productTitle || config.defaultTitle,
          price: price,
          compareAt: config.compareAtPrice,
          image: heroImage,
        },
        quantity,
      )
      const contentId = formatShopifyContentId(productId, variantId)
      trackAddToCart({
        content_name: productTitle || config.defaultTitle,
        content_ids: [contentId],
        value: price,
        currency: 'GBP',
      })
      // Also send to CAPI for better coverage
      trackAddToCartWithCAPI({
        contentIds: [contentId],
        contentType: 'product',
        value: price,
        currency: 'GBP',
      }).catch(() => { /* ignore CAPI errors */ })
      navigate('/checkout')
    } catch (error) {
      console.error('Buy now failed:', error)
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    const primarySrc = gallery.find((src) => typeof src === 'string' && !src.startsWith('video://'))
    if (!primarySrc) return

    const href = cdnUrl(primarySrc)
    const selector = 'link[rel="preload"][data-hero="pdp-hero"]'
    const existing = document.querySelector(selector) as HTMLLinkElement | null
    const desiredHref = new URL(href, document.baseURI).href

    if (existing && existing.href === desiredHref) return
    if (existing) existing.remove()

    // Delay preload slightly to avoid warnings if user navigates away quickly
    const timeoutId = setTimeout(() => {
      const l = document.createElement('link')
      l.rel = 'preload'
      l.as = 'image'
      l.href = href
      l.setAttribute('data-hero', 'pdp-hero')
      document.head.appendChild(l)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      const link = document.querySelector(selector) as HTMLLinkElement | null
      if (link) link.remove()
    }
  }, [gallery])

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productTitle,
    description: metaDescription,
    image: heroImage ? [toPublicUrl(heroImage)] : undefined,
    url: canonicalUrl,
    sku: config.shopifyVariantId?.split('/').pop(),
    mpn: config.shopifyId?.split('/').pop(),
    brand: { '@type': 'Brand', name: 'Lumelle' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: price.toFixed(2),
      availability: 'https://schema.org/InStock',
      url: canonicalUrl,
      itemCondition: 'https://schema.org/NewCondition',
      merchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'GB',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnFees: 'https://schema.org/FreeReturn',
        returnMethod: 'https://schema.org/ReturnByMail',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0.00',
          currency: 'GBP',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'GB',
        },
        doesNotShip: 'false',
        freeShippingThreshold: {
          '@type': 'MonetaryAmount',
          value: '20.00',
          currency: 'GBP',
        },
      },
    },
    aggregateRating,
    review: config.reviews?.slice(0, 3).map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.stars,
        bestRating: 5,
      },
      reviewBody: review.body,
      headline: review.title,
      datePublished: review.date,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: toPublicUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Product', item: canonicalUrl },
    ],
  }

  const essentials =
    draftOverrides?.specs?.essentials && draftOverrides.specs.essentials.length > 0
      ? draftOverrides.specs.essentials
      : sections?.essentials && sections.essentials.length > 0
        ? sections.essentials
        : config.essentials
  const reasons =
    draftOverrides?.specs?.reasons && draftOverrides.specs.reasons.length > 0
      ? draftOverrides.specs.reasons
      : sections?.reasons && sections.reasons.length > 0
        ? sections.reasons
        : config.reasons
  const faqs =
    draftOverrides?.faq && draftOverrides.faq.length > 0
      ? draftOverrides.faq
      : sections?.faq && sections.faq.length > 0
        ? sections.faq
        : config.qa
  const howRaw =
    draftOverrides?.specs?.how && draftOverrides.specs.how.length > 0
      ? draftOverrides.specs.how
      : sections?.how && sections.how.length > 0
        ? sections.how
        : config.how ?? []
  const how = howRaw.map((item: any, idx: number) =>
    typeof item === 'string' ? { title: `Reason ${idx + 1}`, body: item } : item,
  )
  const care =
    draftOverrides?.specs?.care && draftOverrides.specs.care.length > 0
      ? draftOverrides.specs.care
      : sections?.care && sections.care.length > 0
        ? sections.care
        : config.care ?? []
  const proofStrip = Array.isArray(draftOverrides?.specs?.proofStrip) ? draftOverrides.specs.proofStrip : undefined
  const featureCopyBase = draftOverrides?.specs?.featureCallouts ?? config.featureCallouts ?? null
  const featureCopy = useMemo(() => {
    if (!featureCopyBase) return featureCopyBase

    // In admin preview mode, `video_slot` is sent as part of the draft gallery (as `video://...`).
    // The storefront config sets `featureCallouts.mediaSrc` to the same video, so keep them in sync
    // even when the admin only edits `video_slot`.
    const draftGallery = Array.isArray(draftOverrides?.gallery) ? draftOverrides.gallery : null
    const galleryVideo = draftGallery?.find((item: unknown) => typeof item === 'string' && item.startsWith('video://')) as string | undefined
    if (!galleryVideo) return featureCopyBase

    const current = (featureCopyBase as any).mediaSrc
    if (current === galleryVideo) return featureCopyBase

    return { ...(featureCopyBase as any), mediaSrc: galleryVideo }
  }, [draftOverrides?.gallery, featureCopyBase])
  const featuredTikTokHeading = draftOverrides?.specs?.featuredTikTokHeading ?? config.featuredTikTokHeading
  const featuredTikToks = (() => {
    const raw = draftOverrides?.specs?.featuredTikToks
    if (Array.isArray(raw) && raw.length > 0) return raw
    return config.featuredTikToks
  })()

  useEffect(() => {
    setDraftOverrides(null)
  }, [handleKey])

  useEffect(() => {
    // Allow the admin products editor to "live preview" draft changes in an iframe without saving.
    const getStickyMarketingOffset = () => {
      // MarketingLayout renders a `<header>` and (optionally) a sections `<nav>`.
      // These aren't always sticky, so only apply an offset when they are.
      const header = document.querySelector('header')
      const nav = document.querySelector('nav[aria-label="Page sections"]')
      const headerH = header?.getBoundingClientRect().height ?? 0
      const navH = nav?.getBoundingClientRect().height ?? 0
      const headerPos = header ? window.getComputedStyle(header).position : ''
      const navPos = nav ? window.getComputedStyle(nav).position : ''
      const headerSticky = headerPos === 'sticky' || headerPos === 'fixed'
      const navSticky = navPos === 'sticky' || navPos === 'fixed'
      return Math.round((headerSticky ? headerH : 0) + (navSticky ? navH : 0))
    }

    const handler = (event: MessageEvent) => {
      // Security: only accept same-origin messages.
      if (event.origin !== window.location.origin) return

      const data = event.data as any
      if (data?.type === 'admin-draft-product') {
        if (data.handle !== handleKey) return
        const draft = data.payload || {}
        setDraftOverrides(draft)
        if (Array.isArray(draft.gallery)) setGallery(draft.gallery)
        if (draft.price != null) setPrice(Number(draft.price))
        if (typeof draft.productTitle === 'string') setProductTitle(draft.productTitle)
        if (typeof draft.productDesc === 'string') setProductDesc(draft.productDesc)
      }

      if (data?.type === 'scrollToSection' && typeof data.target === 'string') {
        const el = document.getElementById(data.target)
        if (el) {
          const behavior: ScrollBehavior = data.behavior === 'auto' || data.behavior === 'smooth' ? data.behavior : 'smooth'
          const stickyOffset = getStickyMarketingOffset()
          const scrollMarginTop = Number.parseFloat(window.getComputedStyle(el).scrollMarginTop || '0') || 0
          const offset = Math.max(stickyOffset, scrollMarginTop)
          const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset - 12)
          window.scrollTo({ top, behavior })
        }
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [handleKey, setGallery, setPrice, setProductDesc, setProductTitle])

  // Track ViewContent on mount whenever variant/handle changes
  // Use a global flag to prevent duplicate tracking across re-renders and remounts
  useEffect(() => {
    if (!variantId) return

    // Initialize global tracking object
    const globalKey = `__viewContentTracked_${config.handle}`
    if ((window as any)[globalKey]) return

    (window as any)[globalKey] = true
    const contentId = formatShopifyContentId(productId, variantId)
    trackViewContent({
      content_name: productTitle || config.defaultTitle,
      content_ids: [contentId],
      content_type: 'product',
      value: price,
      currency: 'GBP',
    })
    // Also send to CAPI for better coverage
    trackViewContentWithCAPI({
      contentIds: [contentId],
      contentType: 'product',
      value: price,
      currency: 'GBP',
    }).catch(() => { /* ignore CAPI errors */ })
  }, [variantId, productId, config.handle, productTitle, price])

  useEffect(() => {
    // Report height to admin iframe preview (if embedded)
    const isEmbedded = (() => {
      try {
        return window.self !== window.top
      } catch {
        return true
      }
    })()

    if (!isEmbedded) return

    const html = document.documentElement
    const body = document.body
    const previous = {
      htmlOverflowX: html.style.overflowX,
      bodyOverflowX: body.style.overflowX,
      htmlOverscrollY: html.style.overscrollBehaviorY,
      bodyOverscrollY: body.style.overscrollBehaviorY,
    }

    const sendHeight = () => {
      const h = document.body.scrollHeight
      const targetOrigin = window.location.origin
      window.parent?.postMessage({ type: 'pdpHeight', height: h }, targetOrigin)
    }

    // Prevent horizontal scrollbars in the embedded preview without affecting desktop layout.
    html.style.overflowX = 'hidden'
    body.style.overflowX = 'hidden'
    // Prevent scroll chaining to the admin page when the iframe hits top/bottom.
    html.style.overscrollBehaviorY = 'contain'
    body.style.overscrollBehaviorY = 'contain'

    sendHeight()
    const observer = new ResizeObserver(() => sendHeight())
    observer.observe(document.body)
    return () => {
      observer.disconnect()
      html.style.overflowX = previous.htmlOverflowX
      body.style.overflowX = previous.bodyOverflowX
      html.style.overscrollBehaviorY = previous.htmlOverscrollY
      body.style.overscrollBehaviorY = previous.bodyOverscrollY
    }
  }, [])

  useEffect(() => {
    // When embedded in the admin preview iframe, notify the parent which PDP section is currently active.
    // This lets the admin editor scroll its right-hand form to the matching card/section.
    const isEmbedded = (() => {
      try {
        return window.self !== window.top
      } catch {
        return true
      }
    })()

    if (!isEmbedded) return

    const targetOrigin = window.location.origin
    const getActivationY = () => {
      const header = document.querySelector('header')
      const nav = document.querySelector('nav[aria-label="Page sections"]')
      const headerH = header?.getBoundingClientRect().height ?? 0
      const navH = nav?.getBoundingClientRect().height ?? 0
      const headerPos = header ? window.getComputedStyle(header).position : ''
      const navPos = nav ? window.getComputedStyle(nav).position : ''
      const headerSticky = headerPos === 'sticky' || headerPos === 'fixed'
      const navSticky = navPos === 'sticky' || navPos === 'fixed'
      const stickyOffset = (headerSticky ? headerH : 0) + (navSticky ? navH : 0)
      // Use a proportional activation line so many small anchors still "tick" smoothly on mobile.
      const proportional = Math.round(window.innerHeight * 0.28)
      return Math.max(140, proportional, Math.round(stickyOffset) + 24)
    }
    const sectionIds = [
      // Hero (granular)
      'pdp-hero',
      'pdp-hero-gallery',
      'pdp-hero-text',
      'pdp-hero-reviews',
      'pdp-hero-price',
      'pdp-hero-badge',

      // Mid sections
      'pdp-sign',
      'pdp-sign-step-1',
      'pdp-sign-step-2',
      'pdp-sign-step-3',
      'pdp-care-section',
      'pdp-care-item-1',
      'pdp-care-item-2',
      'pdp-care-item-3',
      'pdp-proof',
      'pdp-proof-item-1',
      'pdp-proof-item-2',
      'pdp-proof-item-3',

      // Main sections
      'details',
      'details-heading',
      'details-media',
      'details-item-1',
      'details-item-2',
      'details-item-3',
      'details-item-4',
      'details-pills',
      'essentials',
      'essentials-heading',
      'essentials-item-1',
      'essentials-item-2',
      'essentials-item-3',
      'essentials-item-4',
      'reviews',
      'tiktok',
      'faq',
      'faq-item-1',
      'faq-item-2',
      'faq-item-3',
      'faq-item-4',
      'pdp-bottom-cta',
      'pdp-bottom-cta-add',
      'pdp-bottom-cta-buy',
    ] as const

    let activeId: string | null = null
    let lastSentAt = 0
    let pendingId: string | null = null
    let pendingTimer: number | null = null
    let raf = 0

    const clearPendingTimer = () => {
      if (pendingTimer) window.clearTimeout(pendingTimer)
      pendingTimer = null
    }

    const flush = () => {
      clearPendingTimer()
      if (!pendingId) return

      const now = Date.now()
      const elapsed = now - lastSentAt
      const throttleMs = 60
      if (elapsed < throttleMs) {
        pendingTimer = window.setTimeout(flush, throttleMs - elapsed + 5)
        return
      }

      const nextId = pendingId
      pendingId = null
      if (!nextId) return
      if (nextId === activeId) return

      activeId = nextId
      lastSentAt = now
      window.parent?.postMessage({ type: 'admin-preview-active-section', sectionId: nextId }, targetOrigin)
    }

    const queueSendActive = (nextId: string) => {
      if (!nextId) return
      if (nextId === activeId) return
      pendingId = nextId
      flush()
    }

    const pickActiveSectionId = (ids: readonly string[], activationY = 140) => {
      // "Pinned line" scrollspy: pick the last anchor whose top is above the activation line.
      let lastAbove: string | null = null
      let firstBelow: string | null = null

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue

        const top = el.getBoundingClientRect().top
        if (top <= activationY) lastAbove = id
        else if (!firstBelow) firstBelow = id
      }

      return lastAbove ?? firstBelow
    }

    const updateActive = () => {
      const next = pickActiveSectionId(sectionIds, getActivationY())
      if (next) queueSendActive(next)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => updateActive())
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      clearPendingTimer()
    }
  }, [handleKey])

  // Scroll depth tracking
  useEffect(() => {
    const milestones = [25, 50, 75, 100]
    const fired = new Set<number>()

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !fired.has(milestone)) {
          fired.add(milestone)
          // Fire PostHog event
          if (window.posthog) {
            window.posthog.capture('scroll_depth', {
              depth: milestone,
              page: 'product_page',
              product_handle: handleKey
            })
          }
          // Fire Meta event
          if (window.fbq) {
            window.fbq('trackCustom', 'ScrollDepth', {
              depth: milestone,
              content_name: handleKey
            })
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleKey])

  return (
    <MarketingLayout subtitle="Product">
      <Seo
        title={productTitle || config.defaultTitle}
        description={metaDescription}
        image={heroImage}
        url={canonicalUrl}
        type="product"
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <SpinWheelPrompt />
      {/* Hero media + info */}
      {renderSections({
        productHandle: config.handle,
        gallery,
        activeImage,
        setActiveImage,
        price,
        compareAtPrice: (() => {
          const v = draftOverrides?.compareAtPrice
          if (v == null) return config.compareAtPrice
          const n = Number(v)
          return Number.isFinite(n) ? n : config.compareAtPrice
        })(),
        discountPercentOverride: (() => {
          const v = draftOverrides?.discountPercentOverride
          if (v == null) return config.discountPercentOverride
          const n = Number(v)
          return Number.isFinite(n) ? n : config.discountPercentOverride
        })(),
        badge: typeof draftOverrides?.badge === 'string' ? draftOverrides.badge : config.badge,
        bottomCtaChips: config.bottomCtaChips,
        productTitle,
        productDesc,
        ratingValue,
        ratingCountLabel,
        ratingCount: typeof ratingCount === 'number' && ratingCount > 0 ? ratingCount : 100,
        canonicalUrl,
        onAdd: handleAddToCart,
        onBuy: handleBuyNow,
        isAdding,
        justAdded,
        quantity,
        setQuantity,
        how,
        care,
        careLabel:
          typeof draftOverrides?.careLabelOverride === 'string'
            ? draftOverrides.careLabelOverride
            : config.careLabelOverride,
        proofStrip,
        hideDetailsAccordion:
          typeof draftOverrides?.hideDetailsAccordion === 'boolean'
            ? draftOverrides.hideDetailsAccordion
            : config.hideDetailsAccordion,
        featureCopy,
        reasons,
        essentials,
        faqs,
        featuredTikTokHeading,
        featuredTikToks,
        reviews: config.reviews,
      })}
    </MarketingLayout>
  )
}

export const ProductPage = () => {
  const params = useParams<{ handle: string }>()
  const location = useLocation()
  const handleKey = params.handle

  if (!handleKey) return <NotFoundPage />

  const canonicalHandle = CANONICAL_PRODUCT_HANDLES[handleKey] ?? (productConfigs[handleKey]?.handle ?? handleKey)

  if (!KNOWN_PRODUCT_HANDLES.has(canonicalHandle)) return <NotFoundPage />

  if (handleKey !== canonicalHandle) {
    const pathname = location.pathname.replace(/(\/product\/)[^/]+$/, `$1${canonicalHandle}`)
    return <Navigate to={{ pathname, search: location.search, hash: location.hash }} replace />
  }

  return <ProductPageInner handleKey={canonicalHandle} />
}

export default ProductPage
