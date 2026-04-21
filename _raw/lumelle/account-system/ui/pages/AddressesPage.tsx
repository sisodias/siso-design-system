import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { Seo } from '@/components/Seo'
import { SUPPORT_EMAIL, WHATSAPP_SUPPORT_URL } from '@/config/constants'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'

const AddressesPage = () => {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [newAddress, setNewAddress] = useState('')

  const mailtoHref = useMemo(() => {
    const subject = `Address change request${orderNumber.trim() ? ` — ${orderNumber.trim()}` : ''}`
    const lines = [
      'Hi Lumelle support,',
      '',
      'I need to update the shipping address for my order.',
      '',
      `Order number/reference: ${orderNumber.trim() || '(not sure)'}`,
      `Email used at checkout: ${email.trim() || '(not sure)'}`,
      '',
      'New shipping address:',
      newAddress.trim() || '(not provided)',
      '',
      'Thank you,',
    ]
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }, [email, newAddress, orderNumber])

  return (
    <>
      <Seo title="Addresses" description="Manage shipping details and get help updating an order." url={toPublicUrl('/account/addresses')} type="website" />
      <MarketingLayout navItems={[]} subtitle="Addresses">
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>

        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-5 py-14 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Account</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-semantic-text-primary">Addresses</h1>
            <p className="mt-4 text-sm leading-relaxed text-semantic-text-primary/70">
              Address book management isn’t available in-app yet. If you need to update shipping details for an existing order, send us the new address and we’ll help.
            </p>

            <div className="mt-8 space-y-4 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Request an address update</p>

              <div className="grid gap-3">
                <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                  Order number/reference (optional)
                  <input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. #1234 or your confirmation reference"
                    className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45"
                    inputMode="text"
                    autoCapitalize="characters"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                  Email used at checkout (optional)
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                  New shipping address (optional)
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Name, street, city, postcode, country…"
                    className="min-h-[120px] rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45"
                  />
                </label>
              </div>

              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href={mailtoHref}
                  className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  Email support to update address
                </a>
                <a
                  href={WHATSAPP_SUPPORT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
                >
                  Message on WhatsApp
                </a>
              </div>

              <p className="mt-3 text-xs text-semantic-text-primary/60">
                Tip: If your order has already dispatched, we may not be able to change the address — but message us anyway and we’ll advise.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/account"
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white"
              >
                Back to account
              </Link>
              <Link
                to="/order/track"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                Track an order
              </Link>
            </div>
          </div>
        </section>
      </MarketingLayout>
    </>
  )
}

export default AddressesPage
