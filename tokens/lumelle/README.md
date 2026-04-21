# Lumelle Design Tokens

Source: `luminelle-partnership/src/theme/` (private conductor workspace)

## Token Architecture

```
tokens.json (base palette)
  └── base.xxx references
        ↓ (build-time resolve in tailwind.config.js)
  CSS custom properties on :root
        ↓ (via Tailwind config)
  Tailwind utility classes (e.g. .bg-canvas, .text-primary)
```

**Build pipeline** (in `tailwind.config.js`):
1. Load `tokens.json`
2. Resolve `{base.xxx}` references recursively via `deepResolve`
3. Flatten resolved semantic tokens and convert to CSS vars: `text.primary` → `--text-primary`
4. Extract RGB triplets for hex colors (enables `rgb(var(...)/<alpha-value>)` composition)
5. Generate brand RGB vars: `--brand-peach-rgb`, `--brand-cocoa-rgb`, `--brand-blush-rgb`
6. Write all vars to `:root` via `addBase`
7. Register semantic tokens in `theme.colors.semantic` and as utility classes via `addUtilities`

Note: `scripts/validate-design-tokens.mjs` exists in source but was not copied here.

---

## Key Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| brandPrimary | `#FBC7B2` | Peach — primary brand, CTA backgrounds |
| brandSecondary | `#55362A` | Cocoa — text, headings |
| brandTertiary | `#FDD4DC` | Blush — subtle backgrounds |
| neutral.50 | `#FDF8F6` | Near-white warm tint |
| accent.promo | `#E0724A` | Coral-orange — highlights, promo |
| accent.info | `#8B5CF6` | Purple — informational accent |
| bg.heroGradient | linear-gradient | `#F9D8D0` → `#FDE7DA` |

---

## Typography

| Role | Font | Usage |
|------|------|-------|
| Headings | Playfair Display (serif) | H1–H6, editorial titles |
| Body | Inter (sans-serif) | All body text, UI labels |

Font family config in `tailwind.config.js`:
```js
fontFamily: {
  heading: ['"Playfair Display"', 'serif'],
  body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
}
```

---

## Generated CSS Custom Properties

Resolved at build time and injected onto `:root`:

```css
--text-primary: #55362A;
--text-muted: color-mix(in srgb, #55362A 70%, white);
--text-inverse: #FFFFFF;
--bg-canvas: #FFFFFF;
--bg-surface: #FFFFFF;
--bg-subtle: color-mix(in srgb, #FDD4DC 25%, white);
--bg-heroGradient: linear-gradient(135deg, #F9D8D0 0%, #FCEBE3 45%, #FDE7DA 100%);
--border-subtle: color-mix(in srgb, #FDD4DC 65%, white);
--accent-cta: #FBC7B2;
--accent-ctaText: #55362A;
--accent-badge: #FBC7B2;
--promo-highlight: #E0724A;
--state-success: #0F9D58;
--state-warning: #FACC15;
--state-danger: #E16F5C;

--brand-peach-rgb: 251 199 178;
--brand-cocoa-rgb: 85 54 42;
--brand-blush-rgb: 253 212 220;
```

Plus RGB variants for every semantic token (e.g. `--text-primary-rgb: 85 54 42`) used for `rgb(var(...)/<alpha-value>)` composition.

---

## Generated Tailwind Utility Classes

Registered via `addUtilities` in `tailwind.config.js`:

**Text utilities:**
- `.text-primary` — brand secondary (cocoa)
- `.text-muted` — 70% opacity cocoa
- `.text-inverse` — white
- `.text-cta` — cocoa on peach bg
- `.text-success` — green
- `.text-warning` — yellow
- `.text-danger` — coral

**Background utilities:**
- `.bg-canvas` — white
- `.bg-surface` — white (alias of canvas)
- `.bg-subtle` — 25% blush tint
- `.bg-hero-gradient` — warm peach gradient
- `.bg-cta` — peach
- `.bg-badge` — peach

**Border utilities:**
- `.border-subtle` — 65% blush border

**Brand palette utilities** (via `theme.extend.colors.brand`):
- `.bg-brand-peach`, `.bg-brand-cocoa`, `.bg-brand-blush`, `.bg-brand-porcelain`
- `.text-brand-peach`, etc.

**Shadow utilities:**
- `.shadow-soft` — warm peach glow (`0 20px 60px rgb(var(--brand-peach-rgb) / 0.35)`)
- `.shadow-siso` — SISO dark shadow

---

## Radius Tokens

Defined in `tokens.json` but not yet wired into Tailwind config:

```json
"radius": {
  "sm": "8px",
  "md": "16px",
  "lg": "24px",
  "pill": "999px"
}
```

---

## Files in this Directory

| File | Source | Notes |
|------|--------|-------|
| `tokens.json` | `src/theme/tokens.json` | Two-layer token source |
| `tailwind.config.js` | `tailwind.config.js` | Build pipeline + Tailwind config |
| `index.css` | `src/index.css` | Entry CSS; `@import`s SISO theme files |
| `accessibility-fixes.css` | `src/theme/accessibility-fixes.css` | WCAG AA fixes, focus states, dark mode |

Additional source files NOT copied (cross-repo imports in index.css, large generated output):
- `src/theme/siso-color-system.css/color-system.css` — SISO color system (separate repo)
- `src/theme/siso-tw-animate.css` — SISO animation utilities
- `docs/05-planning/.../generated.css` — pre-generated resolved CSS (build artifact)
