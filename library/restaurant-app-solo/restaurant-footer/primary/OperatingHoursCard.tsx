'use client';

import { Clock } from 'lucide-react';

interface OperatingHoursCardProps {
  hours?: string;
  isOpen?: boolean; // Future: calculate dynamically based on schedule
}

export function OperatingHoursCard({ hours, isOpen }: OperatingHoursCardProps) {
  // Don't render if no hours provided
  if (!hours) {
    return null;
  }

  // Default to showing as open if not specified
  // Future enhancement: calculate based on current time and schedule
  const status = isOpen !== false;

  return (
    <div className="mb-6 w-full max-w-md rounded-2xl bg-muted/50 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Hours</span>
        </div>
        <span
          className={`text-sm font-semibold ${
            status ? 'text-green-600' : 'text-muted-foreground'
          }`}
        >
          {status ? 'Open Now' : 'Closed'}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hours}</p>
    </div>
  );
}
