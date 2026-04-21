"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/domains/shared/components';
import type { VenueGalleryImage } from '../../../types/schema';

export interface VenueGalleryProps {
  pillText?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  images: VenueGalleryImage[];
  showCategories?: boolean;
  compact?: boolean;
  cta?: { label: string; href: string };
}

export function VenueGallery({
  pillText = 'Our Venue',
  title,
  subtitle,
  intro,
  images,
  showCategories = true,
  compact = false,
  cta,
}: VenueGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<VenueGalleryImage | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    if (!showCategories) {
      return [] as Array<{ id: string; label: string }>;
    }

    const unique = new Map<string, string>();
    images.forEach((image) => {
      if (image.category) {
        const label = image.category.charAt(0).toUpperCase() + image.category.slice(1);
        unique.set(image.category, label);
      }
    });

    if (unique.size === 0) {
      return [] as Array<{ id: string; label: string }>;
    }

    return [{ id: 'all', label: 'All' }, ...Array.from(unique.entries()).map(([id, label]) => ({ id, label }))];
  }, [images, showCategories]);

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter((img) => img.category === activeCategory);

  return (
    <section className="bg-background py-12 px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          pillText={pillText}
          title={title}
          subtitle={compact ? (subtitle ?? 'A quick look at our space') : subtitle}
          titleClassName="text-3xl md:text-4xl font-bold"
          as="h2"
          centered
          className="mb-6"
        />

        {intro && (
          <p className="mx-auto mb-8 max-w-3xl text-center text-sm text-muted-foreground">{intro}</p>
        )}

        {showCategories && categories.length > 1 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted/80'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
          {filteredImages.map((image, index) => (
            <button
              type="button"
              key={image.id}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg text-left"
              onClick={() => setSelectedImage(image)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full bg-white/90 p-3 backdrop-blur-sm">
                    <ZoomIn className="h-6 w-6 text-black" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No images in this category yet.</p>
          </div>
        )}

        {cta && (
          <div className="mt-8 text-center">
            <a
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            className="absolute inset-0 -z-10"
            aria-label="Close image preview"
            onClick={() => setSelectedImage(null)}
          />
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-6xl"
            role="button"
            tabIndex={0}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className="h-auto w-auto max-h-[90vh] rounded-lg object-contain"
              priority
            />
            <p className="mt-4 text-center text-sm text-white/80">
              {selectedImage.caption ?? selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
