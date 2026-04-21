"use client";

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { Playfair_Display, Manrope } from 'next/font/google';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import type { HeroContent, HeroCta, HeroMetaBadge } from '../../types/schema';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const CTA_STYLE_MAP: Record<NonNullable<HeroCta['style']>, { variant: 'default' | 'outline' | 'ghost' }> = {
  primary: { variant: 'default' },
  secondary: { variant: 'outline' },
  ghost: { variant: 'ghost' },
};

function HeroCtaButton({ cta, icon }: { cta: HeroCta; icon?: ReactNode }) {
  const { label, href, ariaLabel, style } = cta;
  const variant = CTA_STYLE_MAP[style ?? 'primary']?.variant ?? 'default';
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? label}
      className={cn(
        buttonVariants({
          variant,
          size: 'lg',
          className: 'h-12 rounded-full px-6 text-base font-semibold',
        }),
        'justify-center'
      )}
    >
      <span className="flex items-center gap-2">
        {label}
        {icon}
      </span>
    </Link>
  );
}

function MetaBadge({ badge }: { badge: HeroMetaBadge }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-left text-xs uppercase tracking-[0.18em] text-white/70 shadow-[0_6px_20px_rgba(9,9,11,0.35)] backdrop-blur">
      <div className="text-[10px] text-white/50">{badge.label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{badge.value}</div>
    </div>
  );
}

export default function HeroPrimary({
  title = 'About Draco Coffee',
  subtitle = 'Where strong coffee meets authentic flavor.',
  description = "Nestled in the heart of Denpasar, serving Bali's boldest coffee and most authentic flavors since our opening.",
  imageUrl = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90&auto=format&fit=crop',
  pillText = 'Discover Our Journey',
  primaryCta,
  secondaryCta,
  metaBadges,
}: HeroContent) {
  const hasMeta = Array.isArray(metaBadges) && metaBadges.length > 0;
  return (
    <section className="relative isolate overflow-hidden bg-neutral-950">
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={title ?? 'About hero image'}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col justify-between gap-12 px-6 pt-28 pb-16 sm:min-h-[70vh] sm:px-8 sm:pt-32 sm:pb-20">
        <div className="flex flex-col gap-6 text-left text-white">
          {pillText && (
            <span className="inline-flex w-max items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden />
              {pillText}
            </span>
          )}

          <div className="space-y-4">
            <h1
              className={cn(
                'text-[2.2rem] font-semibold leading-tight text-white sm:text-[2.6rem]',
                playfair.className
              )}
            >
              {title ?? 'About Us'}
            </h1>
            {subtitle && (
              <p
                className={cn(
                  'text-base font-medium text-white/85 sm:text-lg',
                  manrope.className
                )}
              >
                {subtitle}
              </p>
            )}
            {description && (
              <p
                className={cn(
                  'text-sm leading-relaxed text-white/70 sm:text-base',
                  manrope.className
                )}
              >
                {description}
              </p>
            )}
          </div>

          {hasMeta && (
            <div className="mt-2 grid grid-cols-2 gap-3 sm:max-w-md sm:grid-cols-3">
              {metaBadges!.map((badge) => (
                <MetaBadge badge={badge} key={badge.id} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {primaryCta ? (
            <HeroCtaButton
              cta={primaryCta}
              icon={<ArrowRight className="h-4 w-4" aria-hidden />}
            />
          ) : (
            <HeroCtaButton
              cta={{ label: 'Book a Visit', href: '#location', style: 'primary' }}
              icon={<ArrowRight className="h-4 w-4" aria-hidden />}
            />
          )}
          {secondaryCta ? (
            <HeroCtaButton cta={secondaryCta} icon={<MapPin className="h-4 w-4" aria-hidden />} />
          ) : (
            <HeroCtaButton
              cta={{ label: 'Meet the Team', href: '#team', style: 'secondary' }}
              icon={<MapPin className="h-4 w-4" aria-hidden />}
            />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
          <div className="h-[1px] w-12 bg-white/30" />
          Swipe to explore
        </div>
      </div>
    </section>
  );
}
