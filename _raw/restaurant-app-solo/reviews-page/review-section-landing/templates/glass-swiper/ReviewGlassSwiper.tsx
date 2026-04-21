'use client';

import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import type { ReviewContent } from '../../types/schema';

interface ReviewGlassSwiperProps extends ReviewContent {
  visibleBehind?: number;
}

export default function ReviewGlassSwiper({ reviews = [], visibleBehind = 2, title }: ReviewGlassSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = reviews.length;

  const navigate = useCallback((newIndex: number) => {
    if (!totalCards) return;
    setActiveIndex((newIndex + totalCards) % totalCards);
  }, [totalCards]);

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent, index: number) => {
    if (index !== activeIndex) return;
    setIsDragging(true);
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    dragStartRef.current = clientX;
    cardRefs.current[activeIndex]?.classList.add('is-dragging');
  };

  const handleDragMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    setDragOffset(clientX - dragStartRef.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    cardRefs.current[activeIndex]?.classList.remove('is-dragging');
    if (Math.abs(dragOffset) > 50) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset, activeIndex, navigate]);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!totalCards) return null;

  const getGradient = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #5e6ad2, #8b5cf6)',
      'linear-gradient(135deg, #10b981, #059669)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #ec4899, #d946ef)',
      'linear-gradient(135deg, #3b82f6, #6366f1)',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section className="testimonials-stack relative py-12 pb-10">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">{title || 'What Our Customers Say'}</h2>
        <p className="text-muted-foreground">Swipe or drag to explore testimonials</p>
      </div>

      {reviews.map((review, index) => {
        const displayOrder = (index - activeIndex + totalCards) % totalCards;
        const style: CSSProperties = {};

        if (displayOrder === 0) {
          style.transform = `translateX(${dragOffset}px)`;
          style.opacity = 1;
          style.zIndex = totalCards;
        } else if (displayOrder <= visibleBehind) {
          const scale = 1 - 0.05 * displayOrder;
          const translateY = -2 * displayOrder;
          style.transform = `scale(${scale}) translateY(${translateY}rem)`;
          style.opacity = 1 - 0.2 * displayOrder;
          style.zIndex = totalCards - displayOrder;
        } else {
          style.transform = 'scale(0)';
          style.opacity = 0;
          style.zIndex = 0;
        }

        return (
          <div
            ref={(element) => (cardRefs.current[index] = element)}
            key={review.id}
            className="testimonial-card glass-effect backdrop-blur-xl"
            style={style}
            onMouseDown={(event) => handleDragStart(event, index)}
            onTouchStart={(event) => handleDragStart(event, index)}
          >
            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white"
                    style={{ background: getGradient(index) }}
                  >
                    {review.authorName
                      .split(' ')
                      .map((namePart) => namePart[0])
                      .join('')
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">{review.authorName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.rating} ⭐
                      {review.publishedAt && ` • ${new Date(review.publishedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              </div>

              <blockquote className="mb-6 text-lg leading-relaxed text-card-foreground/90">
                "{review.comment || 'Excellent service and quality!'}"
              </blockquote>
            </div>
          </div>
        );
      })}

      <div className="pagination absolute bottom-0 left-0 right-0 flex justify-center gap-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to testimonial ${index + 1}`}
            onClick={() => navigate(index)}
            className={`pagination-dot ${activeIndex === index ? 'active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
