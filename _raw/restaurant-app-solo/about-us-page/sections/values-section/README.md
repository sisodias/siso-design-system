# Values Section

All variants rely on the shared Zod contract in `types/schema.ts`:

- `pillText?: string`
- `title: string`
- `subtitle?: string`
- `description?: string`
- `values: ValuesItem[]` (id, icon, title, description)

### Variants
- **primary — Radiant Values Grid**  
  Glassmorphism grid that pairs iconography with concise copy. Intended for 4–8 principles.
- **template-2 — Editorial Spotlight**  
  Magazine-inspired split layout with a hero value card and supporting list. Great when one pillar needs emphasis and there is longer descriptive copy.
- **template-3 — Values Placeholder**  
  No-op variant. It intentionally renders placeholder messaging so we remember to swap in a bespoke 21st.dev component later.

Shared utilities (icon mapping, etc.) live under `shared/`. Update `data/mock.ts` if the contract evolves so stories and tests stay truthful.
