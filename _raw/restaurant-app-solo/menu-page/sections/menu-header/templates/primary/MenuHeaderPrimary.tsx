"use client";

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/domains/shared/components';
import SeedDataButton from '@/domains/client-facing/components/SeedDataButton';
import type { MenuHeaderContent } from '../../types/schema';

export default function MenuHeaderPrimary({
  title,
  subtitle,
  tagline,
  showSeedButton,
  cta,
}: MenuHeaderContent) {
  return (
    <header className="relative mx-auto max-w-6xl space-y-8 text-center text-white">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 px-6 py-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_70%)]" />
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-4 text-center md:text-left">
            {tagline ? (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/80">
                {tagline}
              </p>
            ) : null}
            <h1 className="bg-gradient-to-r from-orange-200 via-amber-200 to-orange-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-lg text-gray-200">{subtitle}</p>
            ) : null}
          </div>

          {showSeedButton ? (
            <div className="flex w-full justify-center md:w-auto md:justify-end">
              <SeedDataButton />
            </div>
          ) : null}
        </div>
      </div>

      {cta ? (
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-full border border-white/20 bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-6 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-xl hover:shadow-orange-500/30 focus:ring focus:ring-orange-500/40"
          >
            <Link href={cta.href}>
              {cta.icon === 'shopping-bag' ? <ShoppingBag className="mr-2" /> : null}
              {cta.label}
            </Link>
          </Button>
        </div>
      ) : null}
    </header>
  );
}
