'use client';

import { MapPin, Clock } from 'lucide-react';

interface EnhancedHoursLocationProps {
  address?: string;
  hours?: string;
}

export function EnhancedHoursLocation({ address, hours }: EnhancedHoursLocationProps) {
  // Don't render if no info provided
  if (!address && !hours) {
    return null;
  }

  // Simple check if currently open (can be enhanced with real time logic)
  const isOpenNow = true; // TODO: Add real time check logic

  return (
    <div className="mb-4 w-full max-w-md space-y-1 text-center">
      {/* Hours with OPEN NOW emphasis */}
      {hours && (
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          {isOpenNow && (
            <span className="text-sm font-bold text-green-600 uppercase tracking-wide">
              Open Now
            </span>
          )}
          <span className="text-sm text-muted-foreground">• {hours}</span>
        </div>
      )}

      {/* Address */}
      {address && (
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-foreground">{address}</p>
        </div>
      )}
    </div>
  );
}
