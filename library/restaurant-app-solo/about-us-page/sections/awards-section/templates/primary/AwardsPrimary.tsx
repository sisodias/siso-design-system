"use client";

import Link from 'next/link';
import { useMemo } from 'react';
import { Award, Star, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/domains/shared/components';
import { TestimonialsColumn, type Testimonial } from '@/domains/customer-facing/landing/sections/review-section/shared/components/TestimonialsColumn';
import type { AwardsContent } from '../../types/schema';

const iconMap = {
  award: Award,
  trending: TrendingUp,
  users: Users,
  star: Star,
};

function avatarFromName(name: string): string {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gender = hash % 2 === 0 ? 'women' : 'men';
  const imageNumber = (hash % 70) + 1;
  return `https://randomuser.me/api/portraits/${gender}/${imageNumber}.jpg`;
}

function mapTestimonialsToColumns(testimonials: AwardsContent['testimonials']): Testimonial[][] {
  if (!testimonials?.length) {
    return [];
  }

  const mapped: Testimonial[] = testimonials.map((testimonial) => {
    const name = testimonial.name ?? 'Guest';
    const role = testimonial.date ?? testimonial.platform ?? 'Guest';
    const text = testimonial.text?.trim() ? `“${testimonial.text.trim()}”` : '“Wonderful experience at Draco!”';

    return {
      text,
      image: avatarFromName(name),
      name,
      role,
      rating: testimonial.rating,
    };
  });

  const columnCount = Math.min(3, mapped.length);
  const itemsPerColumn = Math.ceil(mapped.length / columnCount);

  return Array.from({ length: columnCount }, (_, index) =>
    mapped.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)
  ).filter((column) => column.length > 0);
}

export default function AwardsPrimary({
  title = 'Loved by Our Community',
  subtitle = 'See what our customers are saying',
  googleRating = {
    score: 4.6,
    totalReviews: 149,
    source: 'Google',
  },
  testimonials = [],
  achievements = [],
  compact = false,
}: AwardsContent) {
  const testimonialColumns = useMemo(() => mapTestimonialsToColumns(testimonials), [testimonials]);
  const hasTestimonials = testimonialColumns.length > 0;

  return (
    <section className={cn('py-16 px-6 sm:py-24', compact ? 'bg-background' : 'bg-muted/30')}>
      <div className="mx-auto max-w-7xl">
        <style>{`
          @keyframes twinkle { 0% { opacity: .25; transform: scale(.9) rotate(0deg);} 50% { opacity: 1; transform: scale(1.15) rotate(15deg);} 100% { opacity: .25; transform: scale(.9) rotate(0deg);} }
          @keyframes floaty { 0% { transform: translateY(0) } 100% { transform: translateY(-10px) } }
        `}</style>

        <SectionHeading
          pillText="Customer Reviews"
          title={title}
          subtitle={subtitle}
          titleClassName="text-3xl md:text-4xl font-bold"
          as="h2"
          centered
          className="mb-8"
        />

        {compact ? (
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card/60 p-6 text-card-foreground backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <Star
                  key={i}
                  className="absolute h-5 w-5 text-orange-400"
                  style={{
                    left: `${10 + i * 14}%`,
                    top: i % 2 ? '15%' : '70%',
                    animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-orange-400" fill="currentColor" />
                <p className="text-lg font-semibold text-foreground">
                  {googleRating?.score ?? 0}
                  {googleRating && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      from {googleRating.totalReviews} {googleRating.source} reviews
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      googleRating && i < Math.floor(googleRating.score)
                        ? 'text-orange-400'
                        : 'text-muted'
                    )}
                    fill={googleRating && i < Math.floor(googleRating.score) ? 'currentColor' : 'transparent'}
                  />
                ))}
              </div>
              <Link
                href="/reviews"
                className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
              >
                See all reviews
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-12 mx-auto max-w-2xl">
              <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-amber-400/10 to-rose-500/10 p-10 text-center backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0">
                  {[...Array(16)].map((_, i) => (
                    <Star
                      key={i}
                      className="absolute h-6 w-6 text-orange-400/90"
                      fill="currentColor"
                      style={{
                        left: `${(i * 13) % 100}%`,
                        top: `${(i * 23) % 100}%`,
                        animation: `twinkle ${2 + (i % 5)}s ease-in-out ${(i % 7) * 0.25}s infinite, floaty ${3 + (i % 4)}s ease-in-out ${(i % 3) * 0.2}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <span className="text-6xl font-bold text-foreground">
                      {googleRating?.score ?? 0}
                    </span>
                    <Star className="h-12 w-12 text-orange-400" fill="currentColor" />
                  </div>

                  <div className="mb-3 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-6 w-6',
                          googleRating && i < Math.floor(googleRating.score)
                            ? 'text-orange-400'
                            : 'text-muted'
                        )}
                        fill={googleRating && i < Math.floor(googleRating.score) ? 'currentColor' : 'transparent'}
                      />
                    ))}
                  </div>

                  {googleRating && (
                    <p className="text-lg font-medium text-foreground">
                      Based on <span className="font-bold">{googleRating.totalReviews}</span> {googleRating.source} Reviews
                    </p>
                  )}

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
                    <Award className="h-4 w-4" />
                    Top-Rated Coffee Shop in Denpasar
                  </div>
                </div>
              </div>
            </div>

            {hasTestimonials && (
              <div className="mx-auto mt-14 max-w-6xl px-2 sm:px-4">
                <div className="flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-300">
                    Real guest feedback
                  </span>
                </div>

                <div className="mt-8 flex max-h-[680px] justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_88%,transparent_100%)]">
                  {testimonialColumns.map((column, index) => (
                    <TestimonialsColumn
                      key={index}
                      testimonials={column}
                      duration={[22, 26, 24][index % 3]}
                      className={cn(
                        'max-w-xs',
                        index === 2 && testimonialColumns.length > 2 ? 'hidden lg:block' : ''
                      )}
                    />
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <Link
                    href="/reviews"
                    className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                  >
                    Show all reviews
                  </Link>
                </div>
              </div>
            )}

            {achievements.length > 0 && (
              <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {achievements.map((achievement) => {
                  const Icon = iconMap[achievement.icon];
                  return (
                    <div
                      key={achievement.id}
                      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center"
                    >
                      <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
