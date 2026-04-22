'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { X, Home, Menu, Calendar, MapPin, Star, Phone, Mail, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NavItem } from './DrawerNavSection';
import type { User } from '@supabase/supabase-js';

interface FullScreenDrawerProps {
  open: boolean;
  onClose: () => void;
  restaurantName: string;
  tagline?: string;
  primaryItems: NavItem[];
  discoverItems: NavItem[];
  activeHref: string;
  user: User | null;
  isAuthenticated: boolean;
  onSignOut: () => void;
}

// Map common navigation labels to icons
const getIconForItem = (label: string, iconProp?: ReactNode) => {
  if (iconProp) return iconProp;

  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('home')) return <Home className="h-5 w-5" />;
  if (lowerLabel.includes('menu')) return <Menu className="h-5 w-5" />;
  if (lowerLabel.includes('booking') || lowerLabel.includes('reserve')) return <Calendar className="h-5 w-5" />;
  if (lowerLabel.includes('location') || lowerLabel.includes('find')) return <MapPin className="h-5 w-5" />;
  if (lowerLabel.includes('review')) return <Star className="h-5 w-5" />;
  if (lowerLabel.includes('contact')) return <Mail className="h-5 w-5" />;
  if (lowerLabel.includes('call')) return <Phone className="h-5 w-5" />;
  if (lowerLabel.includes('promo')) return <Zap className="h-5 w-5" />;
  if (lowerLabel.includes('amp')) return <Zap className="h-5 w-5" />;

  return <Menu className="h-5 w-5" />;
};

export function FullScreenDrawer({
  open,
  onClose,
  restaurantName,
  tagline,
  primaryItems,
  discoverItems,
  activeHref,
  user,
  isAuthenticated,
  onSignOut,
}: FullScreenDrawerProps) {
  const allItems = [...primaryItems, ...discoverItems];

  // Focus and scroll-lock management for accessibility and to prevent background scroll
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      // Lock background scroll on both html and body
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      const prevBodyOverscroll = (document.body.style as any).overscrollBehavior;
      const prevBodyPosition = document.body.style.position;
      const prevBodyTop = document.body.style.top;
      const prevBodyWidth = document.body.style.width;
      const prevBodyLeft = (document.body.style as any).left;
      const prevBodyRight = (document.body.style as any).right;
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      (document.body.style as any).overscrollBehavior = 'contain';
      // iOS-safe scroll lock
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      (document.body.style as any).left = '0';
      (document.body.style as any).right = '0';

      // Focus the close button for immediate keyboard access
      closeBtnRef.current?.focus();

      // Close on ESC
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKeyDown);

      return () => {
        window.removeEventListener('keydown', onKeyDown);
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
        (document.body.style as any).overscrollBehavior = prevBodyOverscroll;
        document.body.style.position = prevBodyPosition;
        document.body.style.top = prevBodyTop;
        document.body.style.width = prevBodyWidth;
        (document.body.style as any).left = prevBodyLeft;
        (document.body.style as any).right = prevBodyRight;
        // restore scroll position
        const y = Math.abs(parseInt(prevBodyTop || '0', 10)) || scrollY;
        window.scrollTo(0, y);
      };
    }
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        role="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close navigation drawer"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClose();
          }
        }}
        aria-hidden={!open}
      />

      {/* Full-screen drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 transform transition-transform duration-500 ease-out lg:hidden',
          open ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none',
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        {/* Dark background container */}
        <div className="relative h-full w-full bg-black overflow-hidden overscroll-none">
          {/* Close button - Top right */}
          <button
            onClick={onClose}
            ref={closeBtnRef}
            className="absolute right-6 top-6 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/90 transition-all hover:text-white hover:bg-black/70 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex h-full w-full overflow-hidden">
            {/* Left side - Navigation (50% width - more space, no scrolling) */}
            <div className="flex w-[50%] flex-col justify-between px-6 py-10 sm:px-8 md:px-12 overflow-y-auto overflow-x-hidden">
              {/* Top section - Just SVG logo + tagline */}
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex flex-col gap-2">
                  {/* Draco logo - match footer lockup */}
                  <div className="w-full max-w-[220px]">
                    <Image
                      src="/images/tenants/draco/brand/logo/draco-main-logo.svg"
                      alt={restaurantName}
                      width={220}
                      height={85}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                  {/* Tagline below - properly aligned */}
                  {tagline && (
                    <p className="text-xs text-white/40 font-light leading-relaxed max-w-[200px]">
                      {tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation items - Polished spacing */}
              <nav className="space-y-1 flex-1 py-6">
                {allItems.map((item, index) => {
                  const active = activeHref === item.href ||
                    (item.href !== '/' && activeHref.startsWith(`${item.href}/`));

                  const icon = getIconForItem(item.label, item.icon);

                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'group relative flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-300',
                        'animate-in fade-in slide-in-from-left-8',
                        active
                          ? 'text-white bg-white/5'
                          : 'text-white/60 hover:text-white hover:bg-white/5',
                      )}
                      style={{
                        animationDelay: `${index * 50 + 200}ms`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      {/* Active indicator - left accent border */}
                      <span
                        className={cn(
                          'absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full bg-white transition-all duration-300',
                          active ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
                        )}
                      />

                      <span className={cn(
                        'transition-all duration-300 ease-out',
                        active
                          ? 'text-white scale-110'
                          : 'text-white/50 group-hover:text-white group-hover:scale-110 group-hover:rotate-3'
                      )}>
                        {icon}
                      </span>
                      <span className={cn(
                        'text-base font-normal tracking-wide transition-all duration-300',
                        active && 'font-medium'
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={cn(
                          'ml-auto rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider',
                          'bg-white/10 text-white/90 border border-white/20',
                          'shadow-sm'
                        )}>
                          {item.badge.label}
                        </span>
                      )}

                      {/* Hover glow effect */}
                      <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/5 transition-all duration-300 -z-10" />
                    </Link>
                  );
                })}
              </nav>

              {/* Visual separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

              {/* Footer section - Minimal user profile */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                {isAuthenticated && user ? (
                  <div className="overflow-hidden rounded-lg bg-white/5 p-2.5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white ring-1 ring-white/10">
                        {user.user_metadata?.avatar_url ? (
                          <Image
                            src={user.user_metadata.avatar_url}
                            alt={user.user_metadata?.full_name || user.email || 'User'}
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-xs">
                            {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-xs font-medium text-white">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <button
                          onClick={onSignOut}
                          className="text-[10px] text-white/40 hover:text-white/80 transition-colors flex items-center gap-0.5"
                        >
                          Sign Out <span className="text-[8px]">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-xs font-medium text-white/90 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Right side - Single large image (50% width) */}
            <div className="relative w-[50%] flex items-center justify-center overflow-hidden bg-black">
              {/*
                🎨 Full Drawer Background Image
                Vertical image optimized for full-height display
                Perfect 450x1200 dimensions for drawer
              */}
              <Image
                src="/images/shared/backgrounds/drawer-background.png"
                alt="Restaurant atmosphere"
                fill
                className="object-cover object-left"
                priority
                unoptimized
              />

              {/* Subtle left edge overlay for nav contrast */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
