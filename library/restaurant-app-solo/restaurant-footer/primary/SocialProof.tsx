'use client';

import { Star, CreditCard, CheckCircle } from 'lucide-react';

interface SocialProofProps {
  rating?: {
    score: number;
    reviews: number;
  };
  certifications?: {
    halal?: boolean;
    organic?: boolean;
  };
  paymentMethods?: string[];
}

export function SocialProof({ rating, certifications, paymentMethods }: SocialProofProps) {
  // Only render if we have at least one piece of social proof
  const hasContent = rating || certifications || (paymentMethods && paymentMethods.length > 0);

  if (!hasContent) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      {/* Review Badge & Certifications */}
      {(rating || certifications) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Google Rating */}
          {rating && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.score.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({rating.reviews >= 1000 ? `${(rating.reviews / 1000).toFixed(1)}k` : rating.reviews})
              </span>
            </div>
          )}

          {/* Halal Badge */}
          {certifications?.halal && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700">
              <CheckCircle className="h-3 w-3" />
              Halal Certified
            </span>
          )}

          {/* Organic Badge */}
          {certifications?.organic && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle className="h-3 w-3" />
              Organic
            </span>
          )}
        </div>
      )}

      {/* Payment Methods */}
      {paymentMethods && paymentMethods.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3 opacity-60">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="text-center text-[10px] text-muted-foreground">
            We accept all major payment methods
          </p>
        </div>
      )}
    </div>
  );
}
