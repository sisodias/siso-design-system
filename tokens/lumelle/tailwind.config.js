import fs from 'fs'
import path from 'path'
import plugin from 'tailwindcss/plugin'
import lineClamp from '@tailwindcss/line-clamp'
import typography from '@tailwindcss/typography'

const tokensPath = path.resolve('./src/theme/tokens.json')

const isHexColor = (value) =>
  typeof value === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)

const hexToRgbTriplet = (hex) => {
  if (!isHexColor(hex)) return null
  const normalized = hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join('')}` : hex
  const r = Number.parseInt(normalized.slice(1, 3), 16)
  const g = Number.parseInt(normalized.slice(3, 5), 16)
  const b = Number.parseInt(normalized.slice(5, 7), 16)
  if ([r, g, b].some((n) => Number.isNaN(n))) return null
  return `${r} ${g} ${b}`
}

const rgbVar = (cssVarName, fallbackTriplet) => `rgb(var(${cssVarName}, ${fallbackTriplet}) / <alpha-value>)`

const loadTokens = () => {
  try {
    return JSON.parse(fs.readFileSync(tokensPath, 'utf8'))
  } catch (err) {
    console.warn('[tailwind] design tokens missing; using defaults', err?.message)
    return null
  }
}

// Supports nested token objects (e.g. `base.neutral.0`) and dotted semantic keys stored as literal strings
// (e.g. `semantic: { "text.primary": "..." }` referenced via `{semantic.text.primary}`).
const getToken = (root, dotted) => {
  const nested = dotted.split('.').reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), root)
  if (nested !== undefined) return nested

  const [topKey, ...rest] = dotted.split('.')
  if (!topKey || rest.length < 2) return undefined

  const parent = root?.[topKey]
  if (!parent || typeof parent !== 'object') return undefined

  const dottedKey = rest.join('.')
  return Object.prototype.hasOwnProperty.call(parent, dottedKey) ? parent[dottedKey] : undefined
}

const resolveRef = (val, root) =>
  typeof val === 'string'
    ? val.replace(/\{([^}]+)\}/g, (_, ref) => {
        const value = getToken(root, ref.trim())
        if (value === undefined) throw new Error(`Unresolved token: {${ref}}`)
        return value
      })
    : val

const deepResolve = (obj, root) => {
  if (Array.isArray(obj)) return obj.map((v) => deepResolve(v, root))
  if (obj && typeof obj === 'object') return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepResolve(v, root)]))
  return resolveRef(obj, root)
}

const flatten = (obj, prefix = '') =>
  Object.entries(obj).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(acc, flatten(v, key))
    else acc[key] = v
    return acc
  }, {})

const dottedToNested = (flat) => {
  const nested = {}
  Object.entries(flat).forEach(([dotKey, value]) => {
    const parts = dotKey.split('.').map((p) => p.replace(/\./g, '-'))
    let node = nested
    parts.forEach((p, idx) => {
      if (idx === parts.length - 1) node[p] = value
      else node[p] = node[p] || {}
      node = node[p]
    })
  })
  return nested
}

const tokens = loadTokens()
const resolvedBase = tokens ? deepResolve(tokens.base || {}, tokens) : {}
const resolvedSemantic = tokens ? deepResolve(tokens.semantic || {}, { ...tokens, base: resolvedBase }) : {}
const semanticFlat = flatten(resolvedSemantic)
const semanticCssVarMap = Object.fromEntries(Object.entries(semanticFlat).map(([k, v]) => [`--${k.replace(/\./g, '-')}`, v]))
const semanticRgbVarMap = Object.fromEntries(
  Object.entries(semanticFlat).flatMap(([k, v]) => {
    const triplet = hexToRgbTriplet(v)
    if (!triplet) return []
    return [[`--${k.replace(/\./g, '-')}-rgb`, triplet]]
  })
)

const brandRgbVars = tokens
  ? Object.fromEntries(
      Object.entries({
        '--brand-peach-rgb': hexToRgbTriplet(resolvedBase.brandPrimary),
        '--brand-cocoa-rgb': hexToRgbTriplet(resolvedBase.brandSecondary),
        '--brand-blush-rgb': hexToRgbTriplet(resolvedBase.brandTertiary),
      }).filter(([, v]) => Boolean(v))
    )
  : {}

const semanticColors = dottedToNested(
  Object.fromEntries(
    Object.entries(semanticFlat).map(([k, v]) => {
      const varBase = `--${k.replace(/\./g, '-')}`
      const triplet = hexToRgbTriplet(v)
      return [k, triplet ? rgbVar(`${varBase}-rgb`, triplet) : `var(${varBase})`]
    })
  )
)

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
    '../components-library/packages/ui/src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          peach: rgbVar('--brand-peach-rgb', '251 199 178'),
          cocoa: rgbVar('--brand-cocoa-rgb', '85 54 42'),
          blush: rgbVar('--brand-blush-rgb', '253 212 220'),
          porcelain: rgbVar('--brand-porcelain-rgb', '247 239 232'),
        },
        siso: {
          black: 'var(--siso-black, #000000)',
          orange: 'rgb(var(--siso-orange-rgb, 255 167 38) / <alpha-value>)',
          red: 'rgb(var(--siso-red-rgb, 255 87 34) / <alpha-value>)',
          'bg-primary': 'rgb(var(--siso-bg-primary-rgb, 18 18 18) / <alpha-value>)',
          'bg-secondary': 'rgb(var(--siso-bg-secondary-rgb, 26 26 26) / <alpha-value>)',
          'bg-tertiary': 'rgb(var(--siso-bg-tertiary-rgb, 36 36 36) / <alpha-value>)',
          'bg-hover': 'rgb(var(--siso-bg-hover-rgb, 42 42 42) / <alpha-value>)',
          'bg-active': 'rgb(var(--siso-bg-active-rgb, 51 51 51) / <alpha-value>)',
          'text-primary': 'rgb(var(--siso-text-primary-rgb, 255 255 255) / <alpha-value>)',
          'text-secondary': 'rgb(var(--siso-text-secondary-rgb, 245 245 245) / <alpha-value>)',
          'text-muted': 'rgb(var(--siso-text-muted-rgb, 184 184 184) / <alpha-value>)',
          'text-disabled': 'rgb(var(--siso-text-disabled-rgb, 117 117 117) / <alpha-value>)',
          // Alias used throughout the imported SISO settings screens.
          'text-bold': 'rgb(var(--siso-text-primary-rgb, 255 255 255) / <alpha-value>)',
          border: 'rgb(var(--siso-border-primary-rgb, 42 42 42) / <alpha-value>)',
          'border-secondary': 'rgb(var(--siso-border-secondary-rgb, 58 58 58) / <alpha-value>)',
          'border-hover': 'rgb(var(--siso-border-hover-rgb, 74 74 74) / <alpha-value>)',
          'border-active': 'rgb(var(--siso-border-active-rgb, 90 90 90) / <alpha-value>)',
          success: 'var(--siso-success, #4CAF50)',
          warning: 'var(--siso-warning, #FF9800)',
          error: 'var(--siso-error, #F44336)',
          info: 'var(--siso-info, #2196F3)',
        },
        semantic: semanticColors,
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px rgb(var(--brand-peach-rgb, 251 199 178) / 0.35)',
        siso: 'var(--siso-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3))',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.semantic.text.primary'),
            a: { color: theme('colors.semantic.text.primary'), textDecoration: 'underline' },
            strong: { color: theme('colors.semantic.text.primary') },
            h1: { color: theme('colors.semantic.text.primary'), fontFamily: theme('fontFamily.heading'), fontWeight: '600' },
            h2: { color: theme('colors.semantic.text.primary'), fontFamily: theme('fontFamily.heading'), fontWeight: '600' },
            h3: { color: theme('colors.semantic.text.primary'), fontFamily: theme('fontFamily.heading'), fontWeight: '600' },
            li: { marginTop: '0.35em', marginBottom: '0.35em' },
            'ul > li::marker': { color: theme('colors.semantic.text.primary') },
            blockquote: { borderLeftColor: theme('colors.brand.blush') },
          },
        },
      }),
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      if (!tokens) return
      addBase({
        ':root': {
          ...semanticCssVarMap,
          ...semanticRgbVarMap,
          ...brandRgbVars,
        },
      })
    }),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-primary': {
          '--tw-text-opacity': '1',
          color: 'rgb(var(--text-primary-rgb, 85 54 42) / var(--tw-text-opacity))',
        },
        '.text-muted': { color: 'var(--text-muted)' },
        '.text-inverse': {
          '--tw-text-opacity': '1',
          color: 'rgb(var(--text-inverse-rgb, 255 255 255) / var(--tw-text-opacity))',
        },
        '.bg-canvas': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgb(var(--bg-canvas-rgb, 255 255 255) / var(--tw-bg-opacity))',
        },
        '.bg-surface': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgb(var(--bg-surface-rgb, 255 255 255) / var(--tw-bg-opacity))',
        },
        '.bg-subtle': { backgroundColor: 'var(--bg-subtle)' },
        '.bg-hero-gradient': { backgroundImage: 'var(--bg-heroGradient)' },
        '.border-subtle': { borderColor: 'var(--border-subtle)' },
        '.bg-cta': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgb(var(--accent-cta-rgb, 251 199 178) / var(--tw-bg-opacity))',
        },
        '.text-cta': {
          '--tw-text-opacity': '1',
          color: 'rgb(var(--accent-ctaText-rgb, 85 54 42) / var(--tw-text-opacity))',
        },
        '.bg-badge': {
          '--tw-bg-opacity': '1',
          backgroundColor: 'rgb(var(--accent-badge-rgb, 251 199 178) / var(--tw-bg-opacity))',
        },
        '.text-success': {
          '--tw-text-opacity': '1',
          color: 'rgb(var(--state-success-rgb, 15 157 88) / var(--tw-text-opacity))',
        },
        '.text-warning': {
          '--tw-text-opacity': '1',
          color: 'rgb(var(--state-warning-rgb, 250 204 21) / var(--tw-text-opacity))',
        },
        '.text-danger': {
          '--tw-text-opacity': '1',
          color: 'rgb(var(--state-danger-rgb, 225 111 92) / var(--tw-text-opacity))',
        },
      })
    }),
    lineClamp,
    typography,
  ],
}
