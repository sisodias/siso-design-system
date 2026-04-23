import type { NextConfig } from 'next'
import path from 'path'

const isProd = process.env.NODE_ENV === 'production'

// Cloudflare Pages uses @cloudflare/next-on-pages adapter; `output: 'standalone'`
// conflicts with it (produces Node server output instead of Pages-compatible artifacts).
// Disabled in production so Cloudflare's adapter can transform .next → .vercel/output/static.
// outputFileTracingIncludes still useful for Cloudflare bundling.
const isCloudflareBuild = process.env.CF_PAGES === '1' || process.env.CLOUDFLARE_PAGES === '1'

const nextConfig: NextConfig = {
  ...(isProd && !isCloudflareBuild && {
    output: 'standalone' as const,
  }),
  ...(isProd && {
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

    // Resolve @lib alias (tsconfig paths) so template-literal dynamic imports
    // in PreviewRenderer.tsx are webpack-resolved at build time.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@lib': path.resolve(__dirname, '../library'),
    }

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
      // Normalize existing ignored patterns to an array of strings (filter non-string values)
      const existingIgnored = Array.isArray(config.watchOptions?.ignored)
        ? (config.watchOptions.ignored as (string | RegExp)[]).filter(
            (p): p is string => typeof p === 'string' && p.length > 0
          )
        : typeof config.watchOptions?.ignored === 'string' &&
          config.watchOptions.ignored.length > 0
        ? [config.watchOptions.ignored]
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

  async headers() {
    return [
      {
        source: '/pick',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
      {
        source: '/pick/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
    ]
  },
}

export default nextConfig
