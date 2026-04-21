"use client";

import type { VenueGalleryContent } from '../../types/schema';
import { VenueGallery } from './components/VenueGallery';

export default function VenueGalleryPrimary(content: VenueGalleryContent) {
  const { pillText, title, subtitle, intro, images, showCategories, cta } = content;

  if (!images.length) {
    return (
      <section className="flex min-h-[30vh] items-center justify-center bg-muted/30 px-6 text-center">
        <p className="max-w-lg text-sm text-muted-foreground">
          Add gallery images to preview this section.
        </p>
      </section>
    );
  }

  return (
    <VenueGallery
      pillText={pillText}
      title={title}
      subtitle={subtitle}
      intro={intro}
      images={images}
      showCategories={showCategories}
      cta={cta ?? undefined}
    />
  );
}
