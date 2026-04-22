'use client';

import { useState } from 'react';
import type { ReviewsGridComponentProps, ReviewsGridReview } from '../../types';
import { ImageLightboxPrimary } from '@/domains/customer-facing/reviews/sections/image-lightbox/templates/primary';
import { ReviewCardRenderer } from '@/domains/customer-facing/reviews/sections/review-card';
import { reviewTheme } from '@/domains/customer-facing/reviews/shared/config/review-theme';

export default function ReviewsGridPrimary({ content, onHelpfulClick }: ReviewsGridComponentProps) {
  const { reviews } = content;
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], startIndex: number) => {
    setLightboxImages(images);
    setLightboxIndex(startIndex);
  };

  const closeLightbox = () => {
    setLightboxImages([]);
    setLightboxIndex(0);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => Math.min(prev + 1, lightboxImages.length - 1));
  };

  const prevImage = () => {
    setLightboxIndex((prev) => Math.max(prev - 1, 0));
  };

  if (reviews.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-background p-12">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">No reviews found</p>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters to see more reviews</p>
        </div>
      </div>
    );
  }

  const renderCard = (review: ReviewsGridReview) => (
    <ReviewCardRenderer
      key={review.id}
      variant={reviewTheme.cardVariant}
      content={review}
      onImageClick={openLightbox}
      onHelpfulClick={onHelpfulClick}
    />
  );

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">{reviews.map(renderCard)}</div>

      {lightboxImages.length > 0 && (
        <ImageLightboxPrimary
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}
