'use client';

import Image from 'next/image';
import { useTenant } from '@/providers/TenantProvider';

import { PrimaryActionCards } from './PrimaryActionCards';
import { EnhancedHoursLocation } from './EnhancedHoursLocation';
import { SocialProof } from './SocialProof';
import { ActionOrientedSocial } from './ActionOrientedSocial';

import type { RestaurantFeatures, ContactInfo } from './types';



export function RestaurantFooterPro() {
  const tenant = useTenant();
  const currentYear = new Date().getFullYear();

  // Extract features from tenant config
  const features = (tenant.siteConfig?.features as RestaurantFeatures | undefined) ?? {};
  const contact = (features.contact as ContactInfo | undefined) ?? {};
  
  // Get delivery link for Grab
  const delivery = features.delivery as any;
  const grabFoodLink = delivery?.deepLink || delivery?.grabFood || 'https://food.grab.com/id/en/restaurant/draco-coffee-and-eatery-pemecutan-klod-delivery/3-C3Z6Y6FJBU2UGE';

  return (
    <footer className="bg-background py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          {/* Logo - 40% Bigger */}
          <div className="mb-5">
            <Image
              src="/images/tenants/draco/brand/logo/draco-main-logo.svg"
              alt={`${tenant.displayName} Logo`}
              width={270}
              height={270}
              className="h-auto w-64"
            />
          </div>

          {/* Enhanced Hours + Location with OPEN NOW */}
          <EnhancedHoursLocation address={contact.address} hours={contact.hours} />

          {/* Divider */}
          <div className="my-4 h-px w-full max-w-md bg-border/30" />

          {/* Primary Action Cards: Full-width stacked */}
          <PrimaryActionCards 
            whatsapp={contact.whatsapp} 
            grabFoodLink={grabFoodLink}
          />

          {/* Instagram - Full-width style */}
          {features.socialMedia?.instagram && (
            <ActionOrientedSocial 
              socialMedia={{ instagram: features.socialMedia.instagram }} 
            />
          )}

          {/* Social Proof & Trust */}
          <SocialProof
            rating={features.ratings?.google}
            certifications={features.certifications}
            paymentMethods={features.paymentMethods}
          />

          {/* Copyright - Compact */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © {currentYear} {tenant.displayName}. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Built with ❤️ by SISO Agency
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
