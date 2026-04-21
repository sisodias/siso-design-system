import type { Metadata } from 'next'
import './globals.css'

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
        {children}
      </body>
    </html>
  )
}
