'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/domains/shared/components';

interface WhatsAppSubscribeProps {
  whatsapp?: string;
  subscriberCount?: number;
}

export function WhatsAppSubscribe({ whatsapp, subscriberCount }: WhatsAppSubscribeProps) {
  // Don't render if no WhatsApp number provided
  if (!whatsapp) {
    return null;
  }

  // Format phone number for WhatsApp link
  const formatPhoneForLink = (phoneNumber: string) => {
    return phoneNumber.replace(/[^+\d]/g, '');
  };

  const subscribeMessage = encodeURIComponent(
    'Hi! I want to subscribe to daily specials and exclusive deals.'
  );
  const whatsappUrl = `https://wa.me/${formatPhoneForLink(whatsapp)}?text=${subscribeMessage}`;

  return (
    <div className="mb-6 w-full max-w-md rounded-2xl bg-primary/5 p-4">
      <p className="mb-2 text-sm font-semibold">Get Daily Specials via WhatsApp</p>
      <p className="mb-3 text-xs text-muted-foreground">
        {subscriberCount
          ? `Join ${subscriberCount.toLocaleString()}+ customers getting exclusive deals`
          : 'Get exclusive deals delivered straight to your WhatsApp'}
      </p>
      <Button
        asChild
        className="w-full gap-2 rounded-full bg-green-600 hover:bg-green-700"
        size="lg"
      >
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4" />
          Subscribe via WhatsApp
        </a>
      </Button>
    </div>
  );
}
