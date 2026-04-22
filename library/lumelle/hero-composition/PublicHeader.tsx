import { Link as RouterLink } from 'react-router-dom'
import { Menu, UserRound } from 'lucide-react'
import { useDrawer } from '@ui/providers/DrawerContext'

type Promo = { label: string; href?: string }

type PublicHeaderProps = {
  promoMessages: Promo[]
  activePromo: number
  subtitle?: string | null
  primaryLabel?: string
  onPrimaryAction?: () => void
  onOpenMenu?: () => void
}

export function PublicHeader({
  promoMessages,
  activePromo,
  subtitle,
  primaryLabel = 'Join WhatsApp',
  onPrimaryAction,
  onOpenMenu,
}: PublicHeaderProps) {
  const { openMenu } = useDrawer()
  const handleOpenMenu = onOpenMenu ?? openMenu

  return (
    <>
      {/* Promo strip */}
      <div className="overflow-hidden bg-semantic-legacy-brand-blush">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="relative flex h-7 md:h-9 items-center justify-center text-[10px] font-semibold uppercase tracking-[0.18em] md:text-xs md:tracking-[0.24em] text-semantic-legacy-brand-cocoa">
            {promoMessages.map((msg, idx) => (
              <span
                key={msg.label}
                className={`absolute whitespace-nowrap transition-opacity duration-300 ${
                  idx === activePromo ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={idx !== activePromo}
              >
                {msg.href ? (
                  <RouterLink
                    to={msg.href}
                    tabIndex={idx === activePromo ? 0 : -1}
                    className="underline decoration-semantic-legacy-brand-cocoa/50 underline-offset-4 hover:text-semantic-legacy-brand-cocoa/80"
                  >
                    {msg.label}
                  </RouterLink>
                ) : (
                  msg.label
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top nav */}
      <div className="w-full px-3 md:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-3 py-2 md:py-3">
          {/* Burger menu - left */}
          <button
            aria-label="Open menu"
            onClick={handleOpenMenu}
            className="inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center text-semantic-legacy-brand-cocoa hover:text-semantic-legacy-brand-cocoa/70"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Menu className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.5} />
          </button>

          {/* Logo - center */}
          <RouterLink to="/" className="flex flex-col items-center justify-center gap-0.5 text-center justify-self-center">
            <span className="font-heading text-lg md:text-xl font-semibold uppercase tracking-[0.18em] md:tracking-[0.22em] text-semantic-legacy-brand-cocoa leading-none">
              Lumelle
            </span>
            {subtitle ? (
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-semantic-legacy-brand-cocoa/60">
                {subtitle}
              </span>
            ) : null}
          </RouterLink>

          {/* Right side icons */}
          <div className="flex items-center justify-self-end gap-1.5 md:gap-2">
            {/* WhatsApp button - desktop only */}
            {onPrimaryAction ? (
              <button
                onClick={onPrimaryAction}
                type="button"
                className="hidden items-center justify-center gap-2 rounded-full bg-semantic-accent-cta px-4 py-2 text-sm font-semibold text-semantic-legacy-brand-cocoa shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-semantic-accent-cta/90 md:inline-flex"
              >
                {primaryLabel}
              </button>
            ) : null}

            {/* Account icon - desktop and mobile */}
            <RouterLink
              to="/account"
              className="inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center text-semantic-legacy-brand-cocoa hover:text-semantic-legacy-brand-cocoa/70"
              aria-label="Account"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <UserRound className="h-6 w-6" strokeWidth={2} />
            </RouterLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default PublicHeader
