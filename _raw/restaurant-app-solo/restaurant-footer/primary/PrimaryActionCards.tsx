'use client';

import Image from 'next/image';
import { Button } from '@/domains/shared/components';

interface PrimaryActionCardsProps {
  whatsapp?: string;
  grabFoodLink?: string;
}

export function PrimaryActionCards({ whatsapp, grabFoodLink }: PrimaryActionCardsProps) {
  // Format phone number for WhatsApp link
  const formatPhoneForLink = (phoneNumber: string) => {
    return phoneNumber.replace(/[^+\d]/g, '');
  };

  const whatsappMessage = encodeURIComponent('Hi! I want to chat about your menu.');
  const whatsappUrl = whatsapp
    ? `https://wa.me/${formatPhoneForLink(whatsapp)}?text=${whatsappMessage}`
    : null;

  const hasGrab = !!grabFoodLink;
  const hasWhatsApp = !!whatsappUrl;
  const gridCols = hasGrab && hasWhatsApp ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <div className="mb-5 w-full max-w-md">
      {/* Side-by-side Action Cards - Professional & Clean */}
      <div className={`grid ${gridCols} gap-3`}>
        {/* Grab Order Card */}
        {grabFoodLink && (
          <div className="group relative overflow-hidden rounded-2xl bg-background border border-border/60 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg">
            <a
              href={grabFoodLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md group-hover:shadow-lg transition-all">
                <Image
                  src="/images/shared/partners/grab-food.svg"
                  alt="Grab"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Order on Grab</p>
                <p className="text-xs text-muted-foreground mt-0.5">Fast delivery</p>
              </div>
              <Button
                size="sm"
                className="w-full rounded-full bg-[#00B14F] hover:bg-[#00A046] text-white text-xs font-semibold shadow-sm"
              >
                Order Now
              </Button>
            </a>
          </div>
        )}

        {/* WhatsApp Chat Card */}
        {whatsappUrl && (
          <div className="group relative overflow-hidden rounded-2xl bg-background border border-border/60 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md group-hover:shadow-lg transition-all">
                <Image
                  src="/images/shared/icons/whatsapp.svg"
                  alt="WhatsApp"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Chat with WhatsApp</p>
                <p className="text-xs text-muted-foreground mt-0.5">Quick response</p>
              </div>
              <Button
                size="sm"
                className="w-full rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-semibold shadow-sm"
              >
                Chat Now
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
