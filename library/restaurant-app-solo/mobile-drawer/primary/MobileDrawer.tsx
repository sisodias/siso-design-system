'use client';

import { cn } from '@/lib/utils';
import { DrawerHeader } from './DrawerHeader';
import { DrawerPromoBanner } from './DrawerPromoBanner';
import { DrawerNavSection, type NavItem } from './DrawerNavSection';
import { DrawerFooter } from './DrawerFooter';
import type { User } from '@supabase/supabase-js';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  restaurantName: string;
  tagline?: string;
  logoUrl?: string;
  primaryItems: NavItem[];
  discoverItems: NavItem[];
  activeHref: string;
  user: User | null;
  isAuthenticated: boolean;
  phoneLabel?: string;
  onSignOut: () => void;
  promoMessage?: string;
}

export function MobileDrawer({
  open,
  onClose,
  restaurantName,
  tagline,
  logoUrl,
  primaryItems,
  discoverItems,
  activeHref,
  user,
  isAuthenticated,
  phoneLabel,
  onSignOut,
  promoMessage,
}: MobileDrawerProps) {

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        aria-hidden={!open}
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
          'cursor-pointer'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'absolute inset-y-0 right-0 w-[280px] rounded-l-3xl border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out sm:w-[320px]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <DrawerHeader
            restaurantName={restaurantName}
            tagline={tagline}
            logoUrl={logoUrl}
            onClose={onClose}
          />

          {promoMessage && <DrawerPromoBanner message={promoMessage} onLinkClick={onClose} />}

          {/* Nav items with sections */}
          <nav className="flex-1 overflow-y-auto px-4 py-3">
            <DrawerNavSection
              title=""
              items={primaryItems}
              activeHref={activeHref}
              startIndex={0}
              onLinkClick={onClose}
            />

            <DrawerNavSection
              title="More"
              items={discoverItems}
              activeHref={activeHref}
              startIndex={primaryItems.length}
              onLinkClick={onClose}
            />
          </nav>

          <DrawerFooter
            user={user}
            isAuthenticated={isAuthenticated}
            phoneLabel={phoneLabel}
            onSignOut={onSignOut}
          />
        </div>
      </div>
    </div>
  );
}
