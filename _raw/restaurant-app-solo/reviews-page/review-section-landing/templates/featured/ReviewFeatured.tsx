import { Quote, Star } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading } from '@/domains/shared/components';
import type { ReviewContent } from '../../types/schema';

export default function ReviewFeatured({
  reviews,
  avgRating = 0,
  totalCount = 0,
  title = 'Featured Reviews',
  viewAllHref = '/reviews',
}: ReviewContent) {
  if (!reviews?.length) return null;

  const [featured, ...others] = reviews;
  const sideReviews = others.slice(0, 2);

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 text-center">
        <SectionHeading
          title={title}
          titleClassName="text-3xl font-semibold"
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
            {avgRating.toFixed(1)} average from {totalCount} reviews
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="relative h-full rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8">
            <Quote className="absolute right-8 top-8 h-16 w-16 text-primary/10" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < featured.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              {featured.comment ? (
                <p className="mb-6 text-lg leading-relaxed text-foreground">
                  &quot;{featured.comment}&quot;
                </p>
              ) : null}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                  {featured.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{featured.authorName}</p>
                  {featured.publishedAt ? (
                    <p className="text-sm text-muted-foreground">
                      {new Date(featured.publishedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {sideReviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-background p-6">
              <div className="mb-3 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              {review.comment ? (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                  &quot;{review.comment}&quot;
                </p>
              ) : null}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                  {review.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{review.authorName}</p>
                  {review.publishedAt ? (
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.publishedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewAllHref ? (
        <div className="mt-8 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all reviews
          </Link>
        </div>
      ) : null}
    </section>
  );
}
