import type { ComponentType } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Crown, Droplets, Leaf, Heart } from 'lucide-react'
import { SectionHeading } from '@components/lumelle/hero-composition/SectionHeading'
import { LazyVisible } from '@components/lumelle/tiktok-carousel/LazyVisible'

type FeatureCallout = {
  icon?: ComponentType<{ className?: string }>
  title: string
  desc: string
  image?: string
}

type Heading = {
  eyebrow?: string
  title?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
}

type FeatureCalloutsProps = {
  items?: FeatureCallout[]
  heading?: Heading
  sectionId?: string
  className?: string
  variant?: 'cards' | 'story'
  mediaSrc?: string
  mediaAlt?: string
  mediaLabel?: string
  mediaNote?: string
  pills?: string[]
}

const defaultHeading: Required<Heading> = {
  eyebrow: 'Features',
  title: 'Small details, big results',
  description: 'Thoughtful materials and construction that protect your style and feel great to wear.',
  alignment: 'center',
}

const defaultItems: FeatureCallout[] = [
  { icon: Droplets, title: 'Waterproof', desc: 'Moisture‑guard lining keeps styles intact.' },
  { icon: Heart, title: 'Comfort fit', desc: 'Soft, secure band — no marks.' },
  { icon: Leaf, title: 'Reusable', desc: 'Durable build that replaces disposables.' },
  { icon: Crown, title: 'Premium feel', desc: 'Luxe materials designed to last.' },
]

const iconCycle = [Droplets, Heart, Leaf, Crown]

export const FeatureCallouts = ({
  items,
  heading,
  sectionId,
  className,
  variant = 'cards',
  mediaSrc,
  mediaAlt,
  mediaLabel,
  mediaNote,
  pills,
}: FeatureCalloutsProps) => {
  const resolvedHeading = {
    ...defaultHeading,
    ...heading,
    alignment: heading?.alignment ?? defaultHeading.alignment,
  }
  const list = (items ?? defaultItems).map((item, idx) => ({
    ...item,
    icon: item.icon ?? iconCycle[idx % iconCycle.length],
  }))

  if (variant === 'story') {
    const isVideo = mediaSrc?.startsWith('video://')
    const media = mediaSrc?.replace('video://', '') ?? '/uploads/luminele/product-feature-06.webp'
    const pillList = Array.isArray(pills) ? pills.map((p) => (typeof p === 'string' ? p.trim() : '')).filter(Boolean) : []
    return (
      <section
        id={sectionId}
        className={`${className ?? 'bg-white'} relative overflow-hidden py-16`}
      >
        {sectionId ? <div id={`${sectionId}-heading`} className="h-0 scroll-mt-24" /> : null}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,214,194,0.45),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(255,232,220,0.55),transparent_38%),linear-gradient(135deg,#fff7f3,#fff)]" />
        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading
            eyebrow={resolvedHeading.eyebrow}
            title={resolvedHeading.title}
            description={resolvedHeading.description}
            alignment="center"
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:justify-center lg:mx-auto lg:max-w-[1100px]">
            <div
              id={sectionId ? `${sectionId}-media` : undefined}
              className="scroll-mt-24 rounded-3xl border border-semantic-accent-cta/50 bg-gradient-to-br from-semantic-legacy-brand-blush/70 via-white to-semantic-accent-cta/30 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:h-full lg:max-w-[440px] lg:mx-auto"
            >
              <div className="overflow-hidden rounded-2xl border border-white/40 bg-white lg:h-full">
                <div className="relative aspect-[9/16] sm:aspect-[9/16] lg:h-full lg:aspect-auto">
                  <LazyVisible
                    className="h-full w-full"
                    placeholder={
                      <div className="absolute inset-0 flex items-center justify-center bg-semantic-legacy-brand-blush/20 text-semantic-text-primary/60 text-xs">
                        Loading…
                      </div>
                    }
                  >
                    {isVideo ? (
                      <iframe
                        src={media}
                        title="Lumelle creator video"
                        className="absolute inset-0 h-full w-full"
                        scrolling="no"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen; clipboard-write"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={media}
                        alt={mediaAlt ?? 'Lumelle shower cap in use'}
                        className="h-full w-full object-cover lg:h-full lg:object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </LazyVisible>
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-semantic-text-primary shadow-soft backdrop-blur">
                    {mediaLabel ?? 'Less breakage'}
                  </div>
                  <div className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-semantic-text-primary shadow-soft backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-semantic-accent-cta" />
                    Safe for silk press
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-semantic-legacy-brand-blush/50 px-4 py-3 text-sm text-semantic-text-primary/80">
                  <span className="font-semibold">{mediaNote ?? 'Soft satin band prevents pulling'}</span>
                  <span className="rounded-full bg-semantic-accent-cta/20 px-3 py-1 text-xs font-semibold text-semantic-text-primary">Creator-tested</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl border border-semantic-accent-cta/60 bg-white/85 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.08)] sm:p-6 lg:max-w-[540px] lg:mx-auto">
              <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-semantic-accent-cta/60 via-semantic-accent-cta/30 to-transparent" />
              <div className="flex flex-col gap-4">
              {list.map(({ title, desc, image }, idx) => (
                  <div
                    key={title}
                    id={sectionId ? `${sectionId}-item-${idx + 1}` : undefined}
                    className="scroll-mt-24 relative flex gap-4 rounded-2xl border border-semantic-accent-cta/60 bg-gradient-to-br from-[#FFF6F2] via-white to-[#FFE8DC] p-4 shadow-[0_10px_26px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)]"
                  >
                    <div className="relative flex-shrink-0">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-semantic-accent-cta to-semantic-legacy-brand-blush text-base font-extrabold text-semantic-text-primary shadow-soft ring-2 ring-white">
                        {idx + 1}
                      </span>
                      <span className="absolute left-1/2 top-10 h-6 w-px -translate-x-1/2 bg-semantic-accent-cta/30" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img
                            src={image}
                            alt=""
                            className="h-12 w-12 rounded-full border border-white/70 object-cover shadow-soft"
                            loading="lazy"
                          />
                        ) : null}
                        <div className="font-heading text-xl font-extrabold text-semantic-text-primary leading-tight">{title}</div>
                      </div>
                      <p className="text-[15px] leading-relaxed text-semantic-text-primary/90">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {sectionId ? <div id={`${sectionId}-pills`} className="h-0 scroll-mt-24" /> : null}
              {pillList.length ? (
                <div className="mt-6 flex flex-wrap gap-2 md:static sticky bottom-4 z-10 md:bg-transparent bg-white/95 md:backdrop-blur-none backdrop-blur-sm md:shadow-none md:rounded-none rounded-2xl md:p-0 p-3 md:border-none border border-semantic-accent-cta/30 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  {pillList.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full bg-semantic-accent-cta/20 px-3 py-1 text-xs font-semibold text-semantic-text-primary"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-6 flex items-center justify-between rounded-2xl border border-semantic-accent-cta/50 bg-white/80 px-4 py-3 text-sm font-semibold text-semantic-text-primary shadow-soft">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-semantic-accent-cta" />
                  See it in action
                </div>
                <RouterLink
                  to="/blog/frizz-free-showers-seo"
                  className="rounded-full bg-semantic-legacy-brand-cocoa px-3 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-semantic-legacy-brand-cocoa/90"
                >
                  Watch routine
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id={sectionId} className={`${className ?? 'bg-white'} py-16`}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow={resolvedHeading.eyebrow}
          title={resolvedHeading.title}
          description={resolvedHeading.description}
          alignment={resolvedHeading.alignment === 'right' ? 'center' : resolvedHeading.alignment}
        />
        <div className="mt-8 rounded-3xl border border-semantic-accent-cta/40 bg-white/90 p-6 shadow-soft md:p-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {list.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-semantic-legacy-brand-blush/20 p-5">
                <div className="flex items-start gap-3">
                  {Icon ? (
                    <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-semantic-accent-cta/60 text-semantic-text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                  ) : null}
                  <div>
                    <div className="font-heading text-lg font-bold text-semantic-text-primary">{title}</div>
                    <p className="mt-1 text-sm text-semantic-text-primary/75">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
