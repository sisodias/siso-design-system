# Map Section — Our Location

**Source:** `restaurant-app-solo / src/domains/customer-facing/landing/sections/map-section/`

**What it is:** "Our Location" landing section. Structure: small "VISIT US" pill eyebrow with pulsing dot, bold Playfair heading "Our Location" with pink-orange gradient underline, "Open until 11:00 PM" subtitle, then rounded-corner Google Maps embed with a floating "Open in Maps →" pill button overlaid top-left. Neighborhood labels and street names visible on the map.

**Why keeper:** Shaan said "cool, we can find a better one but it's mid" — flagged as reference for the pattern even if this particular impl will get refined later.

**Reusable bits:**
- The eyebrow-pill-with-pulsing-dot (reused motif from promo-section)
- The gradient-underlined heading via `SectionHeading`
- The map iframe wrapper with floating-pill CTA overlay

**Dependencies:** Google Maps iframe (or react-leaflet), `lucide-react` (MapPin, Clock, Navigation, MessageCircle, ParkingCircle, Phone), `zod`, `@storybook/react`, `vitest`

**Known broken imports (workspace-specific path aliases — not portable):**
- `@/domains/shared/section-tools`
- `@/domains/shared/components`

**Extraction note:** the "pulsing-dot eyebrow pill" appears in both promo-section and here — strong candidate for primitive extraction.
