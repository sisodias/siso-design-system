"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReviewContent } from '../../types/schema';

interface MasonryGridProps {
  columns?: number;
  gap?: number;
  children: React.ReactNode;
}

function MasonryGrid({ columns = 3, gap = 4, children }: MasonryGridProps) {
  const style = {
    columnCount: columns,
    columnGap: `${gap * 0.25}rem`,
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div style={style} className="w-full">
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              className="mb-4 break-inside-avoid"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              key={index}
            >
              {child}
            </motion.div>
          ))
        : children}
    </div>
  );
}

export default function ReviewImageMasonry({
  reviews,
  title = 'What People Are Saying',
}: ReviewContent) {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const getColumns = (width: number) => {
      if (width < 640) return 1;
      if (width < 1024) return 2;
      if (width < 1280) return 3;
      return 4;
    };

    const handleResize = () => setColumns(getColumns(window.innerWidth));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGradientColor = (index: number) => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-purple-500',
      'from-indigo-500 to-blue-500',
    ];
    return colors[index % colors.length];
  };

  if (!reviews?.length) return null;

  return (
    <section className="w-full min-h-screen bg-background p-4 text-foreground sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">{title}</h1>
        <MasonryGrid columns={columns} gap={4}>
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="group relative overflow-hidden rounded-2xl transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <div className={cn('h-64 w-full bg-gradient-to-br', getGradientColor(index))} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
              <div className="absolute left-0 top-0 p-4 text-white">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sm font-semibold text-black">
                    {review.authorName.charAt(0)}
                  </div>
                  <span className="drop-shadow-md font-semibold text-sm">{review.authorName}</span>
                </div>
                <p className="mb-2 text-sm font-medium leading-tight drop-shadow-md">
                  {review.comment || 'Excellent experience!'}
                </p>
                <span className="text-xs opacity-90">
                  {review.rating} ⭐
                  {review.publishedAt && ` • ${new Date(review.publishedAt).toLocaleDateString()}`}
                </span>
              </div>
            </div>
          ))}
        </MasonryGrid>
      </div>
    </section>
  );
}
