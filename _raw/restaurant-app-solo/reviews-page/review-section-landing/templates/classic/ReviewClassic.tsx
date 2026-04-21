import { RatingBadge, SectionHeading } from '@/domains/shared/components';
import { ReviewCard } from '@/domains/customer-facing/landing/shared/components/review-card';
import Link from 'next/link';
import type { ReviewContent } from '../../types/schema';

export default function ReviewClassic({
  reviews,
  avgRating = 0,
  totalCount = 0,
  title = 'What Our Guests Say',
  viewAllHref = '/reviews',
}: ReviewContent) {
  if (!reviews?.length) return null;

  const topReviews = reviews.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <SectionHeading
            pillText="Testimonials"
            title={title}
            centered={false}
            className="mb-0"
          />
        </div>
        <RatingBadge rating={avgRating} count={totalCount} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {topReviews.map((review) => (
          <ReviewCard
            key={review.id}
            author={review.authorName}
            rating={review.rating}
            comment={review.comment}
            date={
              review.publishedAt
                ? new Date(review.publishedAt).toLocaleDateString()
                : undefined
            }
          />
        ))}
      </div>
      {viewAllHref ? (
        <div className="mt-6 text-center">
          <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
            Read all reviews
          </Link>
        </div>
      ) : null}
    </section>
  );
}
