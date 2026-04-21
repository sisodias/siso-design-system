import { cdnUrl } from '@/utils/cdn'
import { memo, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const toCdn = (src: string) => encodeURI(cdnUrl(src))

const buildSources = (src: string) => {
  if (src.startsWith('video://')) return null
  const cdnSrc = toCdn(src)
  // Only generate responsive sources when we actually have the resized assets.
  // Currently only the curler gallery has -640/-960/-1280 variants.
  if (!src.startsWith('/uploads/curler/')) return null
  const base = cdnSrc.replace(/\.[^.]+$/, '')
  const widths = [640, 960, 1280]
  return {
    avif: widths.map((w) => `${base}-${w}.avif ${w}w`).join(', '),
    // The unsuffixed curler `.webp` files are 960w already, so we can use them as the 960 candidate.
    webp: [`${base}-640.webp 640w`, `${cdnSrc} 960w`, `${base}-1280.webp 1280w`].join(', '),
    sizes: '(min-width: 1024px) 640px, 92vw',
    fallback: cdnSrc,
  }
}

type ProductBadge = {
  label: string
  variant?: 'peach' | 'cocoa' | 'rose'
}

type Props = {
  gallery: string[]
  activeImage: number
  onSelect: (idx: number) => void
  productTitle: string
  showLaunchBanner?: boolean
  badges?: ProductBadge[]
}

const HeroMedia = memo(({ gallery, activeImage, onSelect, productTitle, showLaunchBanner = true, badges = [] }: Props) => {
  const thumbnailsRef = useRef<HTMLDivElement | null>(null)
  const [{ hasOverflow, canScrollLeft, canScrollRight }, setThumbnailScrollState] = useState(() => ({
    hasOverflow: false,
    canScrollLeft: false,
    canScrollRight: false,
  }))
  const [zoomModalOpen, setZoomModalOpen] = useState(false)
  const [zoomImageIndex, setZoomImageIndex] = useState(activeImage)

  // Touch handling for swipe detection
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent default to stop page scroll while touching image
    if (touchStartRef.current) {
      // Optional: e.preventDefault() if you want to prevent scroll
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    const touchStart = touchStartRef.current
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const deltaTime = Date.now() - touchStart.time

    // Reset
    touchStartRef.current = null

    // Check if this was a tap (not a swipe)
    const isTap = Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300
    if (isTap) {
      // Tap triggers zoom (already handled by onClick)
      return
    }

    // Check for horizontal swipe
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > 30
    if (isHorizontalSwipe) {
      if (deltaX > 0) {
        // Swipe right - previous image
        onSelect(activeImage > 0 ? activeImage - 1 : gallery.length - 1)
      } else {
        // Swipe left - next image
        onSelect(activeImage < gallery.length - 1 ? activeImage + 1 : 0)
      }
    }
  }

  useEffect(() => {
    const el = thumbnailsRef.current
    if (!el) return

    const update = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      const nextHasOverflow = maxScrollLeft > 1
      const nextCanScrollLeft = nextHasOverflow && el.scrollLeft > 1
      const nextCanScrollRight = nextHasOverflow && el.scrollLeft < maxScrollLeft - 1

      setThumbnailScrollState((prev) => {
        if (
          prev.hasOverflow === nextHasOverflow &&
          prev.canScrollLeft === nextCanScrollLeft &&
          prev.canScrollRight === nextCanScrollRight
        ) {
          return prev
        }
        return { hasOverflow: nextHasOverflow, canScrollLeft: nextCanScrollLeft, canScrollRight: nextCanScrollRight }
      })
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [gallery.length])

  const scrollThumbnails = (direction: 'left' | 'right') => {
    const el = thumbnailsRef.current
    if (!el) return
    const amount = Math.min(240, el.clientWidth * 0.85)
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  const openZoomModal = (index: number) => {
    setZoomImageIndex(index)
    setZoomModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeZoomModal = () => {
    setZoomModalOpen(false)
    document.body.style.overflow = ''
  }

  const navigateZoomImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setZoomImageIndex((i) => i > 0 ? i - 1 : gallery.length - 1)
    } else {
      setZoomImageIndex((i) => i < gallery.length - 1 ? i + 1 : 0)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomModalOpen) {
        closeZoomModal()
      }
      if (e.key === 'ArrowLeft' && zoomModalOpen) {
        navigateZoomImage('prev')
      }
      if (e.key === 'ArrowRight' && zoomModalOpen) {
        navigateZoomImage('next')
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [zoomModalOpen, gallery.length])

  const titleBase = productTitle?.trim() ? productTitle.trim() : 'Product'
  const heroLabel = `${titleBase} — product photo ${activeImage + 1}`
  const videoLabel = `${titleBase} — product video`

  return (
    <>
    <section id="media" className="bg-white">
      <div id="pdp-hero-gallery" className="h-0 scroll-mt-24" />
      <div className="w-full flex flex-col gap-3">
          {showLaunchBanner ? (
            <Link
              to="/product/satin-overnight-curler"
              className="mt-2 mb-2 inline-flex w-auto max-w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-semantic-text-primary shadow-soft ring-1 ring-semantic-accent-cta/50 transition hover:-translate-y-[1px] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/50 md:mt-3"
              aria-label="New heatless curler launched — view the satin overnight heatless curler set"
            >
              <span className="h-2 w-2 rounded-full bg-semantic-legacy-brand-cocoa" aria-hidden />
              New Heatless Curler Launched
              <span aria-hidden>→</span>
            </Link>
          ) : null}
          <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-semantic-legacy-brand-blush/60 bg-white md:bg-semantic-legacy-brand-blush/20 group">
            {gallery[activeImage]?.startsWith('video://') ? (
              <iframe
                src={gallery[activeImage].replace('video://', '')}
                title={videoLabel}
                className="absolute inset-0 h-full w-full rounded-[2rem]"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <button
                type="button"
                onClick={() => openZoomModal(activeImage)}
                aria-label="View full size"
                className="relative w-full h-full bg-transparent border-0 p-0 cursor-zoom-in"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {(() => {
                  const sources = buildSources(gallery[activeImage])
                  const img = (
                    <img
                      src={sources?.fallback ?? toCdn(gallery[activeImage])}
                      alt={heroLabel}
                      className="w-full h-full object-contain"
                      width={960}
                      height={960}
                      draggable="false"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  )
                  if (!sources) return img
                  return (
                    <picture>
                      <source type="image/avif" srcSet={sources.avif} sizes={sources.sizes} />
                      <source type="image/webp" srcSet={sources.webp} sizes={sources.sizes} />
                      {img}
                    </picture>
                  )
                })()}
              </button>
            )}

            {/* Image counter badge */}
            {gallery.length > 1 && !zoomModalOpen && (
              <div className="absolute top-3 right-3 z-10 inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-lg">
                <span>{activeImage + 1}/{gallery.length}</span>
              </div>
            )}

            {/* Navigation arrows on main image */}
            {gallery.length > 1 && !zoomModalOpen && (
              <>
                <button
                  type="button"
                  onClick={() => onSelect(activeImage > 0 ? activeImage - 1 : gallery.length - 1)}
                  disabled={gallery.length <= 1}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-semantic-text-primary shadow-lg backdrop-blur opacity-100 transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(activeImage < gallery.length - 1 ? activeImage + 1 : 0)}
                  disabled={gallery.length <= 1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-semantic-text-primary shadow-lg backdrop-blur opacity-100 transition hover:bg-white md:opacity-0 md:group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>

          {/* Product badges */}
          {badges && badges.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {badges.map((badge, idx) => {
                const variantStyles = {
                  peach: 'bg-semantic-accent-cta text-semantic-legacy-brand-cocoa',
                  cocoa: 'bg-semantic-legacy-brand-cocoa text-white',
                  rose: 'bg-rose-500 text-white',
                }
                const style = variantStyles[badge.variant || 'peach']
                return (
                  <span
                    key={`${badge.label}-${idx}`}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] shadow-soft ${style}`}
                  >
                    {badge.label}
                  </span>
                )
              })}
            </div>
          )}

          <div className="relative mt-4 w-full">
            <div
              ref={thumbnailsRef}
              className="w-full overflow-x-auto overscroll-x-contain pb-1 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              <div className="inline-flex max-w-full gap-2 px-1 snap-x snap-mandatory touch-pan-x">
                {gallery.map((src, idx) => {
                  const isVideo = src.startsWith('video://')
                  const sources = buildSources(src)
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => onSelect(idx)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border snap-start md:h-16 md:w-16 ${idx === activeImage ? 'border-semantic-legacy-brand-cocoa ring-2 ring-semantic-accent-cta/30' : 'border-semantic-legacy-brand-blush/60'}`}
                      aria-label={`Show media ${idx + 1}`}
                    >
                      {isVideo ? (
                        <div className="relative h-full w-full bg-semantic-legacy-brand-blush/40">
                          <img src="/uploads/luminele/product-feature-03.webp" alt={`${productTitle} - video thumbnail`} className="h-full w-full object-cover" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-semantic-text-primary shadow-soft">
                              ▶
                            </span>
                          </span>
                        </div>
                      ) : sources ? (
                        <picture>
                          <source type="image/avif" srcSet={sources.avif} sizes="80px" />
                          <source type="image/webp" srcSet={sources.webp} sizes="80px" />
                          <img
                            src={sources.fallback}
                            alt={`${productTitle} - product photo ${idx + 1}`}
                            className="h-full w-full object-cover"
                            width={160}
                            height={160}
                            loading="lazy"
                            decoding="async"
                          />
                        </picture>
                      ) : (
                        <img
                          src={toCdn(src)}
                          alt={`${productTitle} - product photo ${idx + 1}`}
                          className="h-full w-full object-cover"
                          width={160}
                          height={160}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {hasOverflow ? (
              <>
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white via-white/60 to-transparent transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
                />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-white/60 to-transparent transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
                />
                {canScrollLeft ? (
                  <button
                    type="button"
                    onClick={() => scrollThumbnails('left')}
                    className="hidden md:inline-flex absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90 text-semantic-text-primary shadow-soft ring-1 ring-semantic-legacy-brand-blush/50 backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/50"
                    aria-label="Scroll product media thumbnails left"
                  >
                    ‹
                  </button>
                ) : null}
                {canScrollRight ? (
                  <button
                    type="button"
                    onClick={() => scrollThumbnails('right')}
                    className="hidden md:inline-flex absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/90 text-semantic-text-primary shadow-soft ring-1 ring-semantic-legacy-brand-blush/50 backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/50"
                    aria-label="Scroll product media thumbnails right"
                  >
                    ›
                  </button>
                ) : null}
              </>
            ) : null}

          </div>
        </div>
    </section>

    {/* Zoom Modal */}
    {zoomModalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={closeZoomModal}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        <button
          type="button"
          onClick={closeZoomModal}
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
          aria-label="Close image viewer"
        >
          <X className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigateZoomImage('prev')
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigateZoomImage('next')
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="relative h-[90vh] w-[90vw] max-w-4xl" onClick={(e) => e.stopPropagation()}>
          {gallery[zoomImageIndex]?.startsWith('video://') ? (
            <iframe
              src={gallery[zoomImageIndex].replace('video://', '')}
              title={`${productTitle} video`}
              className="w-full h-full rounded-2xl"
              allowFullScreen
            />
          ) : (() => {
            const sources = buildSources(gallery[zoomImageIndex])
            const img = (
              <img
                src={sources?.fallback ?? toCdn(gallery[zoomImageIndex])}
                alt={`${productTitle} — image ${zoomImageIndex + 1} of ${gallery.length}`}
                className="w-full h-full object-contain"
                loading="eager"
              />
            )
            if (!sources) return img
            return (
              <picture>
                <source type="image/avif" srcSet={sources.avif} sizes="(max-width: 768px) 100vw, 80vw" />
                <source type="image/webp" srcSet={sources.webp} sizes="(max-width: 768px) 100vw, 80vw" />
                {img}
              </picture>
            )
          })()}
        </div>

        {/* Image counter in modal */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-sm font-semibold text-white/80">
            {zoomImageIndex + 1} / {gallery.length}
          </span>
        </div>
      </div>
    )}
    </>
	  )
})

export { HeroMedia }
