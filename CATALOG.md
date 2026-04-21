# Catalog — SISO Design System

Usage-first index. "I'm building X — which components should I use?"

## Platform scope

**Everything under `_raw/` is mobile-first.** All SISO-harvested components (Lumelle + restaurant-app-solo) were curated on a mobile viewport. Use on mobile surfaces unless a component explicitly documents desktop variants inside its own file.

**`_external/21st-dev/` is mixed platform** — desktop dashboards, mobile cards, responsive sections. Check per-component context.

When copying entries from this catalog into an agent prompt, include the platform scope so the agent knows not to force these into a desktop layout.

---

## Browse by Use Case Archetype

### Marketing landing pages (mobile)
- `hero-composition` (Lumelle) — full-bleed product hero w/ trust pill + CTA + star rating + mobile carousel
- `feature-callouts` (Lumelle) — dual-variant: numbered reasons cards OR embedded video + chip row
- `instagram-section` (restaurant-app-solo) — Instagram follow grid with 2x2 food photos + gradient CTA pill
- `email-capture-card` (Lumelle) — "Get 10% off" mixed-typography card with gift icon and inline input
- `spin-wheel` (Lumelle) — welcome-deal reward spinner with guaranteed fallback code
- `about-us-page` (restaurant-app-solo) — 10-section About page with hero, timeline, team glass carousel, FAQ pills

### E-commerce PDP (mobile)
- `product-page-hero` (Lumelle) — full PDP carousel + price block + Add to Cart + Buy Now + trust chips
- `product-spotlight` (Lumelle) — mobile one-viewport product card with discount pill + star rating
- `bundle-cards` (Lumelle) — product card with price pill + feature badges + dual CTA
- `pdp-bottom-cta` (Lumelle) — "READY WHEN YOU ARE" conversion card + scroll-aware sticky mobile bar
- `details-accordion` (Lumelle) — clean spec accordion for materials, care, fit

### Restaurant / food (mobile)
- `menu-page` (restaurant-app-solo) — dense food cards with nutrition chip rows, dietary corner badges, allergen pills
- `top-nav` (restaurant-app-solo) — frosted-glass floating nav, 3 variants (pills / underline segments / more-sheet)
- `mobile-drawer` (restaurant-app-solo) — image-paneled full-screen side drawer; dark nav panel + food photography
- `restaurant-footer` (restaurant-app-solo) — Grab + WhatsApp action cards + address block + Instagram gradient card
- `map-section` (restaurant-app-solo) — Google Maps embed with pulsing-dot eyebrow + floating CTA pill
- `promo-section` (restaurant-app-solo) — Limited Time pulsing pill + promo hero + scrolling card carousel

### Shop utilities (mobile)
- `menu-cart-drawer` (Lumelle) — Menu/Cart tab toggle drawer with products rail, cart qty controls, checkout handoff
- `account-system` (Lumelle) — full client account vertical: orders, addresses, payments, profile (Clerk + Stripe)
- `blog-system` (Lumelle) — complete blog vertical: index, post, newsletter signup, reading progress (Supabase-backed)
- `faq-section` (Lumelle) — FAQ accordion with live search + nested review-card testimonials

### Social proof / reviews (mobile)
- `reviews-page` (restaurant-app-solo) — full reviews page + 10 landing teaser variants (stagger, masonry, glass, etc.)
- `faq-section` (Lumelle) — FAQ with embedded review-accordion (social proof at point of engagement)
- `tiktok-carousel` (Lumelle) — creator video scroller, platform-agnostic (TikTok / Reels / Shorts)

### Conversion mechanics (mobile)
- `footer` (Lumelle) — centered brand footer with newsletter form, social icons, back-to-top
- `email-capture-card` (Lumelle) — "Get 10% off" mixed-typography inline email capture
- `spin-wheel` (Lumelle) — gamified welcome-deal spinner
- `pdp-bottom-cta` (Lumelle) — bottom CTA card + scroll-aware sticky mobile buy bar

### Charts / data viz (21st.dev)
- All 7 chart components from 21st.dev: `bar-chart`, `radial-chart`, `donut-chart`, `analytics-card`, `anomaly-heatmap`, `stacked-diverging-bar`, `screen-time-card`
- `radial-orbital-timeline` (21st.dev) — animated radial orbital timeline with expandable node cards
- `statistics-card` / `statistics-card-13` (21st.dev) — animated bar chart stats sections

### Atoms / primitives candidates
- Pulsing-Dot Pill (extract from `promo-section`) — urgency/live-status indicator using `animate-ping` sibling-dot
- StarRating (Lumelle) — SVG half-star rating with glow drop-shadow; in hero-composition + product-spotlight
- Nutrition chip row (extract from `menu-page`) — emoji + macro data in a horizontal scroll row
- SectionHeading (Lumelle) — eyebrow pill + serif heading + subtitle; in hero-composition
- AnnouncementBar (Lumelle) — dismissible rotating promo strip; in hero-composition
- ScrollArea (21st.dev) — Radix ScrollArea wrapper

### Navigation / overlays
- `circular-navigation` (21st.dev) — full-screen circular radial navigation menu with animated open/close
- `notifications-menu` (21st.dev) — tabbed notifications panel with avatar items and action buttons
- `dropdown-menu` / `sean-dropdown-menu` (21st.dev) — full-featured dropdown with submenu, checkbox/radio items
- `search-bar` (21st.dev) — animated search bar with gooey particle effects and autocomplete

### Forms / inputs
- `futuristic-file-uploader` (21st.dev) — cyberpunk-themed drag-and-drop uploader with progress + preview
- `sean-button` (21st.dev) — 9-variant button system with CVA, sizes, shapes, icon/link modes
- `sean-badge` (21st.dev) — multi-variant badge: default/light/outline/ghost + destructive
- `resizable-table` (21st.dev) — sortable, paginated data table with CSV/JSON export and dark mode

### Cards / UI containers
- `glass-card` (21st.dev) — premium 3D glass-morphism card with hover tilt and animated social icons
- `card-8` (21st.dev) — animated alert card with spring reveals and dismiss
- `freelancer-stats-card` (21st.dev) — earnings + ranking dashboard card with animated availability bar
- `crypto-stats-card` (21st.dev) — market cap card with sparkline and price list
- `prediction-market-card` (21st.dev) — live betting card with countdown and YES/NO voting bars
- `security-card` (21st.dev) — animated KYC/identity card with SVG face animation and dark/light mode
- `sean-card` (21st.dev) — enhanced card with context-based variants for header/content/table/footer
- `sean-avatar` (21st.dev) — avatar with online/offline/busy/away indicator dots
- `social-post-card` (21st.dev) — social feed post card with author header, link preview, and engagement footer
- `messaging-conversation` (21st.dev) — chat UI with header, avatars, status badges, hover-reveal actions
- `agent-plan` (21st.dev) — animated task planner with subtask hierarchy and MCP tool badges
- `sleep-tracker-card` (21st.dev) — sleep stage card with animated bar graph (Awake/REM/Core/Deep)

### Animations / decorative
- `countdown-number` (21st.dev) — animated countdown timer with smooth number transitions
- `loader-15` (21st.dev) — neon gradient circular SVG loader
- `siri-orb` (21st.dev) — Apple Siri-style animated orb with CSS conic gradients
- `orbiting-skills` (21st.dev) — orbital skills showcase with icons rotating in concentric rings
- `ia-siri-chat` (21st.dev) — AI voice assistant interface with waveform visualizer and ambient particles
- `pixel-grid` (21st.dev) — decorative pixel grid background
- `visualize-booking` (21st.dev) — booking visualization component
- `countdown-number` (21st.dev) — animated number countdown with framer-motion

### Landing / page sections
- `award` (21st.dev) — multi-variant awards: stamp, certificate, badge, sticker, medal, ID card
- `gradient-selector-card` (21st.dev) — funding tier selector with orbital progress circles
- `to-do-card` (21st.dev) — animated task card
- `calendar` / `visualize-booking` (21st.dev) — booking/calendar visualization
- `scroll-area` (21st.dev) — Radix ScrollArea primitive

---

## Full Component Table

| Component | Source | Platform | Tags | Works for | Don't use when | Location | Status |
|---|---|---|---|---|---|---|
| hero-composition | Lumelle | Mobile | hero, marketing, mobile, product-focused | Product launch pages · DTC landing · single-product hero | Multi-product hero · dashboard · B2B | `_raw/lumelle/hero-composition/` | raw |
| feature-callouts | Lumelle | Mobile | section, dual-variant, video, numbered | PDP feature explanations · creator testimonials · brand story sections | Generic marketing pages · non-visual dense docs | `_raw/lumelle/feature-callouts/` | raw |
| instagram-section | restaurant-app-solo | Mobile | instagram, social, photo-grid, cta | Restaurant landing · lifestyle brands · food DTC | B2B · utility apps · dark-mode-only brands | `_raw/restaurant-app-solo/instagram-section/` | raw |
| email-capture-card | Lumelle | Mobile | email, capture, conversion, cta | Welcome mats · exit-intent · blog sidebars · footer | Full-page layouts · dashboard · mobile navs | `_raw/lumelle/email-capture-card/` | raw |
| spin-wheel | Lumelle | Mobile | gamification, spinner, reward, cta | Welcome screens · first-visit modals · post-signup rewards | Frequent users (diminishing returns) · slow connections | `_raw/lumelle/spin-wheel/` | raw |
| about-us-page | restaurant-app-solo | Mobile | about, page, multi-section | Restaurant · hospitality · lifestyle brands · agency portfolios | SaaS dashboards · e-commerce PDPs · blogs | `_raw/restaurant-app-solo/about-us-page/` | raw |
| product-page-hero | Lumelle | Mobile | pdp, hero, carousel, ecommerce | Product detail pages · DTC e-commerce | Blog posts · landing pages · settings pages | `_raw/lumelle/product-page-hero/` | raw |
| product-spotlight | Lumelle | Mobile | product, card, mobile, ecommerce | Mobile product teasers · homepage product rows · shop blocks | Desktop-heavy layouts · non-commerce · dense lists | `_raw/lumelle/product-spotlight/` | raw |
| bundle-cards | Lumelle | Mobile | product-card, bundles, cta, ecommerce | Product sets · bundles · cross-sell rows | Single SKUs · utility pages · non-commerce | `_raw/lumelle/bundle-cards/` | raw |
| pdp-bottom-cta | Lumelle | Mobile | pdp, conversion, sticky, cta | PDP bottom · checkout pages · mobile product flows | Landing pages · blog · settings · non-commerce | `_raw/lumelle/pdp-bottom-cta/` | raw |
| details-accordion | Lumelle | Mobile | accordion, spec, technical, collapsible | Materials · care instructions · tech specs · FAQs | Complex nested data · mobile navs | `_raw/lumelle/details-accordion/` | raw |
| menu-page | restaurant-app-solo | Mobile | menu, restaurant, food, nutrition, dense | Restaurant menus · food delivery · hospitality | B2B · e-commerce · dashboards | `_raw/restaurant-app-solo/menu-page/` | raw |
| top-nav | restaurant-app-solo | Mobile | nav, floating, glass, restaurant | Restaurant landing · hospitality · image-forward sites | Dense dashboards · admin panels · utility navs | `_raw/restaurant-app-solo/top-nav/` | raw |
| mobile-drawer | restaurant-app-solo | Mobile | drawer, sidebar, mobile, image-forward | Restaurant apps · lifestyle brands · decorative navs | Dense dashboard nav · text-heavy utility navs | `_raw/restaurant-app-solo/mobile-drawer/` | raw |
| restaurant-footer | restaurant-app-solo | Mobile | footer, restaurant, action-cards, grab, whatsapp | Restaurant landing · delivery brands · hospitality | E-commerce footers · B2B · SaaS | `_raw/restaurant-app-solo/restaurant-footer/` | raw |
| map-section | restaurant-app-solo | Mobile | map, location, restaurant, contact | Restaurant · retail · any location page | Non-location pages · embedded data dashboards | `_raw/restaurant-app-solo/map-section/` | raw |
| promo-section | restaurant-app-solo | Mobile | promo, urgency, pulsing-dot, limited-time | Flash sales · live events · limited-time offers | Neutral content · permanent features | `_raw/restaurant-app-solo/promo-section/` | raw |
| menu-cart-drawer | Lumelle | Mobile | drawer, cart, ecommerce, navigation, tab | Shopify-style stores · cart-driven apps with tab nav | Dashboard sidebar · admin nav · non-commerce | `_raw/lumelle/menu-cart-drawer/` | raw |
| account-system | Lumelle | Mobile | account, auth, orders, payments, ecommerce | E-commerce account areas · SaaS settings · membership portals | Public pages · read-only informational sites | `_raw/lumelle/account-system/` | raw |
| blog-system | Lumelle | Mobile | blog, content, cms, supabase | E-commerce blogs · content sites · editorial brands | Dashboards · admin panels · single-purpose apps | `_raw/lumelle/blog-system/` | raw |
| faq-section | Lumelle | Mobile | faq, accordion, reviews, search | Product pages · landing pages · help centers | Dense technical docs · mobile-first minimal | `_raw/lumelle/faq-section/` | raw |
| reviews-page | restaurant-app-solo | Mobile | reviews, social-proof, grid, landing | Restaurant landing · product pages · hospitality | B2B SaaS · utility dashboards · mobile-only | `_raw/restaurant-app-solo/reviews-page/` | raw |
| tiktok-carousel | Lumelle | Mobile | tiktok, video, carousel, creator, social | Creator-focused landing · DTC brands · lifestyle | B2B · data-heavy dashboards · non-visual products | `_raw/lumelle/tiktok-carousel/` | raw |
| footer | Lumelle | Mobile | footer, newsletter, social, brand | All marketing pages · e-commerce · landing pages | Full-screen apps · mobile drawers · settings pages | `_raw/lumelle/footer/` | raw |
| pulsing-dot-pill | (extractable from `promo-section`) | Mobile | primitive, urgency, live-state, status | Flash sales · live events · "new" indicators · "open now" | Neutral labels · permanent badges · large lists | `_raw/restaurant-app-solo/promo-section/` | raw |
| star-rating | (Lumelle, inside hero-composition + product-spotlight) | Mobile | primitive, rating, stars, ecommerce | PDPs · product cards · review snippets · social proof | Full-page layouts · non-visual contexts | `_raw/lumelle/hero-composition/StarRating.tsx` | raw |
| section-heading | (Lumelle, inside hero-composition) | Mobile | primitive, heading, section, typography | Any section header · marketing pages · blog | Dashboard widgets · compact cards · nav elements | `_raw/lumelle/hero-composition/SectionHeading.tsx` | raw |
| nutrition-chip-row | (extractable from `menu-page`) | Mobile | primitive, food, nutrition, chips, dense | Restaurant menus · food delivery · health apps | E-commerce PDPs · non-food contexts | `_raw/restaurant-app-solo/menu-page/` | raw |
| **21st.dev — Charts** | 21st.dev | Mixed | chart, bar, radial, donut, analytics, heatmap | Dashboards · analytics pages · data-heavy views | Landing pages · marketing · mobile-only | `_external/21st-dev/{bar-chart,radial-chart,donut-chart,analytics-card,anomaly-heatmap,stacked-diverging-bar,screen-time-card,radial-orbital-timeline,statistics-card}/` | raw |
| **21st.dev — Forms** | 21st.dev | Mixed | form, input, upload, select, button, badge | Dashboards · settings · admin panels · auth flows | Landing pages · marketing · read-only views | `_external/21st-dev/{futuristic-file-uploader,sean-button,sean-badge,sean-dropdown-menu,search-bar,resizable-table}/` | raw |
| **21st.dev — Navigation** | 21st.dev | Mixed | nav, overlay, dropdown, menu, circular, notifications | Dashboards · apps · settings · notification centers | Landing pages · marketing · mobile-first | `_external/21st-dev/{circular-navigation,notifications-menu,dropdown-menu,search-bar}/` | raw |
| **21st.dev — Cards / UI** | 21st.dev | Mixed | card, glass, animated, social, messaging, crypto, security, sleep | Dashboards · analytics · social apps · profile views | Landing pages · simple marketing | `_external/21st-dev/{glass-card,card-8,freelancer-stats-card,crypto-stats-card,prediction-market-card,security-card,sean-card,sean-avatar,social-post-card,messaging-conversation,agent-plan,sleep-tracker-card,award,gradient-selector-card,to-do-card,countdown-number,analytics-card,animated-card,animated-card-chart,animated-card-diagram}/` | raw |
| **21st.dev — Animations / Decorative** | 21st.dev | Mixed | animation, loader, orb, particle, decorative | Splash screens · empty states · hero accents · AI interfaces | Functional UIs · data pages · text-heavy | `_external/21st-dev/{loader-15,siri-orb,orbiting-skills,ia-siri-chat,pixel-grid,countdown-number}/` | raw |
| **21st.dev — Primitives** | 21st.dev | Mixed | primitive, badge, avatar, separator, scroll-area, button | Anywhere atoms needed | Composite pages that already have these | `_external/21st-dev/{badge,avatar,separator,scroll-area,button,card}/` | raw |

---

## How to Add a New Entry

### When harvesting a new component
1. Copy the component folder into `_raw/{source}/`
2. Add a row to this table: component name, source, 2-5 lowercase-dash tags, use-case, anti-pattern, location, status=`raw`
3. Add it to the relevant archetype section above
4. Create or update `README.md` inside the component folder (description, deps, known broken imports)

### When promoting a component from `_raw/` to `primitives/` / `composites/` / `systems/`
1. Copy files from `_raw/{source}/{component}/` to `primitives/{component}/` (atoms) or `composites/{component}/` (multi-component patterns) or `systems/{component}/` (full verticals)
2. Add a second row to this table with the new location and status=`promoted`
3. Keep the `_raw/` row for provenance; mark the promoted row as canonical

### Tag conventions
- 2-5 tags per component, lowercase, dash-separated
- Source tag first if ambiguous: `lumelle`, `restaurant-app-solo`, `21st-dev`
- Use established category tags: `hero`, `pdp`, `chart`, `card`, `form`, `nav`, `primitive`, `animated`
- Application context: `ecommerce`, `restaurant`, `marketing`, `dashboard`
- Pattern: `cta`, `drawer`, `accordion`, `carousel`, `sticky`, `glass`

### Provenance
- Every component retains its `_raw/` provenance even after promotion
- See `PROVENANCE.md` for full source attribution chain
