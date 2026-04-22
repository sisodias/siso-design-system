import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { SUPPORT_EMAIL } from '@/config/constants'
import PublicHeader from '@ui/components/PublicHeader'
import { GlobalFooter } from '@ui/components/GlobalFooter'

export type NavItem = {
  id: string
  label: string
}

type MarketingLayoutProps = {
  children: ReactNode
  navItems?: NavItem[]
  activeId?: string
  onPrimaryAction?: () => void
  primaryLabel?: string
  subtitle?: string | null
}

export const MarketingLayout = ({
  children,
  navItems,
  activeId,
  onPrimaryAction,
  primaryLabel = 'Join WhatsApp',
  subtitle = 'Creator Program',
}: MarketingLayoutProps) => {
  // Top bar: Urgency & promotions (rotating)
  const promoMessages = [
    { label: 'Buy 2, save 10% — Shop now', href: '/product/lumelle-shower-cap' },
    { label: 'Free shipping' },
    { label: '30-day money back guarantee' },
  ]
  const [activePromo, setActivePromo] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    if (reducedMotion) return
    const id = window.setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promoMessages.length)
    }, 4000)
    return () => window.clearInterval(id)
  }, [promoMessages.length])

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return

    const headerOffset = 110
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen bg-white text-semantic-text-primary">
      <a
        href="#main-content"
        onClick={() => {
          const target = document.getElementById('main-content')
          if (target instanceof HTMLElement) target.focus()
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 rounded-full bg-white px-4 py-2 text-sm font-semibold text-semantic-text-primary shadow-soft ring-1 ring-semantic-legacy-brand-blush/60"
      >
        Skip to content
      </a>
      <header
        className="border-b border-semantic-legacy-brand-blush/40 bg-white/95 backdrop-blur-0 md:backdrop-blur"
      >
        <PublicHeader
          promoMessages={promoMessages}
          activePromo={activePromo}
          subtitle={subtitle ?? undefined}
          primaryLabel={primaryLabel}
          onPrimaryAction={onPrimaryAction}
        />
      </header>
      {navItems && navItems.length > 0 ? (
        <nav aria-label="Page sections" className="hidden md:block border-b border-semantic-legacy-brand-blush/40 bg-white/95">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-2 overflow-x-auto py-3">
              {navItems.map((item) => {
                const isActive = activeId ? item.id === activeId : false
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleScrollTo(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-semantic-legacy-brand-cocoa text-white'
                        : 'border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary hover:bg-semantic-legacy-brand-blush/20'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      ) : null}
      <main id="main-content" tabIndex={-1} className="focus:outline-none overflow-visible">
        {children}
      </main>
      <GlobalFooter supportEmail={SUPPORT_EMAIL} />
    </div>
  )
}

export default MarketingLayout
