import { useEffect, useState, useRef } from 'react'
import { StarRating } from '@ui/components/StarRating'
import { useCountUpAnimation } from '@/domains/shared/hooks/useCountUpAnimation'
import { Users, ShieldCheck, Truck, CheckCircle, ChevronDown, ChevronUp, Lock, CreditCard, Shield, Quote } from 'lucide-react'

type Fact = {
  label: string
  value: string
  details?: string
  icon?: any
}

type Quote = {
  name: string
  quote: string
  rating?: number
}

type Props = {
  rating: number
  count: number
  tagline: string
  facts?: Fact[]
  quotes?: Quote[]
  price?: number
}

export const HeroProofStrip = ({ rating, count, tagline, facts: factsProp, quotes: quotesProp, price }: Props) => {
  // Use the reusable count-up animation hook for rating and count
  const { displayValue: displayRating } = useCountUpAnimation(rating, 1500)
  const { displayValue: displayCount } = useCountUpAnimation(count, 1500)

  const [expandedFact, setExpandedFact] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement | null>(null)

  const defaultFacts: Fact[] = [
    { label: 'Satin', value: 'Satin-smooth finish', details: 'Our premium satin lining protects hair while you sleep, preventing frizz and breakage.', icon: ShieldCheck },
    { label: 'Dispatch', value: 'Fast dispatch', details: 'Orders ship within 48 hours. Tracked shipping included on all orders.', icon: Truck },
    { label: 'Returns', value: 'Free returns in 30 days', details: 'Not satisfied? Return within 30 days for a full refund. Prepaid label included.', icon: Users },
  ]

  const defaultQuotes: Quote[] = [
    { name: 'Sarah K.', quote: 'Best purchase I\'ve made this year!', rating: 5 },
    { name: 'Emma L.', quote: 'Finally a product that actually works', rating: 5 },
    { name: 'Aisha M.', quote: 'Game changer for my hair routine', rating: 5 },
  ]

  const icons = [ShieldCheck, Truck, Users]
  const facts = (() => {
    if (!Array.isArray(factsProp) || factsProp.length === 0) return defaultFacts
    const normalized = factsProp.map((item, idx) => {
      const fallback = defaultFacts[idx] ?? defaultFacts[0]
      const Icon = icons[idx] ?? fallback.icon
      return {
        label: item?.label?.trim() ? item.label : fallback.label,
        value: item?.value?.trim() ? item.value : fallback.value,
        details: item?.details || fallback.details,
        icon: Icon,
      }
    })
    while (normalized.length < defaultFacts.length) {
      const idx = normalized.length
      const fallback = defaultFacts[idx] ?? defaultFacts[0]
      normalized.push({ label: fallback.label, value: fallback.value, details: fallback.details, icon: icons[idx] ?? fallback.icon })
    }
    return normalized.slice(0, defaultFacts.length) as typeof normalized
  })()

  const quotes = quotesProp && quotesProp.length > 0 ? quotesProp : defaultQuotes

  // Animated count-up is now handled by useCountUpAnimation hook

  // Show up to 3 reviews at once for more social proof
  const displayQuotes = quotes.slice(0, 3)

  const toggleFact = (idx: number) => {
    setExpandedFact((prev) => (prev === idx ? null : idx))
  }

  return (
    <div ref={sectionRef} className="border-b border-semantic-legacy-brand-blush/40 bg-white/95">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 md:px-6">
        {/* Rating Section with Verified Badge */}
        <div className="text-center text-semantic-text-primary md:text-center md:flex md:flex-col md:items-center">
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3 md:justify-center">
            <div className="flex items-center gap-2">
              <StarRating value={rating} size={18} />
              <CheckCircle className="h-4 w-4 text-green-600" strokeWidth={2.5} />
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-green-800">
                Verified
              </span>
            </div>
            <span className="font-semibold">
              {displayRating > 0 ? displayRating.toFixed(1) : rating.toFixed(1)} ({displayCount > 0 ? Math.floor(displayCount).toLocaleString() : count.toLocaleString()}) — {tagline}
            </span>
            {price && (
              <span className="inline-flex items-center rounded-full bg-semantic-accent-cta/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-semantic-legacy-brand-cocoa">
                £{price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Customer Reviews - Show 2-3 diverse reviews at once */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {displayQuotes.map((quote, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-semantic-legacy-brand-blush/30 bg-semantic-legacy-brand-blush/5 p-4 text-left transition-all hover:shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Quote className="h-4 w-4 text-semantic-accent-cta/60" />
                  {quote.rating && (
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(quote.rating!) ? 'text-orange-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mb-2 text-sm italic text-semantic-text-primary/80 leading-relaxed">
                  "{quote.quote}"
                </p>
                <p className="text-xs font-semibold text-semantic-text-primary/60">
                  — {quote.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable Fact Cards */}
        <div className="grid w-full gap-3 text-semantic-text-primary/80 md:grid-cols-3 md:gap-4">
          {facts.map((fact, idx) => {
            const Icon = fact.icon
            const isExpanded = expandedFact === idx
            return (
              <div
                key={fact.label}
                id={`pdp-proof-item-${idx + 1}`}
                className="scroll-mt-24"
              >
                <button
                  type="button"
                  onClick={() => toggleFact(idx)}
                  className="w-full flex items-center gap-3 rounded-2xl border border-semantic-legacy-brand-blush/50 bg-semantic-legacy-brand-blush/20 px-5 py-4 shadow-soft transition-all hover:shadow-md md:px-6 md:py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-semantic-text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-0.5">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/60">{fact.label}</p>
                      {fact.details && (
                        <span className="ml-auto">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-semantic-text-primary/60" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-semantic-text-primary/60" />
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-semantic-text-primary">{fact.value}</p>
                  </div>
                </button>

                {/* Expandable Details */}
                {isExpanded && fact.details && (
                  <div className="mt-2 rounded-xl border border-semantic-legacy-brand-blush/30 bg-semantic-legacy-brand-blush/5 p-3 text-sm leading-snug text-semantic-text-primary/80">
                    {fact.details}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Trust Badges Strip */}
        <div className="flex items-center justify-center gap-6 overflow-x-auto py-3 border-t border-semantic-legacy-brand-blush/30">
          <div className="flex items-center gap-2 text-semantic-text-primary/50">
            <Lock className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-[0.18em]">Secure SSL</span>
          </div>
          <div className="flex items-center gap-2 text-semantic-text-primary/50">
            <Shield className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-[0.18em]">Protected</span>
          </div>
          <div className="flex items-center gap-2 text-semantic-text-primary/50">
            <CreditCard className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-[0.18em]">Safe Checkout</span>
          </div>
        </div>
      </div>
    </div>
  )
}
