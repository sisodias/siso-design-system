import type { NextConfig } from 'next'
import path from 'path'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  // F12: standalone output + outputFileTracingRoot are build-time concerns.
  // In dev mode they cause unnecessary work and expand the module graph /
  // trace set. Gate to production only.
  ...(isProd && {
    output: 'standalone' as const,
    outputFileTracingRoot: path.resolve(__dirname, '..'),
    outputFileTracingIncludes: {
      '/**': ['../library/manifest.json', '../library/**/registry-item.json'],
    },
  }),
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
  webpack: (config, { dev, isServer }) => {
    // Let webpack resolve modules relative to viewer/node_modules even for files
    // imported from ../library/
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
      ...(config.resolve.modules || []),
    ]

    // better-sqlite3 is a native module — must not be bundled by webpack
    if (isServer) {
      config.externals = [...(config.externals ?? []), 'better-sqlite3']
    }

    // F2: In dev, chokidar by default watches everything reachable from the
    // module graph. With `externalDir: true` + the old template-literal dynamic
    // import, that meant ~14k .tsx files under ../library/ — pinning the dev
    // server at 166% CPU even at idle. The library is a scraped artifact; its
    // source files never change mid-session, only `manifest.json` does. Narrow
    // chokidar's scope so HMR fires only on viewer/ + library/manifest.json.
    if (dev) {
      const libraryRoot = path.resolve(__dirname, '../library')
      const existingIgnored = Array.isArray(config.watchOptions?.ignored)
        ? config.watchOptions.ignored
        : config.watchOptions?.ignored
        ? [config.watchOptions.ignored as string]
        : []
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: [
          ...existingIgnored,
          '**/node_modules/**',
          '**/.next/**',
          `${libraryRoot}/**/*.tsx`,
          `${libraryRoot}/**/*.ts`,
          `${libraryRoot}/**/*.jsx`,
          `${libraryRoot}/**/*.js`,
          `${libraryRoot}/**/*.json`,
          `${libraryRoot}/**/*.md`,
          `${libraryRoot}/**/*.png`,
          `${libraryRoot}/**/*.css`,
          // keep watching manifest.json so regenerations trigger HMR
          `!${libraryRoot}/manifest.json`,
        ],
      }
    }

    return config
  },
}

export default nextConfig
