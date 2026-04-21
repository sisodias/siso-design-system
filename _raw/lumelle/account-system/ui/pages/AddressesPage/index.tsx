import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import { Seo } from '@/components/Seo'
import { SUPPORT_EMAIL, WHATSAPP_SUPPORT_URL } from '@/config/constants'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'
import { Plus, MapPin, Edit2, Trash2, Check, Home, Building } from 'lucide-react'
import type { MailingAddress } from '../../shared'
import {
  fetchShopifyAddresses,
  createShopifyAddress,
  updateShopifyAddress,
  deleteShopifyAddress,
  setDefaultShopifyAddress,
  formatAddress,
} from '../../shared'

type FormMode = 'create' | 'edit'
type FormData = {
  firstName: string
  lastName: string
  company: string
  address1: string
  address2: string
  city: string
  province: string
  zip: string
  country: string
  phone: string
}

const emptyForm: FormData = {
  firstName: '',
  lastName: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  province: '',
  zip: '',
  country: 'United Kingdom',
  phone: '',
}

const COMMON_COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Ireland',
  'Netherlands',
  'Belgium',
  'Spain',
  'Italy',
]

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<MailingAddress[]>([])
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<FormMode | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    loadAddresses()
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(t)
  }, [toast])

  const loadAddresses = async () => {
    setLoading(true)
    setError(null)

    const customerAccessToken = localStorage.getItem('shopifyCustomerAccessToken')
    const result = await fetchShopifyAddresses(customerAccessToken || undefined)

    if (result.error) {
      setError(result.error.message)
    } else if (result.customer) {
      setAddresses(result.customer.addresses.nodes)
      setDefaultAddressId(result.customer.defaultAddress?.id || null)
    }

    setLoading(false)
  }

  const handleCreate = () => {
    setFormMode('create')
    setEditingId(null)
    setFormData(emptyForm)
    setFormErrors({})
  }

  const handleEdit = (address: MailingAddress) => {
    setFormMode('edit')
    setEditingId(address.id)
    setFormData({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address1: address.address1 || '',
      address2: address.address2 || '',
      city: address.city || '',
      province: address.province || '',
      zip: address.zip || '',
      country: address.country || 'United Kingdom',
      phone: address.phone || '',
    })
    setFormErrors({})
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    setSubmitting(true)

    const customerAccessToken = localStorage.getItem('shopifyCustomerAccessToken')
    const result = await deleteShopifyAddress(id, customerAccessToken || undefined)

    if (result.error) {
      setFormErrors({ general: result.error })
    } else if (result.success) {
      await loadAddresses()
      setToast('Address deleted')
    }

    setSubmitting(false)
  }

  const handleSetDefault = async (id: string) => {
    setSubmitting(true)

    const customerAccessToken = localStorage.getItem('shopifyCustomerAccessToken')
    const result = await setDefaultShopifyAddress(id, customerAccessToken || undefined)

    if (result.error) {
      setFormErrors({ general: result.error })
    } else if (result.success) {
      await loadAddresses()
      setToast('Default address updated')
    }

    setSubmitting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const errors: Record<string, string> = {}
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.address1.trim()) errors.address1 = 'Address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.zip.trim()) errors.zip = 'Postcode is required'
    if (!formData.country.trim()) errors.country = 'Country is required'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSubmitting(true)
    setFormErrors({})

    const customerAccessToken = localStorage.getItem('shopifyCustomerAccessToken')

    if (formMode === 'create') {
      const result = await createShopifyAddress(formData, customerAccessToken || undefined)

      if (result.error) {
        setFormErrors({ general: result.error })
      } else if (result.customerUserErrors?.length) {
        const errors: Record<string, string> = { general: result.customerUserErrors[0].message }
        setFormErrors(errors)
      } else if (result.customerAddress) {
        await loadAddresses()
        setFormMode(null)
        setToast('Address added')
      }
    } else if (formMode === 'edit' && editingId) {
      const result = await updateShopifyAddress(editingId, formData, customerAccessToken || undefined)

      if (result.error) {
        setFormErrors({ general: result.error })
      } else if (result.customerUserErrors?.length) {
        const errors: Record<string, string> = { general: result.customerUserErrors[0].message }
        setFormErrors(errors)
      } else if (result.customerAddress) {
        await loadAddresses()
        setFormMode(null)
        setToast('Address updated')
      }
    }

    setSubmitting(false)
  }

  const handleCancel = () => {
    setFormMode(null)
    setEditingId(null)
    setFormData(emptyForm)
    setFormErrors({})
  }

  return (
    <>
      <Seo
        title="Addresses"
        description="Manage your shipping addresses for faster checkout."
        url={toPublicUrl('/account/addresses')}
        type="website"
      />
      <MarketingLayout navItems={[]} subtitle="Account">
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-5 py-14 md:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">
                  Account
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-semantic-text-primary">
                  Addresses
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-semantic-text-primary/70">
                  Manage your shipping addresses for faster checkout.
                </p>
              </div>

              {!formMode && !loading && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="hidden sm:inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add address
                </button>
              )}
            </div>

            {/* Toast */}
            {toast && (
              <div className="mt-4 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-center">
                <p className="text-sm font-medium text-green-800">{toast}</p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="mt-8 flex justify-center">
                <div className="h-40 w-40 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/30 motion-safe:animate-pulse motion-reduce:animate-none" />
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <MapPin className="mx-auto h-12 w-12 text-red-400" />
                <p className="mt-4 text-sm font-semibold text-red-800">Unable to load addresses</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            {formMode && !loading && (
              <div className="mt-8 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-semantic-text-primary">
                  {formMode === 'create' ? 'Add new address' : 'Edit address'}
                </h2>

                {formErrors.general && (
                  <p className="mt-3 text-sm text-red-600">{formErrors.general}</p>
                )}

                <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                    First name
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    />
                    {formErrors.firstName && <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>}
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                    Last name
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    />
                    {formErrors.lastName && <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>}
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary sm:col-span-2">
                    Company (optional)
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    />
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary sm:col-span-2">
                    Address
                    <input
                      type="text"
                      value={formData.address1}
                      onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                      placeholder="Street address"
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    />
                    {formErrors.address1 && <p className="mt-1 text-xs text-red-600">{formErrors.address1}</p>}
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary sm:col-span-2">
                    Apartment, suite, etc. (optional)
                    <input
                      type="text"
                      value={formData.address2}
                      onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    />
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                    City
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    />
                    {formErrors.city && <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>}
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                    Postcode
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    />
                    {formErrors.zip && <p className="mt-1 text-xs text-red-600">{formErrors.zip}</p>}
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                    County/State (optional)
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    />
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary">
                    Country
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                    >
                      {COMMON_COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {formErrors.country && <p className="mt-1 text-xs text-red-600">{formErrors.country}</p>}
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-semantic-text-primary sm:col-span-2">
                    Phone (optional)
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm font-normal text-semantic-text-primary placeholder:text-semantic-text-primary/45 focus:outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/20"
                      inputMode="tel"
                    />
                  </label>

                  <div className="mt-2 flex flex-wrap gap-3 sm:col-span-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving...' : formMode === 'create' ? 'Add address' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={submitting}
                      className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses list */}
            {!loading && !formMode && addresses.length === 0 && (
              <div className="mt-8 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/30 p-8 text-center">
                <MapPin className="mx-auto h-12 w-12 text-semantic-legacy-brand-blush" />
                <p className="mt-4 text-sm font-semibold text-semantic-text-primary">No addresses yet</p>
                <p className="mt-1 text-sm text-semantic-text-primary/70">
                  Add your first address for faster checkout.
                </p>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add address
                </button>
              </div>
            )}

            {!loading && !formMode && addresses.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={[
                      'rounded-3xl border p-6 shadow-sm transition',
                      address.id === defaultAddressId
                        ? 'border-semantic-legacy-brand-cocoa bg-brand-porcelain/50'
                        : 'border-semantic-legacy-brand-blush/60 bg-white',
                    ].join(' ')}
                  >
                    {/* Default badge */}
                    {address.id === defaultAddressId && (
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-semantic-legacy-brand-cocoa px-3 py-1">
                        <Home className="h-3 w-3 text-white" />
                        <span className="text-xs font-semibold text-white">Default</span>
                      </div>
                    )}

                    {/* Address content */}
                    <div className="whitespace-pre-line text-sm text-semantic-text-primary">
                      {formatAddress(address)}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {address.id !== defaultAddressId && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          disabled={submitting}
                          className="inline-flex items-center gap-1 rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-3 py-1.5 text-xs font-semibold text-semantic-text-primary hover:bg-brand-porcelain/60 disabled:opacity-50"
                        >
                          <Check className="h-3 w-3" />
                          Set default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleEdit(address)}
                        disabled={submitting}
                        className="inline-flex items-center gap-1 rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-3 py-1.5 text-xs font-semibold text-semantic-text-primary hover:bg-brand-porcelain/60 disabled:opacity-50"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(address.id)}
                          disabled={submitting}
                          className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Support links */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/account/orders"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
              >
                View orders
              </Link>
              <Link
                to="/account/profile"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
              >
                Edit profile
              </Link>
              <a
                href={WHATSAPP_SUPPORT_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
              >
                Message on WhatsApp
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60"
              >
                Email support
              </a>
            </div>

            {/* Bottom navigation */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white"
              >
                Back to shop
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary"
              >
                View cart
              </Link>
            </div>
          </div>
        </section>
      </MarketingLayout>
    </>
  )
}
