import { Link as RouterLink } from 'react-router-dom'
import { SectionHeading } from '@ui/components/SectionHeading'
import { productConfigs } from '@client/shop/products/data/product-config'
import { cdnUrl } from '@/lib/utils/cdn'

type BundleCard = {
  key: string
  title: string
  subtitle: string
  imageSrc: string | null
  href: string
  chips: string[]
  priceLabel?: string
}

type BundleCardsProps = {
  count?: number
  active?: number
  onSelect?: (i: number) => void
}

const formatGbp = (value: number) => `£${value.toFixed(2)}`

const primaryImageFromGallery = (gallery?: string[]) => {
  const first = gallery?.find((item) => typeof item === 'string' && !item.startsWith('video://'))
  return first ?? null
}

const buildCards = (): BundleCard[] => {
  const cap = productConfigs['shower-cap']
  const curler = productConfigs['satin-overnight-curler']

  return [
    {
      key: 'shower-cap',
      title: cap.defaultTitle,
      subtitle: cap.defaultSubtitle,
      imageSrc: primaryImageFromGallery(cap.gallery),
      href: `/product/${cap.handle}`,
      chips: cap.bottomCtaChips ?? [],
      priceLabel: typeof cap.defaultPrice === 'number' ? formatGbp(cap.defaultPrice) : undefined,
    },
    {
      key: 'satin-overnight-curler',
      title: curler.defaultTitle,
      subtitle: curler.defaultSubtitle,
      imageSrc: primaryImageFromGallery(curler.gallery),
      href: `/product/${curler.handle}`,
      chips: curler.bottomCtaChips ?? [],
      priceLabel: typeof curler.defaultPrice === 'number' ? formatGbp(curler.defaultPrice) : undefined,
    },
  ]
}

const BundleCards = ({ count = 0, active = 0, onSelect = () => {} }: BundleCardsProps) => {
  void count
  void onSelect

  const cards = buildCards()

  if (cards.length === 0) return null

  return (
    <section className="bg-white py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Shop the sets"
          title="Build your routine"
          description="Two creator-loved essentials. Start with the cap, add the heatless curler, and keep every shower + style day flawless."
          alignment="center"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cards.map((card, idx) => {
            const selected = idx === active
            const chips = card.chips.slice(0, 3)
            const imageSrc = card.imageSrc ? encodeURI(cdnUrl(card.imageSrc)) : null

            return (
              <article
                key={card.key}
                className={`group overflow-hidden rounded-[2.5rem] border bg-white shadow-soft transition hover:-translate-y-0.5 ${
                  selected ? 'border-semantic-legacy-brand-cocoa/60' : 'border-semantic-legacy-brand-blush/60'
                }`}
              >
		                <div className="relative aspect-square bg-semantic-legacy-brand-blush/15 md:aspect-auto md:h-80 lg:h-84">
	                  {imageSrc ? (
	                    <img
	                      src={imageSrc}
	                      alt={card.title}
	                      className="h-full w-full object-contain p-6 md:p-8"
	                      loading="lazy"
	                      decoding="async"
	                    />
	                  ) : (
	                    <div className="h-full w-full" aria-hidden />
	                  )}
	                  {card.priceLabel ? (
                    <div className="absolute left-5 top-5 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-semantic-text-primary shadow-soft backdrop-blur">
                      From {card.priceLabel}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4 p-6">
                  <div className="space-y-2">
                    <h3 className="font-heading text-2xl font-bold leading-tight text-semantic-text-primary">
                      {card.title}
                    </h3>
                    <p className="text-sm text-semantic-text-primary/75">{card.subtitle}</p>
                  </div>

                  {chips.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-semantic-text-primary/70"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <RouterLink
                      to={card.href}
                      className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                    >
                      Shop now
                    </RouterLink>
                    <RouterLink
                      to={card.href}
                      className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary transition hover:bg-brand-porcelain/60"
                    >
                      Details
                    </RouterLink>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { BundleCards }
export default BundleCards
