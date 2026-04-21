"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/domains/shared/components";
import type { PromoContent, PromotionItem } from '../../types/schema';

const DEFAULT_PROMOTIONS: PromotionItem[] = [
  {
    day: "Monday",
    title: "BOGO Espresso Martinis",
    description: "Buy one espresso martini, get the second on the house when you join us after work.",
    timeRange: "5:00 – 7:00 PM",
    highlight: "2-for-1 Drinks",
    perks: ["Members earn 2× loyalty points"],
    imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80",
    imageAlt: "Two espresso martinis on a bar counter",
  },
  {
    day: "Tuesday",
    title: "20% Off Wood-Fired Pizzas",
    description: "All signature pies are 20% off — perfect for sharing with friends.",
    timeRange: "All day",
    highlight: "Kitchen Special",
    imageUrl: "https://images.unsplash.com/photo-1548366086-7e82f0a6c07c?w=600&q=80",
    imageAlt: "Wood-fired pizza being sliced",
  },
  {
    day: "Thursday",
    title: "Live Lounge Karaoke",
    description: "Take the stage with our house band and enjoy complimentary bar snacks between sets.",
    timeRange: "8:00 – 11:00 PM",
    highlight: "Entertainment",
    perks: ["Free entry for members", "Happy hour pricing on cocktails"],
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    imageAlt: "Singer performing under warm stage lights",
  },
  {
    day: "Friday",
    title: "Craft Beer & Bites",
    description: "Complimentary chef's bite with every draft beer ordered during the night session.",
    timeRange: "6:00 – 10:00 PM",
    highlight: "Kitchen Pairing",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    imageAlt: "Craft beers with bar snacks",
  },
  {
    day: "Saturday",
    title: "Chef's Table Tasting",
    description: "Seven-course tasting menu with limited seats — reserve ahead to secure your spot.",
    timeRange: "Seatings at 6:00 & 8:30 PM",
    highlight: "Limited Seats",
    ctaLabel: "Reserve a Table",
    ctaHref: "/reservations",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80",
    imageAlt: "Plated fine-dining dish",
  },
  {
    day: "Sunday",
    title: "Family Brunch",
    description: "Kids eat free with any adult entrée. Featuring live acoustic music from 11:00 AM.",
    timeRange: "10:00 AM – 2:00 PM",
    highlight: "Family Day",
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    imageAlt: "Brunch table spread with pancakes and fruit",
  },
];

function Pill({ label, tone = "dark" }: { label: string; tone?: "light" | "dark" }) {
  const isLight = tone === "light";
  const baseClass = cn(
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] shadow-sm backdrop-blur",
    isLight
      ? "border border-white/20 bg-white/10 text-white/85"
      : "border border-border/60 bg-background/90 text-foreground/80",
  );
  const shellClass = cn(
    "relative flex h-1 w-1 items-center justify-center rounded-full",
    isLight ? "bg-white/40" : "bg-foreground/30",
  );
  const pingClass = cn(
    "flex h-2 w-2 animate-ping items-center justify-center rounded-full",
    isLight ? "bg-white" : "bg-foreground/60",
  );
  const coreClass = cn(
    "absolute top-1/2 left-1/2 flex h-1 w-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
    isLight ? "bg-white/80" : "bg-foreground",
  );

  return (
    <span className={baseClass}>
      <span className={shellClass}>
        <span className={pingClass}>
          <span className={pingClass}></span>
        </span>
        <span className={coreClass}></span>
      </span>
      {label}
    </span>
  );
}

export default function PromoPrimary({
  pillText = 'Now Serving',
  eyebrow,
  title,
  description,
  imageUrl,
  imageAlt,
  ctaLabel,
  ctaHref,
  badge,
  schedule,
  promotions,
}: PromoContent) {
  const promotionEntries = promotions && promotions.length > 0 ? promotions : DEFAULT_PROMOTIONS;

  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-border/60 bg-background/95 px-4 pb-12 pt-14 shadow-xl shadow-primary/10 sm:px-6 sm:pt-16">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8">
          <div className="flex flex-wrap items-center gap-2 text-left">
            <Pill label={pillText ?? 'Promotions'} tone="dark" />
            {eyebrow ? (
              <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </span>
            ) : null}
          </div>

          <SectionHeading
            title={title}
            subtitle={description}
            centered={false}
            titleClassName="text-3xl font-semibold md:text-4xl"
            className="text-left"
          />

          <div className="flex flex-wrap items-center gap-2">
            {badge ? (
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {badge}
              </span>
            ) : null}
            {schedule ? <p className="text-sm text-muted-foreground">{schedule}</p> : null}
          </div>

        </div>

        {imageUrl ? (
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-muted/40">
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 320px, 100vw"
              priority
            />
          </div>
        ) : null}
      </div>

      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">This Week&apos;s Lineup</h3>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex snap-x snap-mandatory gap-4 pl-1 pr-4 sm:pl-2 sm:pr-6 [&::-webkit-scrollbar]:hidden">
            {promotionEntries.map((promo, idx) => (
              <article
                key={`${promo.day}-${promo.title}-${idx}`}
                className="group relative flex w-[240px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-sm transition hover:border-primary/40 hover:shadow-lg sm:w-[280px] md:w-[320px]"
              >
                {promo.imageUrl ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={promo.imageUrl}
                      alt={promo.imageAlt ?? promo.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 768px) 320px, 280px"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{promo.day}</p>
                      <h4 className="mt-1 text-lg font-semibold text-foreground">{promo.title}</h4>
                    </div>
                    {promo.tag ? (
                      <span className="rounded-full border border-border/60 bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {promo.tag}
                      </span>
                    ) : null}
                  </div>

                  {promo.description ? (
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {promo.timeRange ? (
                      <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                        {promo.timeRange}
                      </span>
                    ) : null}
                    {promo.highlight ? (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                        {promo.highlight}
                      </span>
                    ) : null}
                  </div>

                  {promo.perks && promo.perks.length > 0 ? (
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {promo.perks.map((perk, perkIdx) => (
                        <li key={`${promo.title}-perk-${perkIdx}`} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {promo.ctaLabel && promo.ctaHref ? (
                    <div>
                      <Link
                        href={promo.ctaHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
                      >
                        {promo.ctaLabel}
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        {ctaLabel && ctaHref ? (
          <div className="pt-2 text-center">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              {ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
