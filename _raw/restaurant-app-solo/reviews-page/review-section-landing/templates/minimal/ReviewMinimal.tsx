import { Star } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading } from '@/domains/shared/components';
import type { ReviewContent } from '../../types/schema';

export default function ReviewMinimal({
  reviews,
  avgRating = 0,
  totalCount = 0,
  title = 'Customer Reviews',
  viewAllHref = '/reviews',
}: ReviewContent) {
  if (!reviews?.length) return null;

  const topReviews = reviews.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div className="flex-1">
          <SectionHeading
            title={title}
            titleClassName="text-2xl font-light"
            centered={false}
            className="mb-1"
          />
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
            <div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-foreground text-foreground' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{totalCount} reviews</p>
            </div>
          </div>
        </div>
        {viewAllHref ? (
          <Link href={viewAllHref} className="text-sm text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        ) : null}
      </div>

      <div className="space-y-6">
        {topReviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground">{review.authorName}</p>
                {review.publishedAt ? (
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.publishedAt).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'fill-foreground text-foreground' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            {review.comment ? (
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
