"use client";

import { Plus } from 'lucide-react';

interface FloatingAddReviewButtonProps {
  onClick: () => void;
}

export function FloatingAddReviewButton({ onClick }: FloatingAddReviewButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        aria-label="Add Review"
      >
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full bg-primary opacity-75 blur-md animate-pulse group-hover:animate-none" />

        {/* Content */}
        <div className="relative flex items-center gap-2">
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span className="hidden sm:inline">Add Review</span>
        </div>
      </button>
    </div>
  );
}
