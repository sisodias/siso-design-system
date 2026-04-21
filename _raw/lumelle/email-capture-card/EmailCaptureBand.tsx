import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Lock, Gift, PartyPopper, Copy, Check, Mail } from 'lucide-react'

const DISCOUNT_CODE = 'LUMELLE10'
const EMAIL_CAPTURE_KEY = 'lumelle_email_capture'

export const EmailCaptureBand = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const existing = localStorage.getItem(EMAIL_CAPTURE_KEY)
      if (!existing) return
      setStatus('success')
      setMessage("You\'re already on the list.")
    } catch {
      // ignore storage errors
    }
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    try {
      setStatus('loading')
      setMessage(null)

      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'email-capture-band' }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `Request failed (${res.status})`)
      }

      const data = (await res.json().catch(() => null)) as { created?: boolean } | null

      localStorage.setItem(EMAIL_CAPTURE_KEY, '1')
      setStatus('success')
      setMessage(data?.created ? 'Thanks — you\'re on the list.' : 'You\'re already on the list.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Couldn\'t subscribe right now. Please try again.')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-semantic-legacy-brand-blush/30 via-semantic-legacy-brand-blush/40 to-semantic-legacy-brand-cocoa/20 py-16 md:py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-semantic-accent-cta/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-semantic-legacy-brand-cocoa/20 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 md:px-6">
        {/* Main Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur-sm p-8 md:p-12 shadow-2xl ring-1 ring-semantic-legacy-brand-blush/30">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-semantic-accent-cta/20 to-semantic-legacy-brand-cocoa/20 shadow-lg ring-1 ring-semantic-accent-cta/30">
              {status === 'success' ? (
                <PartyPopper className="h-8 w-8 text-semantic-legacy-brand-cocoa" />
              ) : (
                <Gift className="h-8 w-8 text-semantic-legacy-brand-cocoa" />
              )}
            </div>

            {/* Heading */}
            <div className="space-y-2">
              {status === 'success' ? (
                <>
                  <h3 className="font-heading text-3xl font-bold text-semantic-text-primary md:text-4xl">
                    You\'re in! 🎉
                  </h3>
                  <p className="text-lg text-semantic-text-primary/80">Welcome to the family</p>
                </>
              ) : (
                <>
                  <h3 className="font-heading text-3xl font-bold text-semantic-text-primary md:text-4xl">
                    Get <span className="bg-gradient-to-r from-semantic-legacy-brand-cocoa to-semantic-accent-cta bg-clip-text text-transparent">10% off</span> your first order
                  </h3>
                  <p className="text-base text-semantic-text-primary/70">
                    Join for exclusive creator tutorials, drops, and early access.
                  </p>
                </>
              )}
            </div>

            {/* Content */}
            {status === 'success' ? (
              <div className="w-full max-w-md space-y-4">
                {/* Discount Badge */}
                <div
                  onClick={() => void handleCopy()}
                  className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-semantic-accent-cta/40 bg-gradient-to-br from-semantic-legacy-brand-blush/30 to-semantic-accent-cta/10 p-6 transition-all hover:border-semantic-accent-cta/60 hover:shadow-lg active:scale-[0.98]"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-semantic-text-primary/60">Your code</span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="font-heading text-2xl font-bold tracking-wider text-semantic-legacy-brand-cocoa">
                      ✨ {DISCOUNT_CODE} ✨
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-semantic-accent-cta">
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Tap to copy</span>
                      </>
                    )}
                  </div>
                </div>

                {message ? (
                  <p className="text-sm text-semantic-text-primary/70">{message}</p>
                ) : null}

                <p className="text-sm text-semantic-text-primary/80">
                  Use at checkout for <span className="font-semibold">10% off</span> your first order.
                </p>
              </div>
            ) : (
              <form
                className="w-full max-w-md space-y-4"
                aria-label="Newsletter signup"
                onSubmit={handleSubmit}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-semantic-text-primary/40" />
                  </div>
                  <input
                    id="landing-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    className="w-full rounded-2xl border-2 border-semantic-legacy-brand-blush/40 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-semantic-accent-cta/60 focus:ring-4 focus:ring-semantic-accent-cta/10 disabled:cursor-not-allowed disabled:opacity-70"
                    placeholder="Enter your email"
                  />
                </div>
                {message && status === 'error' ? (
                  <p className="text-sm text-red-600" aria-live="polite">
                    {message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-semantic-legacy-brand-cocoa to-semantic-legacy-brand-cocoa/90 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {status === 'loading' ? (
                      <>Unlocking your discount…</>
                    ) : (
                      <>
                        Unlock Your 10% Off
                        <Gift className="h-5 w-5 transition-transform group-hover:scale-110" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-semantic-text-primary/60">
              <Lock className="h-4 w-4" aria-hidden />
              <span>Secure signup. No spam, unsubscribe anytime.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
