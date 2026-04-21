import { Star } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading } from '@/domains/shared/components';
import type { ReviewContent } from '../../types/schema';

export default function ReviewModern({
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
      <div className="mb-6 text-center">
        <SectionHeading
          pillText="Testimonials"
          title={title}
          titleClassName="text-3xl font-bold"
          centered
          className="mb-2"
        />
        <div className="flex items-center justify-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {avgRating.toFixed(1)} out of 5 ({totalCount} reviews)
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {topReviews.map((review) => (
          <div
            key={review.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              {review.comment ? (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-4">
                  &quot;{review.comment}&quot;
                </p>
              ) : null}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {review.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground">{review.authorName}</p>
                  {review.publishedAt ? (
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.publishedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewAllHref ? (
        <div className="mt-8 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Read all {totalCount} reviews
          </Link>
        </div>
      ) : null}
    </section>
  );
}
