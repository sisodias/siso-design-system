import { Quote, Star } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading } from '@/domains/shared/components';
import type { ReviewContent } from '../../types/schema';

export default function ReviewTestimonial({
  reviews,
  avgRating = 0,
  totalCount = 0,
  title = 'Customer Testimonials',
  viewAllHref = '/reviews',
}: ReviewContent) {
  if (!reviews?.length) return null;

  const topReviews = reviews.slice(0, 3);

  return (
    <section className="relative mx-auto w-full max-w-5xl px-6 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 to-transparent" />

      <div className="mb-10 text-center">
        <SectionHeading
          title={title}
          titleClassName="text-4xl font-bold"
          centered
          className="mb-3"
        />
        <div className="flex items-center justify-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-lg font-medium text-muted-foreground">
            {avgRating.toFixed(1)} / 5.0
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on {totalCount} verified reviews
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {topReviews.map((review) => (
          <div key={review.id} className="relative">
            <div className="rounded-2xl bg-background p-8 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Quote className="h-6 w-6 text-primary" />
              </div>
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              {review.comment ? (
                <p className="mb-6 text-base italic leading-relaxed text-foreground">
                  &quot;{review.comment}&quot;
                </p>
              ) : null}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-lg font-bold text-primary-foreground shadow-md">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{review.authorName}</p>
                    {review.publishedAt ? (
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewAllHref ? (
        <div className="mt-10 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-8 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            Read All Testimonials
          </Link>
        </div>
      ) : null}
    </section>
  );
}
