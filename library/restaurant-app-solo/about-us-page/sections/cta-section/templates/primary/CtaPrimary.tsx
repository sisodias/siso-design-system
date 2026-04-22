"use client";

import Image from 'next/image';
import { ExternalLink, MessageCircle, Utensils } from 'lucide-react';
import { Button, SectionHeading } from '@/domains/shared/components';
import type { CtaContent, DeliveryPartner } from '../../types';

const defaultPartners: DeliveryPartner[] = [
  {
    id: 'grabfood',
    name: 'GrabFood',
    href: 'https://food.grab.com/',
    brandColor: '#00B14F',
    initials: 'G',
  },
  {
    id: 'gofood',
    name: 'GoFood',
    href: 'https://gofood.co.id/',
    brandColor: '#EE2737',
    initials: 'G',
  },
];

export default function CtaPrimary({
  title = 'Ready to Experience Draco?',
  subtitle = 'Join us for an unforgettable dining experience',
  backgroundImage = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
  showDeliveryPartners = true,
  menuHref = '/menu',
  whatsappNumber = '+6281999777138',
  deliveryPartners,
}: CtaContent) {
  const safeMenuHref = menuHref?.trim() || '/menu';
  const partners = deliveryPartners && deliveryPartners.length > 0 ? deliveryPartners : defaultPartners;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^+\d]/g, '')}?text=Hi!%20I’d%20like%20to%20know%20more%20about%20Draco%20Coffee`
    : undefined;
  const headingPillText = undefined;

  return (
    <section className="relative overflow-hidden py-20 px-6 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <Image src={backgroundImage} alt={title} fill className="object-cover" quality={80} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center text-white">
        <SectionHeading
          pillText={headingPillText}
          title={title}
          subtitle={subtitle}
          titleClassName="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
          className="mb-10 [&>p]:!text-base md:[&>p]:!text-lg [&>p]:text-white/80"
          pillTone="light"
        />

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold">
            <a href={safeMenuHref}>
              <Utensils className="mr-2 h-5 w-5" />
              View Our Menu
            </a>
          </Button>

          {whatsappLink && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white px-8 py-6 text-base font-semibold"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Message on WhatsApp
              </a>
            </Button>
          )}
        </div>

        {showDeliveryPartners && partners.length > 0 && (
          <div className="rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
            <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-white/80">
              Order for Delivery
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {partners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.href}
                  className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 transition-all hover:border-white/40 hover:bg-white/20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: partner.brandColor ?? '#0F172A' }}
                    >
                      <span className="text-lg font-bold text-white">{partner.initials ?? partner.name.charAt(0)}</span>
                    </div>
                    <span className="font-semibold text-white">{partner.name}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/60 transition-colors group-hover:text-white/90" />
                </a>
              ))}
            </div>
            <p className="mt-6 text-xs text-white/60">All prices exclude 5% tax</p>
          </div>
        )}
      </div>
    </section>
  );
}
