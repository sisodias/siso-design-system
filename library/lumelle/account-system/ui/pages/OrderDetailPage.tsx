import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { Seo } from '@/components/Seo'
import { SUPPORT_EMAIL, WHATSAPP_SUPPORT_URL } from '@/config/constants'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'

const OrderDetailPage = () => {
  const { orderId } = useParams()
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(t)
  }, [toast])

  const reference = (orderId ?? '').trim()

  const mailtoHref = useMemo(() => {
    const subject = `Order help${reference ? ` — ${reference}` : ''}`
    const lines = [
      'Hi Lumelle support,',
      '',
      'I need help with my order.',
      '',
      `Order reference: ${reference || '(not sure)'}`,
      '',
      'Thanks,',
    ]
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }, [reference])

  return (
    <>
      <Seo
        title="Order details"
        description="Order reference and quick links to tracking and support."
        url={toPublicUrl(reference ? `/account/orders/${reference}` : '/account/orders')}
        type="website"
      />
      <MarketingLayout navItems={[]} subtitle="Order">
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>

        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-14 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Account</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-semantic-text-primary">Order details</h1>
            <p className="mt-4 text-sm leading-relaxed text-semantic-text-primary/70">
              This storefront doesn’t yet show full order details in-app. If you have your order reference, you can copy it below and contact support.
            </p>

            {reference ? (
              <div className="mt-8 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Order reference</p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-mono text-[13px] text-semantic-text-primary">{reference}</div>
                    <div className="mt-1 text-xs text-semantic-text-primary/60">Include this when requesting tracking or returns help.</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {toast ? (
                      <span
                        className="rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-3 py-1 text-xs font-semibold text-semantic-text-primary shadow-soft"
                        role="status"
                        aria-live="polite"
                      >
                        {toast}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-5 py-2.5 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                      onClick={async () => {
                        try {
                          if (navigator.clipboard?.writeText) {
                            await navigator.clipboard.writeText(reference)
                            setToast('Copied')
                            return
                          }
                        } catch {
                          // fall through
                        }
                        window.prompt('Copy this order reference:', reference)
                        setToast('Copy')
                      }}
                    >
                      Copy reference
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-3">
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
                href={mailtoHref}
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
              >
                Email support
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/account/orders"
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white"
              >
                Back to orders
              </Link>
              <Link
                to="/account"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                Account home
              </Link>
            </div>
          </div>
        </section>
      </MarketingLayout>
    </>
  )
}

export default OrderDetailPage
