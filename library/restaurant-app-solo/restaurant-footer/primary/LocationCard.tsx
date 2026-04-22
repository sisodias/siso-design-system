'use client';

import { MapPin, ChevronRight } from 'lucide-react';

interface LocationCardProps {
  address?: string;
  mapsUrl?: string;
}

export function LocationCard({ address, mapsUrl }: LocationCardProps) {
  // Don't render if no address provided
  if (!address) {
    return null;
  }

  // Auto-generate Google Maps URL if not provided
  const directionsUrl =
    mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-6 flex w-full max-w-md items-start gap-3 rounded-2xl bg-blue-500/10 px-4 py-3 transition-colors hover:bg-blue-500/20 active:scale-95"
    >
      <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10">
        <MapPin className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1 text-left">
        <p className="mb-1 text-xs text-muted-foreground">Find Us</p>
        <p className="text-sm leading-snug text-foreground">{address}</p>
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
          Get Directions <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}
