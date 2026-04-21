import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/components/CartProvider'
import CartDrawer from '@/components/CartDrawer'
import PreviewModalServer from '@/components/PreviewModalServer'

export const metadata: Metadata = {
  title: 'SISO Design System',
  description: 'Component bank viewer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <CartProvider>
          <div className="pl-64 min-h-screen">
            {children}
          </div>
          <PreviewModalServer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
