# Reviews Domain - Complete Documentation

## 📚 Overview

The Reviews domain handles all customer review functionality including display, submission, filtering, and moderation. This README documents the complete architecture, database connections, and implementation details.

---

## 🗄️ Database Schema

### Supabase Table: `review`

Located in the `public` schema, the `review` table stores all customer reviews.

```sql
CREATE TABLE review (
  -- Core fields
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id       uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  author_name         text NOT NULL,
  rating              integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment             text,
  status              text NOT NULL DEFAULT 'pending',
  published_at        timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  -- Enhanced fields
  source              text DEFAULT 'website',           -- 'website' or 'Google Maps'
  verified            boolean DEFAULT false,            -- Verified purchase/visit
  featured            boolean DEFAULT false,            -- Highlighted review
  images              jsonb DEFAULT '[]',               -- Array of image URLs
  owner_response      text,                             -- Restaurant owner reply
  owner_responded_at  timestamptz,                      -- When owner replied
  helpful_count       integer DEFAULT 0,                -- Number of helpful votes
  metadata            jsonb DEFAULT '{}'                -- Additional data (tags, highlights)
);
```

### Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_review_restaurant_status ON review(restaurant_id, status);
CREATE INDEX idx_review_featured ON review(restaurant_id, featured) WHERE featured = true;
CREATE INDEX idx_review_rating_status ON review(restaurant_id, rating, status) WHERE status = 'published';
```

### Database Functions

#### `get_restaurant_rating(restaurant_uuid uuid)`

Returns aggregate rating statistics for a restaurant.

```sql
CREATE OR REPLACE FUNCTION get_restaurant_rating(restaurant_uuid uuid)
RETURNS jsonb AS $$
  SELECT jsonb_build_object(
    'average', round(avg(rating)::numeric, 1),
    'total', count(*),
    'breakdown', jsonb_build_object(
      '5_stars', count(*) filter (where rating = 5),
      '4_stars', count(*) filter (where rating = 4),
      '3_stars', count(*) filter (where rating = 3),
      '2_stars', count(*) filter (where rating = 2),
      '1_star', count(*) filter (where rating = 1)
    )
  )
  FROM review
  WHERE restaurant_id = restaurant_uuid AND status = 'published';
$$ LANGUAGE sql STABLE;
```

**Returns:**
```json
{
  "average": 4.7,
  "total": 87,
  "breakdown": {
    "5_stars": 70,
    "4_stars": 13,
    "3_stars": 3,
    "2_stars": 1,
    "1_star": 0
  }
}
```

---

## 🔐 Row Level Security (RLS)

The `review` table has RLS enabled with the following policies:

### 1. Public Read Access
```sql
CREATE POLICY "Public can read published reviews"
  ON review FOR SELECT
  USING (status = 'published');
```
**Effect**: Anyone can read reviews with `status = 'published'`

### 2. Public Submission
```sql
CREATE POLICY "Anyone can submit reviews"
  ON review FOR INSERT
  WITH CHECK (status = 'pending');
```
**Effect**: Anyone can insert reviews, but they must have `status = 'pending'` (requires admin approval)

### 3. Owner Management (Future)
```sql
-- Not yet implemented - requires owner_id on restaurants table
CREATE POLICY "Owners can manage reviews"
  ON review FOR UPDATE
  USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  ));
```

---

## 🔌 Supabase Connection

### Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://ntrklmkzyfnrtfbpdypd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DEFAULT_RESTAURANT_ID=00000000-0000-0000-0000-000000000003
```

### Client Initialization

Server-side client (`src/lib/supabase/server.ts`):
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
```

Client-side client (`src/lib/supabase/client.ts`):
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
```

---

## 📁 File Structure

```
src/domains/customer-facing/reviews/
├── README.md                              # This file
├── sections/
│   └── guest-feedback-section/            # Page-level section (registry, schema, templates)
│       ├── index.tsx                      # Public renderer/helpers/types
│       ├── registry.ts                    # Variant registry
│       ├── data/mock.ts                   # Storybook/test payloads
│       ├── templates/
│       │   └── primary/
│       │       ├── GuestFeedbackPrimary.tsx   # Server wrapper
│       │       └── GuestFeedbackClient.tsx    # Client orchestration (modal + helpful votes)
│       ├── stories/GuestFeedbackSection.stories.tsx
│       └── tests/guestfeedbacksection.spec.ts # Smoke coverage
├── ratings-summary/                       # Stats header section scaffold
├── filter-bar/                            # Sidebar filter controls scaffold
├── reviews-grid/                          # Grid + lightbox scaffold
├── review-card/                           # Review card scaffold
├── add-review-modal/                      # Submission modal scaffold
├── image-lightbox/                        # Lightbox scaffold
├── shared/
│   ├── components/                        # Simple CTA components (write/add buttons)
│   ├── services/                          # Supabase repositories + server actions
│   └── (data|hooks|types|utils)/          # Reserved scaffolds for future shared assets
├── pages/
│   └── ReviewsPage.tsx                    # Server page that maps Supabase data → section content
└── index.ts                               # Domain exports (page + section facade)
```

### Section Inventory

| Section | Path | Purpose |
| --- | --- | --- |
| Guest feedback shell | `sections/guest-feedback-section/` | Orchestrates the complete reviews experience and routes data to sub-sections. |
| Ratings summary | `ratings-summary/` | Displays aggregate rating, breakdown, and primary CTAs. |
| Filter bar | `filter-bar/` | Handles filter pills, sort selection, and URL sync. |
| Reviews grid | `reviews-grid/` | Renders review tiles and wires up infinite scroll/lightbox triggers. |
| Review card | `review-card/` | Presentational card for an individual review. |
| Add review modal | `add-review-modal/` | Collects new submissions and posts to the Supabase action. |
| Image lightbox | `image-lightbox/` | Full-screen modal for review photo galleries. |

---

## 🎯 Server Actions (`shared/services/review-actions.ts`)

All data fetching happens through server actions exported from `shared/services/review-actions.ts`:

### 1. `getReviewsWithFilters(filters)`
Fetches reviews with optional filtering and sorting.

```typescript
const filters = {
  rating: 'all' | '5' | '4' | '3' | '2' | '1',
  source: 'all' | 'google' | 'website',
  feature: 'all' | 'featured' | 'photos' | 'response',
  sort: 'newest' | 'oldest' | 'highest' | 'helpful'
};

const reviews = await getReviewsWithFilters(filters);
```

**Query Logic:**
```typescript
let query = supabase
  .from('review')
  .select('*')
  .eq('restaurant_id', DRACO_RESTAURANT_ID)
  .eq('status', 'published');

// Apply filters
if (filters.rating !== 'all') {
  query = query.eq('rating', parseInt(filters.rating));
}

if (filters.source === 'google') {
  query = query.eq('source', 'Google Maps');
}

// Apply sorting
query = query.order('published_at', { ascending: false });
```

### 2. `getRatingStats()`
Fetches aggregate rating statistics using the database function.

```typescript
const stats = await getRatingStats();
// Returns: { average: 4.7, total: 87, breakdown: {...} }
```

**Implementation:**
```typescript
const { data } = await supabase.rpc('get_restaurant_rating', {
  restaurant_uuid: DRACO_RESTAURANT_ID
});
```

### 3. `submitReview(data)`
Submits a new review (requires authentication).

```typescript
await submitReview({
  rating: 5,
  comment: 'Great coffee!'
});
```

**Implementation:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
const userName = user.user_metadata?.name || user.email?.split('@')[0];

await supabase.from('review').insert({
  restaurant_id: DRACO_RESTAURANT_ID,
  author_name: userName,
  rating: data.rating,
  comment: data.comment,
  status: 'pending',  // Requires approval
  source: 'website',
  verified: false,
  featured: false,
  images: [],
  helpful_count: 0
});

revalidatePath('/reviews');  // Refresh the page
```

### 4. `incrementHelpfulCount(reviewId)`
Increments the helpful count for a review.

```typescript
await incrementHelpfulCount('review-uuid-here');
```

### 5. `getFeaturedTags()`
Extracts unique tags from review metadata.

```typescript
const tags = await getFeaturedTags();
// Returns: ['coffee farm', 'dog-friendly', 'owner passion']
```

### 6. `getRatingBreakdown()`
Gets count of reviews by rating (used by FilterBar).

```typescript
const breakdown = await getRatingBreakdown();
// Returns: { 1: 0, 2: 1, 3: 3, 4: 13, 5: 70 }
```

---

## 🎨 Component Architecture

### Data Flow

```
ReviewsPage.tsx (server)
    ↓ maps Supabase payloads into GuestFeedbackContent
GuestFeedbackRenderer (server)
    ↓ resolves variant via guestFeedbackRegistry
GuestFeedbackClient (client)
    ├─ SectionHeading (pill + title/subtitle)
    ├─ RatingsSummary (stats + WriteReviewButton)
    ├─ FilterBar (URL param syncing)
    ├─ ReviewsGrid
    │     └─ GradientReviewCard → ImageLightbox + Helpful button
    ├─ FloatingAddReviewButton (CTA)
    └─ AddReviewModal → submitReview()
```

### Server vs Client Components

**Server Components** (no 'use client'):
- `pages/ReviewsPage.tsx` – Fetches data and assembles `GuestFeedbackContent`
- `sections/guest-feedback-section/templates/primary/GuestFeedbackPrimary.tsx` – Thin wrapper around the client shell
- `sections/guest-feedback-section/index.tsx` – Renderer helpers & registry exports

**Client Components** ('use client'):
- `sections/guest-feedback-section/templates/primary/GuestFeedbackClient.tsx`
- `ratings-summary/templates/primary/RatingsSummaryPrimary.tsx`
- `filter-bar/templates/primary/FilterBarPrimary.tsx`
- `reviews-grid/templates/primary/ReviewsGridPrimary.tsx`
- `review-card/templates/primary/ReviewCardPrimary.tsx`
- `add-review-modal/templates/primary/AddReviewModalPrimary.tsx`
- `image-lightbox/templates/primary/ImageLightboxPrimary.tsx`
- `shared/components/WriteReviewButton.tsx`
- `shared/components/FloatingAddReviewButton.tsx`

---

## 🔄 Data Fetching Pattern

The reviews page uses **Parallel Data Fetching** for optimal performance:

```typescript
// In ReviewsPage.tsx (server component)
export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const params = await searchParams;
  const filters = {
    rating: params?.rating || 'all',
    source: params?.source || 'all',
    feature: params?.feature || 'all',
    sort: params?.sort || 'newest',
  };

  // Fetch ALL data in parallel using Promise.all
  const [reviews, stats, tags, breakdown, user] = await Promise.all([
    getReviewsWithFilters(filters),
    getRatingStats(),
    getFeaturedTags(),
    getRatingBreakdown(),
    (async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    })(),
  ]);

  const guestReviews: GuestFeedbackReview[] = reviews.map((review) => ({
    id: review.id,
    authorName: review.author_name ?? 'Guest',
    rating: review.rating,
    comment: review.comment ?? '',
    publishedAt: review.published_at ?? new Date().toISOString(),
    source: review.source ?? 'website',
    verified: Boolean(review.verified),
    featured: Boolean(review.featured),
    images: Array.isArray(review.images) ? review.images : [],
    ownerResponse: review.owner_response ?? null,
    ownerRespondedAt: review.owner_responded_at ?? null,
    helpfulCount: review.helpful_count ?? 0,
    metadata: review.metadata ?? undefined,
  }));

  const content: GuestFeedbackContent = {
    heading: {
      title: 'Reviews',
      subtitle: 'See what our guests are saying about their experience',
      pillText: 'GUEST FEEDBACK',
    },
    stats: {
      average: stats?.average ?? 0,
      total: stats?.total ?? 0,
      breakdown: {
        '5_stars': stats?.breakdown?.['5_stars'] ?? 0,
        '4_stars': stats?.breakdown?.['4_stars'] ?? 0,
        '3_stars': stats?.breakdown?.['3_stars'] ?? 0,
        '2_stars': stats?.breakdown?.['2_stars'] ?? 0,
        '1_star': stats?.breakdown?.['1_star'] ?? 0,
      },
    },
    featuredTags: tags ?? [],
    filters: {
      totalReviews: reviews.length,
      ratingBreakdown: breakdown,
    },
    reviews: guestReviews,
    viewer: {
      isAuthenticated: Boolean(user),
      userName: user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? null,
    },
  };

  return <GuestFeedbackRenderer content={content} />;
}
```

**Benefits:**
- All queries run simultaneously
- Fastest possible page load
- Single round-trip to server

---

## 🎭 State Management

### URL Search Params (Filtering)

Filters are stored in URL search params for shareable URLs:

```
/reviews?rating=5&source=google&sort=newest
```

**FilterBar Component:**
```typescript
'use client';

const router = useRouter();
const searchParams = useSearchParams();

const updateFilter = (key: string, value: string) => {
  const params = new URLSearchParams(searchParams);
  params.set(key, value);
  router.push(`/reviews?${params.toString()}`);
};
```

### Modal State (Client-Side)

Review submission modal state is handled inside `GuestFeedbackClient.tsx`:

```typescript
const [isModalOpen, setIsModalOpen] = useState(false);

// Opened by FloatingAddReviewButton or WriteReviewButton
<FloatingAddReviewButton onClick={() => setIsModalOpen(true)} />

// Modal component
<AddReviewModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleSubmitReview}
/>
```

---

## 🛠️ Common Tasks

### Adding a New Review

1. User clicks "Add Review" button (FloatingAddReviewButton or WriteReviewButton)
2. Modal opens (AddReviewModal)
3. User fills form:
   - Rating (1-5 stars)
   - Comment (min 10 chars)
4. On submit:
   - Checks authentication
   - Calls `submitReview()` server action
   - Review inserted with `status: 'pending'`
   - Page revalidated
   - Success message shown

### Approving a Review (Admin Task)

Reviews start with `status: 'pending'`. To approve:

**Via Supabase Dashboard:**
```sql
UPDATE review
SET status = 'published', published_at = NOW()
WHERE id = 'review-uuid';
```

**Via Admin Panel (Future):**
```typescript
await supabase
  .from('review')
  .update({
    status: 'published',
    published_at: new Date().toISOString(),
    featured: true  // Optional: make it featured
  })
  .eq('id', reviewId);
```

### Adding an Owner Response

**Via Admin Panel (Future):**
```typescript
await supabase
  .from('review')
  .update({
    owner_response: 'Thank you for visiting!',
    owner_responded_at: new Date().toISOString()
  })
  .eq('id', reviewId);
```

### Filtering Reviews

FilterBar provides 4 filter types:

1. **By Rating**: All, 5★, 4★, 3★, 2★, 1★
2. **By Source**: All, Google Maps, Website
3. **By Feature**: All, Featured, With Photos, Owner Response
4. **By Sort**: Newest, Oldest, Highest Rated, Most Helpful

All filters update URL params → triggers page re-render with new data.

---

## 🧪 Testing

### Test Review Submission

```typescript
// 1. Ensure user is authenticated
// 2. Click "Add Review" button
// 3. Fill form and submit
// 4. Check Supabase dashboard:

SELECT * FROM review WHERE status = 'pending' ORDER BY created_at DESC LIMIT 1;
```

### Test Filtering

```typescript
// 1. Navigate to /reviews
// 2. Click "5 Star" filter
// 3. URL should be: /reviews?rating=5
// 4. Only 5-star reviews should display
```

### Test Helpful Button

```typescript
// 1. Click "Helpful" on any review
// 2. Button should become active
// 3. Count should increment
// 4. Check database:

SELECT helpful_count FROM review WHERE id = 'review-uuid';
```

---

## 🚀 Performance Optimizations

1. **Parallel Data Fetching**: All queries run simultaneously
2. **Database Indexes**: Fast lookups on restaurant_id, status, rating
3. **Computed Function**: `get_restaurant_rating()` optimized in SQL
4. **Client-Side Caching**: React Query can be added for client state
5. **Optimistic Updates**: Helpful button updates immediately

---

## 🔮 Future Enhancements

### Planned Features

1. **Image Uploads**: Allow users to attach photos
2. **Edit/Delete**: Let users edit their own reviews
3. **Report System**: Flag inappropriate reviews
4. **Reply Threading**: Allow discussion on reviews
5. **Sentiment Analysis**: Auto-tag review sentiment
6. **Review Rewards**: Gamification (points for reviews)

### Database Migrations Needed

```sql
-- For image uploads
ALTER TABLE review ADD COLUMN uploaded_images jsonb DEFAULT '[]';

-- For user ownership
ALTER TABLE review ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- For reports
CREATE TABLE review_report (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id uuid REFERENCES review(id),
  reporter_id uuid REFERENCES auth.users(id),
  reason text,
  created_at timestamptz DEFAULT now()
);
```

---

## 📞 Troubleshooting

### "relation 'public.review' does not exist"

**Cause**: Database migrations not applied

**Fix**:
```bash
# Apply the review table migration
# See: supabase/migrations/202510200940__orders_loyalty_reviews_chat.sql
# And: supabase/migrations/202510241420__reviews_simplified.sql
```

### "Could not find function get_restaurant_rating"

**Cause**: Rating function not created

**Fix**: Apply migration `202510241420__reviews_simplified.sql` which creates the function

### Reviews not showing after submission

**Cause**: Reviews need approval (`status: 'pending'`)

**Fix**: Update review status to 'published' in Supabase dashboard

### Wrong Supabase project connected

**Check**:
```bash
cat .env.local | grep NEXT_PUBLIC_SUPABASE_URL
```

**Should be**:
```
# Project: https://supabase.com/dashboard/project/ntrklmkzyfnrtfbpdypd
NEXT_PUBLIC_SUPABASE_URL=https://ntrklmkzyfnrtfbpdypd.supabase.co
```

---

## 📚 Related Documentation

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [React Query (Future)](https://tanstack.com/query/latest)

---

## 👨‍💻 Maintainers

For questions or issues with the reviews domain, contact the development team.

**Last Updated**: January 2025
