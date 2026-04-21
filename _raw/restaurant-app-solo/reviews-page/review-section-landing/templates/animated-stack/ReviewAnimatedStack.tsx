"use client";

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'motion/react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ReviewContent } from '../../types/schema';

const cardVariants = cva('absolute will-change-transform', {
  variants: {
    variant: {
      dark: 'flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-stone-700/50 bg-accent-foreground/80 p-6 backdrop-blur-md',
      light: 'flex size-full flex-col items-center justify-center gap-6 rounded-2xl border bg-accent bg-background/80 p-6 backdrop-blur-md',
    },
  },
  defaultVariants: {
    variant: 'light',
  },
});

interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
}

interface CardStickyProps extends HTMLMotionProps<'div'>, VariantProps<typeof cardVariants> {
  arrayLength: number;
  index: number;
  incrementY?: number;
  incrementZ?: number;
  incrementRotation?: number;
}

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ContainerScrollContext = React.createContext<ContainerScrollContextValue | undefined>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error('useContainerScrollContext must be used within ContainerScrollContext');
  }
  return context;
}

const ContainerScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, style, className, ...props }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start center', 'end end'],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn('relative min-h-svh w-full', className)}
        style={{ perspective: '1000px', ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};

const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('relative', className)} style={{ perspective: '1000px', ...props.style }} {...props}>
    {children}
  </div>
);

const CardTransformed = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation = -index + 90,
      className,
      variant,
      style,
      ...props
    },
    ref,
  ) => {
    const { scrollYProgress } = useContainerScrollContext();

    const start = index / (arrayLength + 1);
    const end = (index + 1) / (arrayLength + 1);
    const range = React.useMemo(() => [start, end], [start, end]);
    const rotateRange = [range[0] - 1.5, range[1] / 1.5];

    const y = useTransform(scrollYProgress, range, ['0%', '-180%']);
    const rotate = useTransform(scrollYProgress, rotateRange, [incrementRotation, 0]);
    const transform = useMotionTemplate`translateZ(${index * incrementZ}px) translateY(${y}) rotate(${rotate}deg)`;

    const dx = useTransform(scrollYProgress, rotateRange, [4, 0]);
    const dy = useTransform(scrollYProgress, rotateRange, [4, 12]);
    const blur = useTransform(scrollYProgress, rotateRange, [2, 24]);
    const alpha = useTransform(scrollYProgress, rotateRange, [0.15, 0.2]);
    const filter =
      variant === 'light'
        ? useMotionTemplate`drop-shadow(${dx}px ${dy}px ${blur}px rgba(0,0,0,${alpha}))`
        : 'none';

    const cardStyle = {
      top: index * incrementY,
      transform,
      backfaceVisibility: 'hidden' as const,
      zIndex: (arrayLength - index) * incrementZ,
      filter,
      ...style,
    };

    return (
      <motion.div
        layout="position"
        ref={ref}
        style={cardStyle}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    );
  },
);
CardTransformed.displayName = 'CardTransformed';

const ReviewStars = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  ({ rating, maxRating = 5, className, ...props }, ref) => {
    const filledStars = Math.floor(rating);
    const fractionalPart = rating - filledStars;
    const emptyStars = maxRating - filledStars - (fractionalPart > 0 ? 1 : 0);

    return (
      <div className={cn('flex items-center gap-2', className)} ref={ref} {...props}>
        <div className="flex items-center">
          {[...Array(filledStars)].map((_, index) => (
            <svg key={`filled-${index}`} className="size-4 text-inherit" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
          {fractionalPart > 0 && (
            <svg className="size-4 text-inherit" fill="currentColor" viewBox="0 0 20 20">
              <defs>
                <linearGradient id="half">
                  <stop offset={`${fractionalPart * 100}%`} stopColor="currentColor" />
                  <stop offset={`${fractionalPart * 100}%`} stopColor="transparent" />
                </linearGradient>
              </defs>
              <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          )}
          {[...Array(emptyStars)].map((_, index) => (
            <svg key={`empty-${index}`} className="size-4 text-stone-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
          ))}
        </div>
      </div>
    );
  },
);
ReviewStars.displayName = 'ReviewStars';

interface ReviewItemProps {
  comment?: string | null;
  authorName: string;
  publishedAt?: string | Date;
  rating: number;
}

function ReviewItem({ comment, authorName, publishedAt, rating }: ReviewItemProps) {
  return (
    <div className="space-y-4 text-center">
      <ReviewStars rating={rating} className="justify-center" />
      {comment ? (
        <p className="text-balance text-base leading-relaxed text-muted-foreground">“{comment}”</p>
      ) : null}
      <div className="flex items-center justify-center gap-3">
        <Avatar className="size-10 border">
          <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(authorName)}`} alt={authorName} />
          <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">{authorName}</p>
          {publishedAt ? (
            <p className="text-xs text-muted-foreground">
              {new Date(publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface ReviewAnimatedStackProps extends ReviewContent {
  variant?: VariantProps<typeof cardVariants>['variant'];
}

export default function ReviewAnimatedStack({
  reviews,
  title = 'Trusted by Locals & Travellers',
  avgRating = 0,
  totalCount = 0,
}: ReviewAnimatedStackProps) {
  if (!reviews?.length) return null;

  const firstThree = reviews.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted to-background py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {avgRating.toFixed(1)} average rating from {totalCount} reviews
          </p>
        </div>

        <ContainerScroll className="w-full">
          <CardsContainer className="relative h-[420px] w-full">
            {firstThree.map((review, index) => (
              <CardTransformed
                key={review.id}
                arrayLength={firstThree.length}
                index={index}
                incrementY={24}
                incrementZ={20}
                incrementRotation={-10 * (index - 1)}
              >
                <ReviewItem
                  comment={review.comment}
                  authorName={review.authorName}
                  publishedAt={review.publishedAt}
                  rating={review.rating}
                />
              </CardTransformed>
            ))}
          </CardsContainer>
        </ContainerScroll>
      </div>
    </section>
  );
}
