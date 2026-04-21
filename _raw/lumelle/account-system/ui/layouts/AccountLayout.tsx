import type { ReactNode } from 'react'
import { GlobalHeader } from '@ui/components/GlobalHeader'
import { GlobalFooter } from '@ui/components/GlobalFooter'

type Props = {
  children: ReactNode
  title?: string
  subtitle?: string
  sidebar?: ReactNode
}

const AccountLayout = ({ children, title = 'Your account', subtitle, sidebar }: Props) => {
  return (
    <div className="min-h-screen bg-brand-porcelain text-semantic-text-primary">
      <GlobalHeader promoMessages={[{ label: 'Free returns within 30 days' }, { label: 'Buy 2, save 10%' }]} />
      <main className="mx-auto flex max-w-6xl gap-8 px-4 pb-16 pt-10 md:px-6">
        {sidebar && (
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="sticky top-4 space-y-4 rounded-2xl bg-white p-4 shadow-soft">
              {sidebar}
            </div>
          </aside>
        )}
        <section className="flex-1 space-y-6">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/60">Account</p>
            <h1 className="font-heading text-3xl text-semantic-text-primary">{title}</h1>
            {subtitle ? <p className="text-semantic-text-primary/70">{subtitle}</p> : null}
          </header>
          <div className="space-y-6">{children}</div>
        </section>
      </main>
      <GlobalFooter supportEmail="support@lumelle.com" />
    </div>
  )
}

export default AccountLayout
