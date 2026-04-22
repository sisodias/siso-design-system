import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
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
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <CartProvider>
          {/* Children decide their own layout. Home/detail pages wrap themselves in pl-64;
              preview routes cover the whole viewport via their own layout. */}
          {children}
          <PreviewModalServer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
