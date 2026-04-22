import { Link as RouterLink } from 'react-router-dom'
import { UserRound, Menu } from 'lucide-react'
import { useAuthContext as useAuth } from '@platform/auth/providers/AuthContext'
import { useDrawer } from '@ui/providers/DrawerContext'

type Promo = { label: string; href?: string }

type GlobalHeaderProps = {
  promoMessages: Promo[]
}

const PromoBar = ({ promos }: { promos: Promo[] }) => {
  if (!promos.length) return null
  return (
    <div className="bg-semantic-legacy-brand-cocoa text-white text-xs font-semibold px-4 py-2 flex flex-wrap items-center justify-center gap-4">
      {promos.map((p, idx) => (
        p.href ? (
          <RouterLink key={idx} to={p.href} className="underline underline-offset-4">
            {p.label}
          </RouterLink>
        ) : (
          <span key={idx}>{p.label}</span>
        )
      ))}
    </div>
  )
}

export const GlobalHeader = ({ promoMessages }: GlobalHeaderProps) => {
  const { signedIn, user, signOut } = useAuth()
  const drawer = useDrawer()

  return (
    <header className="sticky top-0 z-30 shadow-sm">
      <PromoBar promos={promoMessages} />
      <div className="bg-white px-4 py-3 border-b border-semantic-legacy-brand-blush/50">
        <div className="mx-auto max-w-6xl grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-3 justify-self-start min-w-0">
            <button
              aria-label="Open navigation"
              className="rounded-full border border-semantic-legacy-brand-blush/60 p-2 text-semantic-text-primary hover:bg-semantic-legacy-brand-blush/30"
              onClick={() => drawer.openMenu()}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <RouterLink to="/" className="justify-self-center text-lg font-semibold text-semantic-text-primary">
            Lumelle
          </RouterLink>

          <div className="flex items-center gap-3 justify-self-end min-w-0">
            <RouterLink
              to="/product/shower-cap"
              className="hidden sm:inline-flex rounded-full border border-semantic-legacy-brand-blush/60 px-4 py-2 text-sm font-semibold text-semantic-text-primary hover:bg-semantic-legacy-brand-blush/30"
            >
              Shop
            </RouterLink>
            <button
              onClick={() => drawer.openCart()}
              className="rounded-full border border-semantic-legacy-brand-blush/60 px-4 py-2 text-sm font-semibold text-semantic-text-primary hover:bg-semantic-legacy-brand-blush/30"
            >
              Cart
            </button>
            {signedIn ? (
              <RouterLink
                to="/account"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary hover:bg-semantic-legacy-brand-blush/30"
                aria-label="Open account"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-8 w-8 rounded-full border border-semantic-legacy-brand-blush/60 object-cover"
                  />
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </RouterLink>
            ) : (
              <RouterLink
                to="/sign-in"
                className="inline-flex items-center gap-2 rounded-full bg-semantic-accent-cta px-4 py-2 text-sm font-semibold text-semantic-text-primary shadow-soft hover:-translate-y-0.5 transition"
              >
                <UserRound className="h-4 w-4" />
                Sign in
              </RouterLink>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default GlobalHeader
