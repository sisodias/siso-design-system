import { Link as RouterLink } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { Seo } from '@/components/Seo'
import { SUPPORT_EMAIL, WHATSAPP_SUPPORT_URL } from '@/config/constants'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'

const PaymentMethodsPage = () => {
  return (
    <>
      <Seo
        title="Payments"
        description="Payments are handled securely at Shopify checkout."
        url={toPublicUrl('/account/payments')}
        type="website"
      />
      <MarketingLayout navItems={[]} subtitle="Account">
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>

        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-14 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Account</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-semantic-text-primary">Payments</h1>

            <p className="mt-4 text-sm leading-relaxed text-semantic-text-primary/70">
              Lumelle uses Shopify checkout for payments. We don’t store or manage saved cards inside this storefront.
              If you need help completing a purchase, message us and we’ll guide you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <RouterLink
                to="/account/orders"
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white"
              >
                View orders
              </RouterLink>
              <RouterLink
                to="/cart"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                View cart
              </RouterLink>
              <RouterLink
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                Continue shopping
              </RouterLink>
            </div>

            <div className="mt-10 rounded-2xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/60 p-5">
              <p className="text-sm font-semibold text-semantic-text-primary">Need support?</p>
              <p className="mt-2 text-sm text-semantic-text-primary/70">
                Email:{' '}
                <a className="underline underline-offset-4" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
              </p>
              {WHATSAPP_SUPPORT_URL ? (
                <p className="mt-2 text-sm text-semantic-text-primary/70">
                  WhatsApp:{' '}
                  <a className="underline underline-offset-4" href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noreferrer">
                    Message us
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </MarketingLayout>
    </>
  )
}

export default PaymentMethodsPage
