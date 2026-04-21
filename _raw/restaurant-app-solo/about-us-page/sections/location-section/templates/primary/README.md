# Location Template · Primary

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

- **Best for**: Single-location venues that need map, directions, contacts, and arrival notes in one place.
- **Layout**: Two-column grid (map on left, detail stack on right) with SectionHeading above.
- **Content fields**: Uses the full contract including `map`, `contacts`, `operatingHours`, `directions`, `parkingInfo`, and `notes`.
- **Notes**: Map iframe is optional; we show a fallback state when no embed URL is provided.
