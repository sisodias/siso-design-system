import { useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'

const DevCheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onConfirm = async () => {
    if (!stripe || !elements || submitting) return
    setSubmitting(true)
    setMessage(null)
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account/payments?payment=success`,
        },
        redirect: 'if_required',
      })

      if (result.error) {
        setMessage(result.error.message ?? 'Payment failed.')
        return
      }

      setMessage('Payment submitted.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Payment failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <PaymentElement />
      <button
        type="button"
        disabled={!stripe || !elements || submitting}
        onClick={() => void onConfirm()}
        className="inline-flex items-center justify-center rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {submitting ? 'Confirming…' : 'Confirm payment'}
      </button>
      {message ? <p className="text-xs text-semantic-text-primary/70">{message}</p> : null}
      <p className="text-[11px] text-semantic-text-primary/50">
        Dev-only: this uses Stripe Elements. Do not expose this flow in production until you have the full UX and confirmation handling.
      </p>
    </div>
  )
}

export const StripeDevEmbeddedPaymentPanel = ({
  publishableKey,
  clientSecret,
}: {
  publishableKey: string
  clientSecret: string
}) => {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey])

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: { theme: 'stripe' },
    }),
    [clientSecret]
  )

  return (
    <div className="mt-6 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-white p-6">
      <p className="text-sm font-semibold text-semantic-text-primary">Embedded payment (dev)</p>
      <p className="mt-2 text-xs text-semantic-text-primary/60">
        Stripe client secret created. Complete the form below to confirm the payment.
      </p>
      <Elements stripe={stripePromise} options={options}>
        <DevCheckoutForm />
      </Elements>
    </div>
  )
}

