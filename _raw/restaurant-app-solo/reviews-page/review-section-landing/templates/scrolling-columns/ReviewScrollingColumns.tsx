"use client";

import { motion } from 'motion/react';
import { SectionHeading } from '@/domains/shared/components';
import type { ReviewContent } from '../../types/schema';
import { TestimonialsColumn, Testimonial } from '../../shared/components/TestimonialsColumn';

function reviewToTestimonial(review: ReviewContent['reviews'][number]): Testimonial {
  const hash = review.authorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gender = hash % 2 === 0 ? 'women' : 'men';
  const imageNumber = (hash % 70) + 1;
  const imageUrl = `https://randomuser.me/api/portraits/${gender}/${imageNumber}.jpg`;
  const formattedDate = review.publishedAt
    ? new Date(review.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return {
    text: review.comment || 'Great experience!',
    image: imageUrl,
    name: review.authorName,
    role: formattedDate || 'Customer',
    rating: review.rating,
  };
}

export default function ReviewScrollingColumns({
  reviews,
  title = 'What Our Guests Say',
  avgRating = 0,
  totalCount = 0,
}: ReviewContent) {
  if (!reviews?.length) return null;

  const testimonials = reviews.map(reviewToTestimonial);
  const firstColumn = testimonials.slice(0, Math.ceil(testimonials.length / 3));
  const secondColumn = testimonials.slice(Math.ceil(testimonials.length / 3), Math.ceil(testimonials.length * 2 / 3));
  const thirdColumn = testimonials.slice(Math.ceil(testimonials.length * 2 / 3));

  return (
    <section className="relative my-20 bg-background">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center px-4"
        >
          <SectionHeading
            pillText="Testimonials"
            title={title}
            titleClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter"
            centered
          />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <div className="rounded-full border bg-primary/5 py-1.5 px-4 text-xs font-medium">
              {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
            </div>
            <div className="rounded-full border bg-primary/5 py-1.5 px-4 text-xs font-medium">
              {avgRating.toFixed(1)} ⭐ average
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex max-h-[700px] justify-center gap-4 overflow-hidden px-6 [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]">
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn testimonials={secondColumn} duration={25} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={22} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <a
            href="/reviews"
            className="inline-flex items-center gap-2 rounded-full border bg-primary/5 py-2 px-6 text-sm font-medium transition-colors hover:bg-primary/10"
          >
            See all reviews →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
