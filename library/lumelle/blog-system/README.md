# Lumelle Blog System — Design System Bank

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

## Source
`luminelle-partnership / src/domains/blog/ + src/domains/client/blog/`

## What this is
Complete blog block system for Lumelle e-commerce. Full vertical slice from data fetch to rendered UI:
- Content data (`data/blog.ts`) — 12 hardcoded blog posts with sections, FAQs, product cards
- Hooks (`hooks/`) — UI state logic
- Business logic (`logic/`) — pure functions
- UI pages + components (`presentation/`) — BlogIndexPage, BlogPostPage, layouts, components
- React Query application layer (`application/`) — `useBlogPosts`, `useBlogPost`, `useBlogCategories` backed by Supabase
- Supabase infrastructure (`infrastructure/supabase.ts`) — database client

## Folder breakdown
| Folder | Role |
|--------|------|
| `presentation/` | Pages (BlogIndexPage, BlogPostPage), layouts, UI components (NewsletterSignup, BlogSocial, ReadingProgress) |
| `data/` | Static blog post data with full content, sections, FAQs, product cards |
| `hooks/` | UI state hooks |
| `logic/` | Pure business logic |
| `application/` | React Query hooks (`useBlogPosts`, `useBlogPost`, `useBlogCategories`) |
| `infrastructure/` | Supabase client and query definitions |

## File count
**23 files** total:
- `presentation/pages/`: 2 (BlogIndexPage.tsx, BlogPostPage.tsx)
- `presentation/layouts/`: 2 (BlogLayout.tsx, index.ts)
- `presentation/components/`: 3 (BlogSocial.tsx, NewsletterSignup.tsx, ReadingProgress.tsx)
- `presentation/sections/`: 1 (README placeholder)
- `application/`: 3 (useBlogPosts.ts, useBlogPost.ts, useBlogCategories.ts, index.ts)
- `infrastructure/`: 1 (supabase.ts)
- `data/`: 1 (blog.ts — 12 full posts)
- `hooks/`: 1 (README placeholder)
- `logic/`: 1 (README placeholder)
- Root: 1 (index.ts)
- README files: 8

## Why this is a keeper
Shaan said "I know it works, I know it's good — take the code for the whole block system." Preserved wholesale so the entire blog feature can be dropped into future apps without rebuilding from scratch.

## Dependencies
- `@tanstack/react-query` — data fetching and caching
- `@supabase/supabase-js` — database
- `react-router-dom` — SPA routing
- `lucide-react` — icons
- `react-helmet-async` — SEO metadata
- `markdown-to-jsx` — markdown rendering

## Known broken imports when dropped into new app
The following `@/...` aliases must be resolved before use:

```
@/components/Seo
@/config/constants
@/domains/client/blog/application
@/layouts/MarketingLayout
@/utils/cdn
@platform/seo/logic/publicBaseUrl
@ui/components/SectionHeading
@blog/ui/layouts
```

## How to reuse
1. Resolve all `@/...` aliases above to your project's paths
2. Swap Supabase URL and anon key in `infrastructure/supabase.ts`
3. Wire `QueryClientProvider` at your app root
4. Mount routes: `/blog` → BlogIndexPage, `/blog/:slug` → BlogPostPage

## Exposed routes
| Route | Component |
|-------|-----------|
| `/blog` | BlogIndexPage |
| `/blog/:slug` | BlogPostPage |
