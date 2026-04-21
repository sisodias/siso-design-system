"use client";

import Image from 'next/image';
import type { HeroContent } from '../../types/schema';

export default function HeroTemplateThree({ title, subtitle, imageUrl }: HeroContent) {
  return (
    <section className="relative grid min-h-[65vh] w-full grid-cols-1 overflow-hidden bg-background md:grid-cols-2">
      <div className="relative order-2 h-full md:order-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        <div className="relative mx-auto flex h-full flex-col justify-center px-8 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">
            {subtitle ?? 'Template Three'}
          </p>
          <h1 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">
            {title ?? 'Design in progress'}
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            This layout splits copy and imagery, perfect for highlighting a featured dish or signature drink beside rich storytelling.
          </p>
        </div>
      </div>
      <div className="relative order-1 h-60 md:order-2 md:h-auto">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title ?? 'Hero imagery'}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">Swap in photography</span>
          </div>
        )}
      </div>
    </section>
  );
}
