interface PdpBottomCtaProps {
  productHandle: string
  ratingValue: number
  onAdd: () => void
  onBuy: () => void
  isAdding: boolean
  justAdded: boolean
  bottomCtaChips?: string[]
}

const PdpBottomCta = ({ productHandle, ratingValue, onAdd, onBuy, isAdding, justAdded, bottomCtaChips }: PdpBottomCtaProps) => {
  const chips = Array.isArray(bottomCtaChips)
    ? bottomCtaChips.map((chip) => (typeof chip === 'string' ? chip.trim() : '')).filter(Boolean)
    : []

  return (
    <section id="pdp-bottom-cta" className="border-t border-semantic-legacy-brand-blush/50 bg-semantic-legacy-brand-blush/10 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center md:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-semantic-text-primary/60">Ready when you are</p>
          <h3 className="font-heading text-2xl font-bold text-semantic-text-primary md:text-[28px]">
            {productHandle === 'lumelle-xl-microfibre-hair-towel'
              ? "Frizz-free hair starts today"
              : productHandle === 'satin-overnight-curler'
                ? "Wake up to flawless curls"
                : "Shower without the frizz"}
          </h3>
          <p className="text-sm font-semibold text-semantic-text-primary/65">
            Free returns · Ships in 48h · {ratingValue.toFixed(1)}★
          </p>
        </div>
        <div className="flex w-full max-w-lg flex-col items-center gap-3">
          <button
            id="pdp-bottom-cta-add"
            className={`inline-flex w-full items-center justify-center rounded-full bg-semantic-accent-cta px-6 py-3.5 text-base font-semibold text-semantic-legacy-brand-cocoa shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/30 ${justAdded ? 'motion-safe:animate-pulse motion-reduce:animate-none' : ''}`}
            onClick={onAdd}
            disabled={isAdding}
          >
            {isAdding ? 'Adding…' : 'Add to Cart'}
          </button>
          <button
            id="pdp-bottom-cta-buy"
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-semantic-legacy-brand-blush/70 px-6 py-3 text-base font-semibold text-semantic-legacy-brand-cocoa shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-legacy-brand-cocoa/30 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onBuy}
            disabled={isAdding}
          >
            {isAdding ? 'Processing…' : 'Buy Now'}
          </button>
          {chips.length ? (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-semantic-text-primary/70">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full bg-white px-3 py-1 shadow-soft">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default PdpBottomCta
