"use client";

interface WriteReviewButtonProps {
  /**
   * External destination for collecting reviews (e.g. Google Maps).
   * When provided, opens in a new tab.
   */
  googleUrl?: string;
  /**
   * Optional fallback handler for the in-app review modal.
   */
  onFallback?: () => void;
  /**
   * Supplemental copy displayed under the primary CTA.
   */
  note?: string;
}

export function WriteReviewButton({ googleUrl, onFallback, note }: WriteReviewButtonProps = {}) {
  const openFallback = () => {
    if (onFallback) {
      onFallback();
      return;
    }

    if (typeof window !== 'undefined' && (window as any).__openReviewModal) {
      (window as any).__openReviewModal();
    }
  };

  const handlePrimaryClick = () => {
    if (typeof window !== 'undefined' && googleUrl) {
      window.open(googleUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    openFallback();
  };

  const showInAppFallback = Boolean(googleUrl);

  return (
    <div className="flex flex-col items-stretch gap-2 text-left sm:text-right">
      <button
        onClick={handlePrimaryClick}
        className="shrink-0 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
      >
        {googleUrl ? 'Write on Google' : 'Write a Review'}
      </button>

      {note && (
        <span className="text-xs text-muted-foreground sm:self-end" data-testid="write-review-note">
          {note}
        </span>
      )}

      {showInAppFallback && (
        <button
          type="button"
          onClick={openFallback}
          className="text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline sm:self-end"
        >
          Prefer to submit here instead? Open the in-app form.
        </button>
      )}
    </div>
  );
}
