'use client';

import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';

interface DrawerPromoBannerProps {
  message: string;
  href?: string;
  onLinkClick?: () => void;
}

export function DrawerPromoBanner({ message, href = '/loyalty', onLinkClick }: DrawerPromoBannerProps) {
  return (
    <div className="px-4 py-3">
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-xl bg-gradient-to-br from-primary/8 to-primary/5 p-4 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
        onClick={onLinkClick}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-primary/70">
              Membership Perk
            </h3>
            <p className="text-sm font-medium text-foreground">{message}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary/60 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </div>
  );
}
