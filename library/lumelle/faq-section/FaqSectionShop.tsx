import { useMemo, useState } from 'react'
import { SectionHeading } from '@ui/components/SectionHeading'
import { Minus, Plus, Search, X } from 'lucide-react'
import { WHATSAPP_SUPPORT_URL } from '@/config/constants'

type FAQItem = { q: string; a: string }

type Heading = {
  eyebrow?: string
  title?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
}

type Props = {
  items: FAQItem[]
  heading?: Heading
  sectionId?: string
  ctaHref?: string
  ctaLabel?: string
  hideCta?: boolean
}

const defaultHeading: Heading = {
  eyebrow: 'Frequently asked',
  title: 'Answers before you buy',
  description: "If you don't see your question here, reach out to us and we'll help right away.",
  alignment: 'center',
}

const defaultCta = {
  href: WHATSAPP_SUPPORT_URL,
  label: 'Chat with WhatsApp concierge',
}

export const FaqSectionShop = ({ items, heading, sectionId, ctaHref, ctaLabel, hideCta = false }: Props) => {
  const [query, setQuery] = useState('')
  const [openIndex, setOpenIndex] = useState(0)

  const normalizedQuery = query.toLowerCase().trim()
  const hasQuery = normalizedQuery.length > 0
  const filtered = useMemo(() => {
    if (!normalizedQuery) return items
    return items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(normalizedQuery))
  }, [items, normalizedQuery])

  const visibleItems = hasQuery ? filtered : items
  const resolvedHeading = {
    ...defaultHeading,
    ...heading,
    alignment: heading?.alignment ?? defaultHeading.alignment,
  }
  const resolvedCta = hideCta
    ? null
    : {
        href: ctaHref ?? defaultCta.href,
        label: ctaLabel ?? defaultCta.label,
      }

  return (
    <section id={sectionId ?? 'faq'} className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow={resolvedHeading.eyebrow}
          title={resolvedHeading.title ?? ''}
          description={resolvedHeading.description}
          alignment={resolvedHeading.alignment === 'right' ? 'center' : resolvedHeading.alignment}
        />

        {resolvedCta ? (
          <div className="mt-6 flex justify-center">
            <a
              href={resolvedCta.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-semantic-legacy-brand-cocoa px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              {resolvedCta.label}
            </a>
          </div>
        ) : null}

        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-xl">
            <label htmlFor={`${sectionId ?? 'faq'}-search`} className="sr-only">
              Search FAQs
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-semantic-text-primary/55"
                aria-hidden="true"
              />
              <input
                id={`${sectionId ?? 'faq'}-search`}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions…"
                className="w-full rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-11 py-3 text-sm text-semantic-text-primary placeholder:text-semantic-text-primary/45 shadow-soft focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/25"
                autoComplete="off"
              />
              {hasQuery ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            {hasQuery ? (
              <p className="mt-3 text-center text-xs text-semantic-text-primary/60">
                {filtered.length ? `Showing ${filtered.length} result${filtered.length === 1 ? '' : 's'}.` : 'No results.'}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {visibleItems.map((f, visibleIdx) => {
            const idx = items.indexOf(f)
            const itemIndex = idx >= 0 ? idx : visibleIdx
            const isOpen = openIndex === itemIndex
            return (
              <div
                key={`${f.q}-${itemIndex}`}
                id={`${sectionId ?? 'faq'}-item-${itemIndex + 1}`}
                className={`rounded-3xl border bg-white/95 p-5 shadow-sm transition ${
                  isOpen ? 'border-semantic-legacy-brand-cocoa/30 shadow-lg' : 'border-semantic-accent-cta/40'
                } scroll-mt-24`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : itemIndex)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-semantic-text-primary">{f.q}</span>
                  {isOpen ? <Minus className="h-5 w-5 text-semantic-text-primary" /> : <Plus className="h-5 w-5 text-semantic-text-primary/60" />}
                </button>
                {isOpen ? (
                  f.a.toLowerCase().startsWith('customer review') ? (
                    <div className="mt-3 space-y-2 rounded-2xl bg-semantic-legacy-brand-blush/15 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-semantic-text-primary">
                        <span className="rounded-full bg-semantic-accent-cta/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-semantic-text-primary">
                          Customer review
                        </span>
                        <span className="text-sm font-semibold text-semantic-text-primary">★★★★★</span>
                      </div>
                      <p className="text-sm leading-relaxed text-semantic-text-primary/85">
                        {f.a.replace(/^customer review\s*·?\s*5★:\s*/i, '')}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-semantic-text-primary/75">{f.a}</p>
                  )
                ) : null}
              </div>
            )
          })}
          {hasQuery && !filtered.length && (
            <p className="rounded-2xl border border-dashed border-semantic-accent-cta/60 bg-white/80 p-4 text-center text-sm text-semantic-text-primary/70">
              No answers matched that search—reset the filter or send us a quick WhatsApp message.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
