# TikTok / Social Video Carousel

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:** luminelle-partnership / src/domains/client/shop/products/ui/sections/featured-tik-tok/FeaturedTikTok.tsx

## What it is

Mobile-first social-video carousel section. Centered peach pill eyebrow "AS SEEN ON TIKTOK", Playfair serif heading "Creators using Lumelle", supporting subtitle, then a horizontal snap-scroll carousel of 9:16 video cards. Each card shows the video preview with TikTok logo overlay, play button center, engagement stats (heart + count), creator handle + "Watch on TikTok →" link below card. Bottom strip shows 6 dot/pill indicators (one cocoa-filled, rest lighter) as pagination.

## Design details

NOT TikTok-specific — the agent should emphasize this in the README. The pattern works equally well for Instagram Reels, YouTube Shorts, self-hosted creator videos, etc. Key reusable pieces: peach-gradient backdrop panel holding the video, scroll-snap + peek pattern where next card's edge is visible, dot pagination at bottom.

## Reuse / genericization

Shaan specifically flagged "this could be used for TikTok, Instagram, whatever" — so the README should call out how to genericize: replace the TikTok logo + "Watch on TikTok" CTA with a `platform` prop that switches icon + deep-link.

## Dependencies

- IntersectionObserver API (native, no lib) for LazyVisible
- CSS scroll-snap for carousel behavior (no framer-motion or embla required)
- lucide-react icons (Heart, Play, ExternalLink) for stat icons and external link CTA
- Tailwind CSS for styling

## Known broken imports when isolated

```typescript
// These need to be resolved before use:
import { successStories } from '@/content/landing'   // → copy ./success-stories.ts
import { SectionHeading } from '@ui/components/SectionHeading'  // → copy ./SectionHeading.tsx
import { LazyVisible } from '@ui/components/LazyVisible'  // → copy ./LazyVisible.tsx
```

## Props interface

```typescript
type Heading = {
  eyebrow?: string
  title?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
}

type Props = {
  heading?: Heading
  sectionId?: string
  tiktoks?: {
    name: string
    handle: string
    embedUrl: string
    videoUrl?: string
  }[]
}
```

## Generic platform prop (planned refactor)

```typescript
type Platform = 'tiktok' | 'instagram' | 'youtube'

// Replace hardcoded TikTok references:
{/* Current */}
<span>Watch on TikTok</span>
<ExternalLinkIcon />

{/* Generic */}
<span>Watch on {platformName}</span>
{platformIcon}
```
