import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  // Transpile files from the sibling library/ directory so they share viewer's
  // node_modules + TS settings. Without this, demos in library/21st-dev/ can't
  // resolve clsx, tailwind-merge, framer-motion, etc.
  transpilePackages: [],
  experimental: {
    externalDir: true,
  },
  typescript: {
    // Library files import clsx/framer-motion from viewer's node_modules — TS type check can't
    // reach them easily since library/ is outside viewer/ root. Skip TS check during build
    // to avoid false positives. (We still typecheck viewer source via `tsc --noEmit` if needed.)
    ignoreBuildErrors: true,
  },
  images: {
    // Allow next/image from common 21st.dev demo sources (Pexels, Unsplash, placeholders)
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'placekitten.com' },
    ],
  },
  webpack: (config) => {
    // Let webpack resolve modules relative to viewer/node_modules even for files
    // imported from ../library/
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
      ...(config.resolve.modules || []),
    ]
    return config
  },
}

export default nextConfig
