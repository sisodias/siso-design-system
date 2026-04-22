# Email Capture Card

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:** luminelle-partnership / src/domains/client/marketing/ui/sections/shop/email-capture-band/EmailCaptureBand.tsx

## What it is

Full-width peach-gradient section containing a centered white card with: peach circle badge holding a Lucide gift icon at top, bold mixed-weight headline "Get 10% off your first order" (10% in serif italic blush, rest in Playfair bold), supporting line ("Join for exclusive creator tutorials, drops, and early access."), email input with inline envelope icon, dark-cocoa "Unlock Your 10% Off" CTA button with gift icon, and a bottom lock-icon + microcopy line ("Secure signup. No spam, unsubscribe anytime.").

## Design details

The 10% is visually emphasized with mixed typography — serif italic vs. bold — this is the signature move. Gift icon appears twice (top badge + inside CTA). Peach gift icon bg uses `brand-peach-rgb` at low alpha.

## Dependencies

- `lucide-react` (Gift, Mail, Lock, PartyPopper, Copy, Check icons)

## Known broken imports when isolated

This component uses design system tokens that must exist in your project:
- `from-semantic-legacy-brand-blush/...`
- `from-semantic-legacy-brand-cocoa/...`
- `from-semantic-accent-cta/...`
- `text-semantic-text-primary`
- `font-heading`

These semantic color and font tokens are Luminelle-specific and will need to be either defined or swapped for equivalent tokens in your design system.

## How to use as reference

Preserved as-is. Swap the `handleSubmit` function to point to your own newsletter endpoint. The component is self-contained with no local imports.
