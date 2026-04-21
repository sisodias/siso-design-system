'use client';

import { ShoppingBag } from 'lucide-react';

interface DeliveryPartnersProps {
  partners?: string[];
  links?: Record<string, string>; // Optional: { "GoFood": "https://gofood.link/..." }
}

// Color schemes for popular Indonesian delivery platforms
const PLATFORM_STYLES: Record<string, { bg: string; text: string; icon?: string }> = {
  GoFood: { bg: 'bg-green-600', text: 'text-green-600', icon: '🏍️' },
  GrabFood: { bg: 'bg-green-700', text: 'text-green-700', icon: '🛵' },
  ShopeeFood: { bg: 'bg-orange-600', text: 'text-orange-600', icon: '🍜' },
  // Fallback for unknown platforms
  default: { bg: 'bg-primary', text: 'text-primary', icon: '🍽️' },
};

export function DeliveryPartners({ partners, links = {} }: DeliveryPartnersProps) {
  // Don't render if no partners provided
  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 w-full max-w-md">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Order Delivery
      </p>
      <div className="grid grid-cols-3 gap-2">
        {partners.slice(0, 3).map((partner) => {
          const style = PLATFORM_STYLES[partner] || PLATFORM_STYLES.default;
          const href = links[partner] || '#'; // Use provided link or placeholder

          return (
            <a
              key={partner}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted active:scale-95"
            >
              {/* Icon placeholder - will show emoji until logos are added */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${style.bg} text-white`}
              >
                <span className="text-lg" role="img" aria-label={partner}>
                  {style.icon || <ShoppingBag className="h-5 w-5" />}
                </span>
              </div>
              <span className="text-center text-[10px] font-medium leading-tight">
                {partner}
              </span>
            </a>
          );
        })}
      </div>

      {/* Show message if more than 3 partners */}
      {partners.length > 3 && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          + {partners.length - 3} more platforms
        </p>
      )}
    </div>
  );
}
