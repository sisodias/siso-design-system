import { useState, useEffect } from 'react'
import { ShoppingBag, Zap, X } from 'lucide-react'

interface MobileStickyCtaProps {
  price: number
  onAdd: () => void
  onBuy: () => void
  isAdding: boolean
  justAdded: boolean
}

const MobileStickyCta = ({ price, onAdd, onBuy, isAdding, justAdded }: MobileStickyCtaProps) => {
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

export default MobileStickyCta
