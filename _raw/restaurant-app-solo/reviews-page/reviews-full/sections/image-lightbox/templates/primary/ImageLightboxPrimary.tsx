"use client";

import Image from 'next/image';
import { useEffect } from 'react';
import type { ImageLightboxComponentProps } from '../../types';

export default function ImageLightboxPrimary({ images, currentIndex, onClose, onNext, onPrev }: ImageLightboxComponentProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
        aria-label="Close"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
          aria-label="Previous"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="relative h-[80vh] w-[90vw] max-w-5xl">
        <Image
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1} of ${images.length}`}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      {currentIndex < images.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm hover:bg-white/20"
          aria-label="Next"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>

      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
