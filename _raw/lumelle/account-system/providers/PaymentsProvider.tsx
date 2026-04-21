import { createContext, useContext, useMemo } from 'react'
import { payments } from '@platform/payments'
import type { BeginPaymentInput, PaymentCapabilities, PaymentStart } from '@platform/payments/ports'

type PaymentsState = {
  capabilities: PaymentCapabilities
  beginPayment: (input: BeginPaymentInput) => Promise<PaymentStart>
}

const PaymentsCtx = createContext<PaymentsState | null>(null)

export const PaymentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const capabilities = useMemo(() => payments.payments.getCapabilities(), [])
  return (
    <PaymentsCtx.Provider
      value={{
        capabilities,
        beginPayment: (input) => payments.payments.beginPayment(input),
      }}
    >
      {children}
    </PaymentsCtx.Provider>
  )
}

export const usePayments = () => {
  const ctx = useContext(PaymentsCtx)
  if (!ctx) throw new Error('usePayments must be used within PaymentsProvider')
  return ctx
}
