"use client";

import { Instagram } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/domains/shared/components";
import type { InstagramContent } from "../../types/schema";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
];

export default function InstagramPrimary({
  instagramHandle = "@yourrestaurant",
  instagramUrl = "https://instagram.com/yourrestaurant",
  incentiveText = "Follow us for exclusive offers & 10% off your first order!",
  images = DEFAULT_IMAGES,
  followerBadge = "Join 5,000+ foodies already following us",
}: InstagramContent) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pairImages = images.reduce<Array<string[]>>((groups, img, index) => {
    const groupIndex = Math.floor(index / 2);
    if (!groups[groupIndex]) {
      groups[groupIndex] = [];
    }
    groups[groupIndex]?.push(img);
    return groups;
  }, []);

  const slides = pairImages.length > 0 ? pairImages : [[images[0] ?? DEFAULT_IMAGES[0], images[1] ?? DEFAULT_IMAGES[1]]];
  const loopSlides = [...slides, ...slides];

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let animationFrame: number;

    const step = () => {
      if (!el) return;
      el.scrollLeft += 0.5;
      const maxScroll = el.scrollWidth / 2;
      if (el.scrollLeft >= maxScroll) {
        el.scrollLeft = 0;
      }
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [loopSlides.length]);

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-4 py-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            <span className="text-sm font-medium text-pink-600 dark:text-pink-400">{instagramHandle}</span>
          </div>
          <SectionHeading
            title="Follow us on Instagram"
            subtitle={incentiveText}
            titleClassName="text-3xl font-bold text-foreground sm:text-4xl"
            centered
            className="mb-3"
          />
        </div>

        <div className="relative mb-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />

          <div ref={scrollerRef} className="relative flex snap-x gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden"> 
            {loopSlides.map((pair, pairIdx) => (
              <div
                key={`${pairIdx}-${pair[0]}`}
                className="flex w-[220px] flex-shrink-0 snap-start flex-col gap-4"
              >
                {pair.map((img, idx) => {
                  const globalIndex = ((pairIdx % slides.length) * 2) + idx;
                  return (
                    <a
                      key={`${pairIdx}-${idx}`}
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-square overflow-hidden rounded-3xl border border-border/60"
                      onMouseEnter={() => setHoveredIndex(globalIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <Image
                        src={img}
                        alt={`Instagram post ${globalIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="220px"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                          hoveredIndex === globalIndex ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <div className="absolute bottom-2 left-2 rounded-full bg-black/40 p-1">
                          <Instagram className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-pink-500/25"
          >
            <Instagram className="h-5 w-5" />
            <span>Follow for 10% Off</span>
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">{followerBadge}</p>
        </div>
      </div>
    </section>
  );
}
