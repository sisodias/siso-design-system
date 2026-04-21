export const WHATSAPP_INVITE_URL =
  import.meta.env.VITE_WHATSAPP_INVITE_URL ??
  'https://chat.whatsapp.com/DDxJHZzpW003WZhayKJnWd'

const normalizeWhatsAppPhone = (raw: unknown): string | null => {
  const value = String(raw ?? '').trim()
  if (!value) return null
  const digits = value.replace(/[^\d]/g, '')
  // WhatsApp uses E.164 digits without "+"; typical lengths are 8–15.
  if (digits.length < 8) return null
  return digits
}

export const WHATSAPP_SUPPORT_PHONE = normalizeWhatsAppPhone(import.meta.env.VITE_WHATSAPP_SUPPORT_PHONE)

export const WHATSAPP_SUPPORT_TEXT =
  (import.meta.env.VITE_WHATSAPP_SUPPORT_TEXT ?? '').trim() || 'Hi Lumelle team — I need help with my order.'

const buildWhatsAppUrl = (phone: string | null, text: string | null): string | null => {
  if (!phone) return null
  const base = `https://wa.me/${phone}`
  const msg = (text ?? '').trim()
  if (!msg) return base
  return `${base}?text=${encodeURIComponent(msg)}`
}

const WHATSAPP_SUPPORT_URL_FALLBACK = (import.meta.env.VITE_WHATSAPP_SUPPORT_URL ?? '').trim() || null

export const WHATSAPP_SUPPORT_URL =
  buildWhatsAppUrl(WHATSAPP_SUPPORT_PHONE, WHATSAPP_SUPPORT_TEXT) ||
  WHATSAPP_SUPPORT_URL_FALLBACK

export const INSTAGRAM_URL =
  import.meta.env.VITE_INSTAGRAM_URL ??
  'https://www.instagram.com/lumelleuk/'

export const TIKTOK_URL =
  import.meta.env.VITE_TIKTOK_URL ??
  'https://www.tiktok.com/@lumelleuk'

export const TWITTER_URL =
  import.meta.env.VITE_TWITTER_URL ??
  'https://x.com'

// Client-requested public contact email for footer and CTAs
export const SUPPORT_EMAIL = 'info@lumellebeauty.co.uk'

// Link to the creator content brief shared in welcome/onboarding flows
export const CONTENT_BRIEF_PDF_URL = import.meta.env.VITE_CONTENT_BRIEF_URL?.trim() || null
export const CONTENT_BRIEF_URL = CONTENT_BRIEF_PDF_URL ?? '/brief'

// Storefront pricing/shipping constants
export const FREE_SHIPPING_THRESHOLD_GBP = 20
export const FREE_SHIPPING_THRESHOLD_LABEL = `£${FREE_SHIPPING_THRESHOLD_GBP}+`

// Client requested: cap per-line quantity in cart/checkout flows.
export const MAX_CART_ITEM_QTY = 4
