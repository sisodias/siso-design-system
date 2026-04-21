"use client";

import Image from 'next/image';
import type { iTestimonial } from '@/components/ui/retro-testimonial';

interface TeamGlassCardProps {
  testimonial: iTestimonial;
  index: number;
}

export default function TeamGlassCard({ testimonial, index }: TeamGlassCardProps) {
  return (
    <div className="relative flex min-h-[360px] w-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card/85 px-6 py-8 shadow-xl backdrop-blur sm:w-[320px] lg:w-[360px]">
      <div className="z-10 flex items-center gap-4">
        {testimonial.imageUrl ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-primary/20">
            <Image
              src={testimonial.imageUrl}
              alt={testimonial.name}
              fill
              sizes="64px"
              className="object-cover"
              priority={index < 2}
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-lg font-semibold text-muted-foreground">
            {testimonial.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
        )}

        <div>
          <p className="text-lg font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
        </div>
      </div>

      <p className="z-10 mt-6 line-clamp-5 text-sm leading-relaxed text-muted-foreground">
        {testimonial.description}
      </p>

      <div className="z-10 mt-auto flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
        <span>#{index + 1}</span>
        <span>Team Draco</span>
      </div>

      {testimonial.imageUrl && (
        <Image
          src={testimonial.imageUrl}
          alt={testimonial.name}
          fill
          sizes="360px"
          className="absolute inset-0 -z-10 object-cover opacity-[0.08]"
        />
      )}

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/20" />
    </div>
  );
}
