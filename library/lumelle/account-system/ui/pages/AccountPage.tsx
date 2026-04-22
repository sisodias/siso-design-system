import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, LogOut, MapPin, PackageOpen, UserRound } from 'lucide-react'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { Seo } from '@/components/Seo'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'
import { useAuthContext as useAuth } from '@platform/auth/providers/AuthContext'

const cardClass =
  'group relative overflow-hidden rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_-30px_rgba(0,0,0,0.35)]'

const AccountPage = () => {
  const { signedIn, user, isLoading, signOut } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.fullName || (user?.email ? user.email.split('@')[0] : 'Account')

  const handleSignOut = async () => {
    await signOut().catch(() => {})
    navigate('/', { replace: true })
  }

  return (
    <>
      <Seo title="Account" description="Manage your Lumelle account." url={toPublicUrl('/account')} type="website" />
      <MarketingLayout navItems={[]} subtitle="Account">
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-5 py-14 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Account</p>

          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-semantic-text-primary">
                {signedIn ? `Hi ${displayName}` : 'Manage your account'}
              </h1>
              <p className="mt-2 text-sm text-semantic-text-primary/70">
                {isLoading ? (
                  'Loading your account…'
                ) : signedIn ? (
                  <>
                    Signed in as <span className="font-semibold">{user?.email ?? 'your account'}</span>.
                  </>
                ) : (
                  <>
                    Sign in to view orders and addresses. You can still browse and shop without an account.
                  </>
                )}
              </p>
            </div>

            {!isLoading && signedIn ? (
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-5 py-2.5 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            ) : null}
          </div>

          {!isLoading && !signedIn ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <RouterLink
                to="/sign-in"
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white"
              >
                Sign in
              </RouterLink>
              <RouterLink
                to="/sign-up"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                Create account
              </RouterLink>
              <RouterLink
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                Continue shopping
              </RouterLink>
            </div>
          ) : null}

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <RouterLink to="/account/orders" className={cardClass}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-porcelain text-semantic-legacy-brand-cocoa ring-1 ring-semantic-legacy-brand-blush/60">
                    <PackageOpen className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-semantic-text-primary">Orders</div>
                    <div className="text-xs text-semantic-text-primary/60">Receipts & tracking links</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-semantic-text-primary/40 transition group-hover:translate-x-0.5 group-hover:text-semantic-text-primary/70" aria-hidden="true" />
              </div>
            </RouterLink>

            <RouterLink to="/account/addresses" className={cardClass}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-porcelain text-semantic-legacy-brand-cocoa ring-1 ring-semantic-legacy-brand-blush/60">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-semantic-text-primary">Addresses</div>
                    <div className="text-xs text-semantic-text-primary/60">Shipping details</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-semantic-text-primary/40 transition group-hover:translate-x-0.5 group-hover:text-semantic-text-primary/70" aria-hidden="true" />
              </div>
            </RouterLink>
          </div>

          <div className="mt-10 rounded-2xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/60 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-semantic-text-primary">
                  <UserRound className="h-4 w-4 text-semantic-text-primary/60" aria-hidden="true" />
                  Account status
                </div>
                <p className="mt-1 text-sm text-semantic-text-primary/70">
                  {isLoading ? 'Checking your sign-in status…' : signedIn ? 'Signed in.' : 'Not signed in.'}
                </p>
              </div>
              <RouterLink
                to="/cart"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
              >
                View cart
              </RouterLink>
            </div>
          </div>
          </div>
        </section>
      </MarketingLayout>
    </>
  )
}

export default AccountPage
