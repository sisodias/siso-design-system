"use client";

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReviewContent } from '../../types/schema';

const SQRT_5000 = Math.sqrt(5000);

export default function ReviewStaggerCards({
  reviews,
  title = 'Customer Testimonials',
}: ReviewContent) {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(() => reviews ?? []);

  useEffect(() => {
    setTestimonialsList(reviews ?? []);
  }, [reviews]);

  const handleMove = (steps: number) => {
    const list = [...testimonialsList];
    if (!list.length) return;

    if (steps > 0) {
      for (let i = 0; i < steps; i++) {
        const item = list.shift();
        if (!item) continue;
        list.push({ ...item, id: `${item.id}-${Math.random()}` });
      }
    } else if (steps < 0) {
      for (let i = steps; i < 0; i++) {
        const item = list.pop();
        if (!item) continue;
        list.unshift({ ...item, id: `${item.id}-${Math.random()}` });
      }
    }
    setTestimonialsList(list);
  };

  useEffect(() => {
    const updateSize = () => {
      const matches = window.matchMedia('(min-width: 640px)').matches;
      setCardSize(matches ? 365 : 290);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!testimonialsList.length) return null;

  return (
    <section className="w-full py-12">
      <h2 className="mb-3 text-center text-3xl font-bold md:text-4xl">{title}</h2>
      <p className="mb-12 text-center text-muted-foreground">Hear what our customers have to say</p>

      <div className="relative w-full overflow-hidden bg-muted/30" style={{ height: 600 }}>
        {testimonialsList.map((review, index) => {
          const position = testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;

          const isCenter = position === 0;

          return (
            <div
              onClick={() => handleMove(position)}
              key={review.id}
              className={cn(
                'absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out',
                isCenter
                  ? 'z-10 border-primary bg-primary text-primary-foreground'
                  : 'z-0 border-border bg-card text-card-foreground hover:border-primary/50'
              )}
              style={{
                width: cardSize,
                height: cardSize,
                clipPath: 'polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)',
                transform: `
                  translate(-50%, -50%)
                  translateX(${(cardSize / 1.5) * position}px)
                  translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
                  rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
                `,
                boxShadow: isCenter ? '0px 8px 0px 4px hsl(var(--color-border))' : '0px 0px 0px 0px transparent',
              }}
            >
              <span
                className="absolute block origin-top-right rotate-45 bg-border"
                style={{
                  right: -2,
                  top: 48,
                  width: SQRT_5000,
                  height: 2,
                }}
              />
              <div className="mb-4 flex h-14 w-12 items-center justify-center bg-muted text-2xl font-bold">
                {review.authorName.charAt(0)}
              </div>
              <h3 className={cn('text-base sm:text-xl font-medium', isCenter ? 'text-primary-foreground' : 'text-foreground')}>
                "{review.comment || 'Great experience!'}"
              </h3>
              <p className={cn(
                'absolute bottom-8 left-8 right-8 mt-2 text-sm italic',
                isCenter ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}>
                - {review.authorName} ({review.rating} ⭐)
              </p>
            </div>
          );
        })}

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              'flex h-14 w-14 items-center justify-center text-2xl transition-colors',
              'bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              'flex h-14 w-14 items-center justify-center text-2xl transition-colors',
              'bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
