'use client';

import { Phone, MessageCircle } from 'lucide-react';
import type { ContactInfo } from './types';

interface QuickContactSectionProps {
  contact: ContactInfo;
}

export function QuickContactSection({ contact }: QuickContactSectionProps) {
  const { phone, whatsapp } = contact;

  // Don't render if no contact info available
  if (!phone && !whatsapp) {
    return null;
  }

  // Format phone number for tel: link (remove spaces, dashes, parentheses)
  const formatPhoneForLink = (phoneNumber: string) => {
    return phoneNumber.replace(/[^+\d]/g, '');
  };

  return (
    <div className="mb-6 w-full max-w-md space-y-3">
      {/* Tap-to-Call Button */}
      {phone && (
        <a
          href={`tel:${formatPhoneForLink(phone)}`}
          className="flex items-center gap-3 rounded-full bg-primary/10 px-4 py-3 transition-colors hover:bg-primary/20 active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs text-muted-foreground">Call Us</p>
            <p className="text-sm font-medium">{phone}</p>
          </div>
        </a>
      )}

      {/* Tap-to-WhatsApp Button */}
      {whatsapp && (
        <a
          href={`https://wa.me/${formatPhoneForLink(whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-full bg-green-500/10 px-4 py-3 transition-colors hover:bg-green-500/20 active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
            <MessageCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs text-muted-foreground">WhatsApp Order</p>
            <p className="text-sm font-medium text-green-700">Chat Now</p>
          </div>
        </a>
      )}
    </div>
  );
}
