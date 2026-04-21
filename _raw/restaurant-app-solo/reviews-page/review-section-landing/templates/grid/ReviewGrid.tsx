import { motion } from 'framer-motion';
import { GridPattern } from '@/domains/shared/components';
import type { ReviewContent } from '../../types/schema';

export default function ReviewGrid({
  reviews,
  avgRating = 0,
  totalCount = 0,
  title = 'Real Results, Real Voices',
  viewAllHref = '/reviews',
}: ReviewContent) {
  if (!reviews?.length) return null;

  return (
    <section className="relative w-full px-4 pt-10 pb-20">
      <div aria-hidden className="absolute inset-0 isolate z-0">
        <div className="absolute left-0 top-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
        <div className="absolute left-0 top-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
      </div>

      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl xl:font-extrabold">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
            See how guests are thriving — real stories, real impact, real growth. ({totalCount} reviews, {avgRating.toFixed(1)} average)
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
              whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index + 0.1, duration: 0.8 }}
              className="relative grid grid-cols-[auto_1fr] gap-x-3 overflow-hidden border border-dashed border-foreground/25 p-4"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-foreground/2 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
                  <GridPattern
                    width={25}
                    height={25}
                    x={-12}
                    y={4}
                    strokeDasharray="3"
                    className="stroke-foreground/20 absolute inset-0 h-full w-full mix-blend-overlay"
                  />
                </div>
              </div>

              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {review.authorName.charAt(0)}
              </div>
              <div>
                <div className="-space-y-0.5">
                  <p className="text-sm md:text-base">{review.authorName}</p>
                  <span className="text-muted-foreground block text-[11px] font-light tracking-tight">
                    {review.rating} ⭐
                    {review.publishedAt && ` • ${new Date(review.publishedAt).toLocaleDateString()}`}
                  </span>
                </div>
                <blockquote className="mt-3">
                  <p className="text-foreground text-sm font-light tracking-wide">
                    {review.comment || 'Great experience!'}
                  </p>
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>

        {viewAllHref ? (
          <div className="mt-6 text-center">
            <a href={viewAllHref} className="font-medium text-primary hover:underline">
              View All Reviews →
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
