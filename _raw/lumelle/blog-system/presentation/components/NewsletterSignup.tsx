import { useState } from 'react'

type NewsletterSignupProps = {
  headline?: string
  description?: string
  buttonText?: string
  placeholder?: string
}

export default function NewsletterSignup({
  headline = 'Get frizz-free tips & exclusive offers',
  description = 'Join 10,000+ others getting weekly hair care routines and product updates.',
  buttonText = 'Subscribe',
  placeholder = 'Enter your email',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Integrate with your newsletter service (e.g., ConvertKit, Mailchimp)
      // For now, simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setEmail('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-gradient-to-br from-semantic-legacy-brand-blush/50 via-semantic-legacy-brand-blush/30 to-semantic-legacy-brand-blush/40 p-6 shadow-soft md:p-8">
      <div className="space-y-4">
        <div>
          <h3 className="font-heading text-xl text-semantic-text-primary md:text-2xl">
            {headline}
          </h3>
          <p className="mt-2 text-sm text-semantic-text-primary/80 md:text-base">
            {description}
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-2xl border border-emerald-500/60 bg-emerald-50 p-4 text-center">
            <p className="font-semibold text-emerald-800">
              You're in! Check your inbox to confirm your subscription.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                disabled={isSubmitting}
                className="flex-1 rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-4 py-3 text-sm text-semantic-text-primary placeholder:text-semantic-text-primary/50 outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/30 focus:border-semantic-legacy-brand-cocoa/60 disabled:opacity-50 md:text-base"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed md:text-base whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : buttonText}
              </button>
            </div>
            {error && (
              <p className="text-sm text-rose-600" role="alert">
                {error}
              </p>
            )}
            <p className="text-xs text-semantic-text-primary/60">
              No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
