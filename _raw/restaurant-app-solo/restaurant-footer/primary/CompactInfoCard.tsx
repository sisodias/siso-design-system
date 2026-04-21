'use client';

import { MapPin, Clock } from 'lucide-react';

interface CompactInfoCardProps {
  address?: string;
  hours?: string;
}

export function CompactInfoCard({ address, hours }: CompactInfoCardProps) {
  // Don't render if no info provided
  if (!address && !hours) {
    return null;
  }

  return (
    <div className="mb-8 w-full max-w-md text-center">
      {/* Address */}
      {address && (
        <div className="mb-2 flex items-center justify-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <p className="text-sm text-foreground">{address}</p>
        </div>
      )}

      {/* Hours */}
      {hours && (
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{hours}</p>
        </div>
      )}
    </div>
  );
}
