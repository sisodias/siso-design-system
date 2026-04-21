import { Link as RouterLink } from 'react-router-dom'
import { Instagram, Music2, ShoppingBag, BookOpen, MessageCircle, Package, RotateCcw, Mail } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { INSTAGRAM_URL, TIKTOK_URL } from '@/config/constants'

type GlobalFooterProps = {
  supportEmail: string
}

export function GlobalFooter({ supportEmail }: GlobalFooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null)

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = newsletterEmail.trim()
    if (!email) return

    setNewsletterStatus('loading')
    setNewsletterMessage(null)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `Request failed (${res.status})`)
      }

      const data = (await res.json().catch(() => null)) as { created?: boolean } | null
      setNewsletterStatus('success')
      setNewsletterMessage(data?.created ? 'Thanks — you’re on the list.' : 'You’re already on the list.')
      setNewsletterEmail('')
    } catch {
      setNewsletterStatus('error')
      setNewsletterMessage('Couldn’t subscribe right now. Please try again.')
    }
  }

  const socials = [
    { label: 'Instagram', href: INSTAGRAM_URL, icon: Instagram },
    { label: 'TikTok', href: TIKTOK_URL, icon: Music2 },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      className="border-t border-semantic-legacy-brand-blush/30 bg-gradient-to-b from-semantic-legacy-brand-blush/20 to-semantic-legacy-brand-blush/30 text-semantic-text-primary"
      data-sticky-buy-target
    >
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6">
        {/* Centered Logo & Brand Section */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <img src="/l-icon.svg" alt="Lumelle" className="h-12 w-12" />
          <p className="font-heading text-2xl font-semibold uppercase tracking-[0.28em]">Lumelle</p>
          <p className="max-w-md text-sm text-semantic-text-primary/75">
            Creator-grade shower caps that keep silk presses, curls, and braids flawless on camera.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-semantic-text-primary shadow-soft ring-1 ring-semantic-accent-cta/50">
            Made in UK • 30-day returns
          </div>
        </div>

        {/* Links Grid */}
        <div className="mt-16 grid gap-x-16 gap-y-12 grid-cols-2 lg:grid-cols-3">
          {/* Explore Column */}
          <div className="space-y-4 text-center">
            <div className="grid grid-cols-1 gap-3 text-sm text-semantic-text-primary/80">
              <RouterLink
                to="/product/shower-cap"
                className="group inline-flex items-center justify-center gap-2 transition-all hover:text-semantic-text-primary"
              >
                <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Shop</span>
              </RouterLink>
              <RouterLink
                to="/brand-story"
                className="group inline-flex items-center justify-center gap-2 transition-all hover:text-semantic-text-primary"
              >
                <BookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Brand Story</span>
              </RouterLink>
              <RouterLink
                to="/blog"
                className="group inline-flex items-center justify-center gap-2 transition-all hover:text-semantic-text-primary"
              >
                <BookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Blog</span>
              </RouterLink>
            </div>
          </div>

          {/* Support Column */}
          <div className="space-y-4 text-center">
            <div className="grid grid-cols-1 gap-3 text-sm text-semantic-text-primary/80">
              <RouterLink
                to="/faq"
                className="group inline-flex items-center justify-center gap-2 transition-all hover:text-semantic-text-primary"
              >
                <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>FAQ</span>
              </RouterLink>
              <RouterLink
                to="/shipping"
                className="group inline-flex items-center justify-center gap-2 transition-all hover:text-semantic-text-primary"
              >
                <Package className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Shipping & Returns</span>
              </RouterLink>
              <a
                href={`mailto:${supportEmail}`}
                className="group inline-flex items-center justify-center gap-2 transition-all hover:text-semantic-text-primary"
              >
                <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          {/* Newsletter Column - Full width on mobile/tablet */}
          <div className="col-span-2 space-y-4 text-center lg:col-span-1 lg:text-left">
            <form
              onSubmit={handleNewsletterSubmit}
              aria-label="Newsletter signup"
              className="w-full max-w-sm mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-2 rounded-full border border-semantic-accent-cta/70 bg-white/85 px-3 py-1.5 text-sm font-semibold text-semantic-text-primary shadow-soft transition-shadow focus-within:shadow-md">
                <input
                  id="footer-newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email for updates"
                  className="w-full bg-transparent text-sm font-semibold text-semantic-text-primary outline-none placeholder:text-semantic-text-primary/50"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-semantic-legacy-brand-cocoa px-3 py-1 text-xs font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {newsletterStatus === 'loading' ? '…' : 'Join'}
                  <span aria-hidden className="text-xs">→</span>
                </button>
              </div>
              {newsletterMessage ? (
                <p
                  className={`mt-2 text-xs ${newsletterStatus === 'error' ? 'text-red-600' : 'text-semantic-text-primary/70'}`}
                  aria-live="polite"
                >
                  {newsletterMessage}
                </p>
              ) : null}
            </form>
            <div className="flex items-center justify-center gap-3 text-sm text-semantic-text-primary/80 lg:justify-start">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-semantic-accent-cta/50 bg-white/85 text-semantic-text-primary transition-all hover:-translate-y-0.5 hover:bg-semantic-accent-cta/20 hover:text-semantic-text-primary hover:shadow-md shadow-soft"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-semantic-legacy-brand-blush/40 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-semantic-text-primary/60">
              © {new Date().getFullYear()} Lumelle. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-semantic-text-primary/60">
              <RouterLink
                to="/terms"
                className="transition hover:text-semantic-text-primary"
              >
                Terms
              </RouterLink>
              <span>•</span>
              <RouterLink
                to="/privacy"
                className="transition hover:text-semantic-text-primary"
              >
                Privacy
              </RouterLink>
            </div>
            <button
              onClick={scrollToTop}
              className="rounded-full border border-semantic-legacy-brand-blush/60 bg-white/80 p-2 text-semantic-text-primary transition-all hover:bg-semantic-accent-cta/20 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              aria-label="Back to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default GlobalFooter
