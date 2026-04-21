'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from '@siso/ui/primitives/buttons/shadcn-ui-button';

interface DrawerHeaderProps {
  restaurantName: string;
  tagline?: string;
  logoUrl?: string;
  onClose: () => void;
}

export function DrawerHeader({ restaurantName, tagline, logoUrl, onClose }: DrawerHeaderProps) {
  return (
    <div className="relative border-b border-border/10 px-6 py-5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label="Close menu"
        className="absolute right-4 top-4"
      >
        <X className="h-5 w-5" />
      </Button>

      <Link
        href="/"
        onClick={onClose}
        className="flex items-center gap-3 pr-10 transition-opacity hover:opacity-80"
      >
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={restaurantName}
            width={40}
            height={40}
            className="rounded-lg shadow-sm"
          />
        )}
        <div>
          <h2 className="text-lg font-bold text-foreground">{restaurantName}</h2>
          {tagline && <p className="text-xs text-muted-foreground">{tagline}</p>}
        </div>
      </Link>
    </div>
  );
}
