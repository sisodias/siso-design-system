"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/domains/shared/hooks/use-toast';
import type { AddReviewModalComponentProps } from '../../types';

export default function AddReviewModalPrimary({ content, isOpen, onClose, onSubmit }: AddReviewModalComponentProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const commentFieldId = 'guest-feedback-comment';

  const userName = content.userName ?? null;
  const isAuthenticated = Boolean(content.isAuthenticated);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/reviews');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ rating, comment: comment.trim() });
      setRating(5);
      setComment('');
      onClose();

      toast({
        title: 'Review submitted',
        description: 'Thank you! Your review will appear once approved.',
      });
    } catch (submissionError) {
      globalThis.console?.error?.('[AddReviewModal] Failed to submit review', submissionError);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Write a Review</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted" aria-label="Close">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">Please sign in to leave a review</p>
            <button
              onClick={() => router.push('/auth/signin?callbackUrl=/reviews')}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {userName && (
              <div className="mb-4">
                <p className="mb-2 block text-sm font-medium text-foreground">Posting as</p>
                <p className="rounded-lg border border-border bg-muted px-4 py-2 text-sm text-foreground" role="note">
                  {userName}
                </p>
              </div>
            )}

            <fieldset className="mb-4">
              <legend className="mb-2 text-sm font-medium text-foreground">Your Rating *</legend>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-3xl transition-transform hover:scale-110"
                    aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
                  >
                    <span className={star <= (hoveredRating || rating) ? 'text-yellow-500' : 'text-gray-300'} aria-hidden>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor={commentFieldId}>
                Your Review *
              </label>
              <textarea
                id={commentFieldId}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share your experience with us..."
                rows={6}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
                minLength={10}
              />
              <p className="mt-1 text-xs text-muted-foreground">Minimum 10 characters ({comment.length}/10)</p>
            </div>

            {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-700">{error}</div>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-border bg-background px-4 py-3 font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || comment.trim().length < 10}
                className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Your review will be published after approval by our team
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
