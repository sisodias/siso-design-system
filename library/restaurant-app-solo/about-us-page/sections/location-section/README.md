# Location Section

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

The shared schema (`types/schema.ts`) defines:

- `pillText?: string`
- `title: string`
- `subtitle?: string`
- `address: string`
- `map?: { embedUrl?: string; link?: string }`
- `contacts?: LocationContactMethod[]`
- `hoursSummary?: string`
- `operatingHours?: LocationOperatingHour[]`
- `directions?: string`
- `parkingInfo?: string`
- `notes?: string[]`

### Variants
- **primary — Immersive Map + Details**
  Two-column layout with Google Maps embed, contact quick actions, and arrival notes.
- **template-2 — Concierge Column Layout**
  Editorial split layout featuring a sticky map card beside a concierge column (address, contacts, hours).
- **template-3 — Location Placeholder**
  Empty placeholder variant signalling a future 21st.dev drop-in.

Utility helpers for contact links/icons live in `shared/utils/contact.ts`.
