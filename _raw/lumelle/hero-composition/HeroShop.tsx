import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Star } from 'lucide-react'
import { cdnUrl } from '@/lib/utils/cdn'
import { captureEvent, captureExperimentExposure } from '@/lib/analytics/posthog'
import { useFeatureFlagVariant } from '@/lib/analytics/useFeatureFlagVariant'

type Props = {
  config: {
    headline: string
    subhead: string
    ctaLabel: string
    ctaHref: string
    offerChip?: string
    image: string
    bgImage?: string
    gallery?: string[]
    objectPosition?: string
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    pill?: string
  }
  socialProof?: {
    tagline?: string
    rating?: number
    ratingLabel?: string
    trustCountLabel?: string
    trustAvatars?: string[]
  }
}

export const HeroShop = ({ config, socialProof }: Props) => {
  const experimentKey = 'hero_cta_copy'
  const rawVariant = useFeatureFlagVariant(experimentKey, 'control')
  const variant = rawVariant === 'bold' ? 'bold' : 'control'

  const baseSlides =
    config.gallery && config.gallery.length > 0 ? config.gallery.slice(0, 5) : [config.bgImage ?? config.image]
  const slides = baseSlides.map((s) => encodeURI(cdnUrl(s)))
  const desktopBg = encodeURI(cdnUrl(config.bgImage ?? config.gallery?.[0] ?? config.image))
  const productImage = encodeURI(cdnUrl(config.image))
  const [active, setActive] = useState(0)
  type SourceSets = { avif: string; webp: string; sizes: string } | null
  // Use the single hero asset; we don't ship resized AVIF/WEBP variants for this image.
  const buildSources = (_src: string): SourceSets => null

  useEffect(() => {
    // no auto-advance when single slide
    if (slides.length <= 1) return
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => window.clearInterval(id)
  }, [slides.length])

  useEffect(() => {
    captureExperimentExposure(experimentKey, variant, { component: 'HeroShop' })
  }, [variant])

  // controls removed; retain auto-advance only

  const ctaLabel = variant === 'bold' ? 'Shop now' : config.ctaLabel
  const isInternalCta = config.ctaHref.startsWith('/')
  const trustTagline = socialProof?.tagline ?? 'Trusted by 10k users'
  const ratingValue = Number.isFinite(socialProof?.rating) ? (socialProof?.rating as number) : 4.8
  const ratingLabel = socialProof?.ratingLabel ?? `${ratingValue.toFixed(1)} (100+)`
  const trustCountLabel = socialProof?.trustCountLabel ?? '10k+'

  const resolvedTrustAvatars = (() => {
    const configured = (socialProof?.trustAvatars ?? [])
      .filter((src) => typeof src === 'string' && src.length > 0)
      .map((src) => cdnUrl(src))
    if (configured.length > 0) return Array.from(new Set(configured)).slice(0, 5)

    return [
      cdnUrl('/images/avatar-shannon.jpg'),
      cdnUrl('/images/avatar-rachel.jpg'),
      cdnUrl('/images/avatar-randomlife.jpg'),
      cdnUrl('/images/avatar-jade.jpg'),
      cdnUrl('/images/avatar-maya.jpg'),
    ]
  })()

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-semantic-legacy-brand-blush/10 md:min-h-[76vh]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-semantic-legacy-brand-blush/10 to-semantic-legacy-brand-blush/25" />
        <div className="absolute inset-0 hidden lg:block">
          <img
            src={desktopBg}
            alt=""
            className="h-full w-full brightness-95 object-cover object-right"
            width={2400}
            height={1350}
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
        </div>
        <div className="absolute inset-0 lg:hidden">
          <div
            className="absolute inset-0 flex transition-transform duration-700"
            style={{ transform: `translateX(-${active * 100}%)`, width: `${slides.length * 100}%` }}
            aria-hidden="true"
          >
            {slides.map((src, idx) => {
              const sources = buildSources(src)
              const imgEl = (
                <img
                  key={`${src}-${idx}`}
                  src={src}
                  alt=""
                  className="h-full w-full flex-[0_0_100%] brightness-95 object-cover scale-[1.08]"
                  style={{
                    objectPosition: config.objectPosition || 'center center',
                    objectFit: config.objectFit || 'cover',
                  }}
                  width={1920}
                  height={1080}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              )
              if (!sources) return imgEl
              return (
                <picture key={idx} className="h-full w-full flex-[0_0_100%]">
                  <source type="image/avif" srcSet={sources.avif} sizes={sources.sizes} />
                  <source type="image/webp" srcSet={sources.webp} sizes={sources.sizes} />
                  {imgEl}
                </picture>
              )
            })}
          </div>
          <div
            className="absolute inset-0 pointer-events-none backdrop-blur-0 md:backdrop-blur-[1px]"
            style={{
              backgroundImage:
                'linear-gradient(180deg, rgba(247,239,232,0.5) 0%, rgba(247,239,232,0.3) 32%, rgba(247,239,232,0.12) 55%, rgba(247,239,232,0) 78%)',
            }}
          />
        </div>
      </div>
      <div className="absolute inset-0 z-10">
        <div className="mx-auto flex h-full max-w-6xl items-center px-4 pb-[3.5rem] pt-[3.5rem] md:px-6">
          <div className="w-full">
            <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:max-w-none lg:grid-cols-2 lg:gap-16">
              <div className="mx-auto w-full max-w-xl p-5 text-center md:max-w-2xl lg:mx-0 lg:p-0 lg:text-left">
                <div className="inline-flex flex-nowrap items-center gap-3 rounded-full bg-white/30 px-6 py-2 text-semantic-text-primary backdrop-blur-md shadow-soft ring-1 ring-white/50 min-w-[300px] justify-center lg:justify-start">
              <div className="flex -space-x-1.5 flex-shrink-0 pl-1">
                {resolvedTrustAvatars.map((src, idx) => (
                  <img
                    key={`${src}-${idx}`}
                    src={src}
                    alt="Customer profile photo"
                    className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm"
                    loading="lazy"
                    width={28}
                    height={28}
                  />
                ))}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-semantic-text-primary/80 whitespace-nowrap pl-1">
                  {trustTagline}
                </span>
            </div>
            <h1 className="mt-4 whitespace-pre-line font-heading text-3xl font-bold leading-tight text-semantic-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              {config.headline}
            </h1>
            <p className="mt-4 text-base text-semantic-text-primary/80 sm:text-lg">
              {config.subhead}
            </p>
            <div className="mt-6 flex justify-center lg:justify-start">
              {isInternalCta ? (
                <RouterLink
                  to={config.ctaHref}
                  data-click-id="hero-cta"
                  onClick={() =>
                    captureEvent('cta_click', {
                      click_id: 'hero-cta',
                      experiment_key: experimentKey,
                      variant,
                      href: config.ctaHref,
                    })
                  }
                  className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold shadow-soft transition hover:-translate-y-0.5 ${variant === 'bold'
                    ? 'bg-semantic-legacy-brand-cocoa text-white ring-2 ring-white/70'
                    : 'bg-semantic-legacy-brand-cocoa text-white'
                    }`}
                >
                  {ctaLabel}
                </RouterLink>
              ) : (
                <a
                  href={config.ctaHref}
                  data-click-id="hero-cta"
                  onClick={() =>
                    captureEvent('cta_click', {
                      click_id: 'hero-cta',
                      experiment_key: experimentKey,
                      variant,
                      href: config.ctaHref,
                    })
                  }
                  className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold shadow-soft transition hover:-translate-y-0.5 ${variant === 'bold'
                    ? 'bg-semantic-legacy-brand-cocoa text-white ring-2 ring-white/70'
                    : 'bg-semantic-legacy-brand-cocoa text-white'
                    }`}
                >
                  {ctaLabel}
                </a>
              )}
            </div>
            {/* Star rating - below the shop button */}
            <div className="mt-3 flex items-center justify-center gap-1.5 lg:justify-start">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className="h-4 w-4 text-amber-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                  fill="currentColor"
                  stroke="white"
                  strokeWidth={1}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-semantic-text-primary">4.8 (100)</span>
            </div>
              </div>
              <div className="hidden lg:flex lg:justify-center">
                <div className="w-full max-w-[520px] rounded-[2.75rem] border border-white/60 bg-white/75 p-6 shadow-soft backdrop-blur-md">
                  <div className="overflow-hidden rounded-3xl bg-semantic-legacy-brand-blush/15">
                    <img
                      src={productImage}
                      alt="Lumelle shower cap"
                      className="h-auto w-full object-contain"
                      width={900}
                      height={900}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="sr-only" aria-live="polite">
          Showing hero slide {active + 1} of {slides.length}
        </span>
      </div>
    </section>
  )
}
