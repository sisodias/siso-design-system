"use client";

import { Utensils, MessageCircle } from 'lucide-react';
import { Button } from '@/domains/shared/components';
import type { CtaContent } from '../../types';

export default function CtaTemplate2({
  title = 'Plan Your Visit',
  subtitle = 'Choose how you want to experience Draco',
  menuHref = '/menu',
  whatsappNumber = '+6281999777138',
}: CtaContent) {
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^+\d]/g, '')}?text=Hi!%20I’d%20like%20to%20book%20a%20table`
    : undefined;

  return (
    <section className="bg-background py-14 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Utensils className="h-5 w-5 text-primary" />
              Browse the Menu
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Explore signature dishes, tasting flights, and seasonal pairings.
            </p>
            <Button asChild size="lg" className="w-full">
              <a href={menuHref ?? '/menu'}>View Menu</a>
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-foreground">
              <MessageCircle className="h-5 w-5 text-primary" />
              Talk to Our Team
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Questions about private dining or allergies? Message us directly.
            </p>
            {whatsappLink ? (
              <Button asChild size="lg" variant="outline" className="w-full">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Provide a WhatsApp number to enable messaging CTA.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
