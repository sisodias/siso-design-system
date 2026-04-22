import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { Seo } from '@/components/Seo'
import { SUPPORT_EMAIL, WHATSAPP_SUPPORT_URL } from '@/config/constants'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'

const OrdersPage = () => {
  return (
    <>
      <Seo title="Orders" description="Your Lumelle receipts and tracking links." url={toPublicUrl('/account/orders')} type="website" />
      <MarketingLayout navItems={[]} subtitle="Orders">
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-14 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Account</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-semantic-text-primary">Your orders</h1>
            <p className="mt-4 text-sm leading-relaxed text-semantic-text-primary/70">
              Order history is still being wired up in this storefront. If you’ve placed an order, your receipt and tracking link will be in your confirmation/dispatch email.
            </p>

            <div className="mt-8 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Quick actions</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/order/track"
                  className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  Track an order
                </Link>
                <Link
                  to="/returns"
                  className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                >
                  Start a return
                </Link>
                <a
                  href={WHATSAPP_SUPPORT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                >
                  Message support (WhatsApp)
                </a>
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Order help')}`}
                  className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                >
                  Email support
                </a>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/account"
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white"
              >
                Back to account
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                View cart
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                Back to shop
              </Link>
            </div>
          </div>
        </section>
      </MarketingLayout>
    </>
  )
}

export default OrdersPage
