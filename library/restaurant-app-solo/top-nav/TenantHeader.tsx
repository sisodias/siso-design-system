'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Phone, Utensils, Gift, MessageSquare, Star, Info, FileText, Zap } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
} from '@siso/ui/primitives/menus/shadcn-ui-navigation-menu';
import { Button } from '@siso/ui/primitives/buttons/shadcn-ui-button';
import { cn } from '@/lib/utils';
import { CORE_PUBLIC_SLUGS } from '@/lib/siteRoutes';

import { useTenant } from '@/providers/TenantProvider';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { FullScreenDrawer as MobileDrawer } from '../mobile-drawer';

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  menu: 'Menu',
  membership: 'Membership',
  reviews: 'Reviews',
  chat: 'Chat',
  promotions: 'Promotions',
  about: 'About Us',
  blog: 'Blog',
  'our-story': 'Our Story',
};

const PAGE_ICONS: Record<string, ReactNode> = {
  menu: <Utensils className="h-4 w-4" />,
  membership: <Gift className="h-4 w-4" />,
  reviews: <Star className="h-4 w-4" />,
  chat: <MessageSquare className="h-4 w-4" />,
  promotions: <Zap className="h-4 w-4" />,
  about: <Info className="h-4 w-4" />,
  blog: <FileText className="h-4 w-4" />,
  'our-story': <FileText className="h-4 w-4" />,
};

const PRIMARY_PAGES = ['menu', 'membership'];
const BADGES: Record<string, { label: string; color: string }> = {
  chat: { label: 'New', color: 'bg-green-500/10 text-green-600 font-semibold' },
};
const ARCHIVE_PAGE_SET = new Set(['gift-cards', 'orders', 'reservations', 'specials', 'contact']);
const DEFAULT_PUBLIC_PAGES = CORE_PUBLIC_SLUGS.filter((slug) => slug !== 'home');

function toTitle(label: string) {
  return label
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function TenantHeader() {
  const tenant = useTenant();
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const enabledPages = useMemo(() => {
    const rawPages = (tenant.siteConfig?.enabled_pages as string[] | undefined) ?? DEFAULT_PUBLIC_PAGES;

    const normalised = rawPages
      .map((page) => (page === 'loyalty' ? 'membership' : page))
      .map((page) => (page === 'home' ? 'home' : page))
      .map((page) => (page === 'contact' ? 'about' : page));

    const filtered = normalised.filter((page) => !ARCHIVE_PAGE_SET.has(page));
    const withPromotions = filtered.includes('promotions') ? filtered : [...filtered, 'promotions'];
    const withBlog = withPromotions.includes('blog') ? withPromotions : [...withPromotions, 'blog'];
    const unique = Array.from(new Set(withBlog));

    return unique.length > 0 ? unique : DEFAULT_PUBLIC_PAGES;
  }, [tenant.siteConfig?.enabled_pages]);

  const navItems = useMemo(
    () =>
      enabledPages
        .filter((page) => page !== 'home')
        .map((page) => ({
          key: page,
          label: PAGE_LABELS[page] ?? toTitle(page),
          href: page === 'home' ? '/' : `/${page}`,
          icon: PAGE_ICONS[page] ?? null,
          isPrimary: PRIMARY_PAGES.includes(page),
          badge: BADGES[page] ?? null,
        })),
    [enabledPages],
  );

  const primaryItems = useMemo(() => navItems.filter((item) => item.isPrimary), [navItems]);
  const discoverItems = useMemo(() => navItems.filter((item) => !item.isPrimary), [navItems]);

  const features = (tenant.siteConfig?.features as Record<string, unknown> | undefined) ?? {};
  const contactInfo = (features.contact as Record<string, string> | undefined) ?? {};
  const phoneLabel = contactInfo.phone ?? contactInfo.whatsapp ?? undefined;

  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 w-full px-3 sm:px-4 lg:px-0">
        <div className="my-3 mx-auto flex h-16 w-full max-w-full items-center justify-between rounded-full border border-white/20 bg-white/10 px-6 shadow-lg backdrop-blur-sm sm:backdrop-blur-xl sm:px-8 lg:max-w-6xl box-border overflow-hidden will-change-transform">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-left">
            {(() => {
              const features = (tenant.siteConfig?.features as Record<string, any> | undefined) ?? {};
              const brand = features.brand ?? {} as { logoUrl?: string; logo?: string; logo_path?: string; showTextWithLogo?: boolean; titleAfterLogo?: string };
              const fallbackLogo = '/images/tenants/draco/brand/logo/draco-logo.svg';
              const logoUrl: string | undefined = brand.logoUrl ?? brand.logo ?? brand.logo_path ?? fallbackLogo;
              // Only show text beside logo if explicitly enabled
              const showTextWithLogo = brand.showTextWithLogo === true;
              const titleAfterLogo: string | undefined = brand.titleAfterLogo;

              if (logoUrl) {
                return (
                  <>
                    <Image
                      src={logoUrl}
                      alt={tenant.displayName}
                      width={240}
                      height={56}
                      className="h-[63px] w-auto max-w-none lg:h-14 lg:max-w-[240px] object-contain"
                      priority
                    />
                    {showTextWithLogo ? (
                      <span
                        className="inline max-w-[38vw] truncate whitespace-nowrap uppercase text-[11px] sm:text-sm lg:text-base font-extralight leading-none tracking-[0.14em] text-white/90 drop-shadow-md"
                      >
                        {titleAfterLogo ?? tenant.displayName}
                      </span>
                    ) : null}
                  </>
                );
              }
              return (
                <span className="text-lg font-semibold uppercase tracking-tight text-white drop-shadow-md sm:text-xl">
                  {tenant.displayName}
                </span>
              );
            })()}
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(`${item.href}/`));
                  return (
                    <NavigationMenuItem key={item.key}>
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none',
                          active && 'bg-primary/10 text-primary',
                        )}
                      >
                        <Link href={item.href}>{item.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
              <NavigationMenuIndicator />
              <NavigationMenuViewport />
            </NavigationMenu>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {phoneLabel ? (
              <a
                href={`tel:${phoneLabel.replace(/[^+\\d]/g, '')}`}
                className="hidden items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground lg:flex"
              >
                <Phone className="h-4 w-4" aria-hidden />
                <span>{phoneLabel}</span>
              </a>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        restaurantName={tenant.displayName}
        tagline={(() => {
          const features = (tenant.siteConfig?.features as Record<string, any> | undefined) ?? {};
          const brand = features.brand ?? {};
          return brand.tagline;
        })()}
        logoUrl={(() => {
          const features = (tenant.siteConfig?.features as Record<string, any> | undefined) ?? {};
          const brand = features.brand ?? {};
          return brand.logoUrl ?? brand.logo ?? brand.logo_path;
        })()}
        primaryItems={primaryItems}
        discoverItems={discoverItems}
        activeHref={pathname || '/'}
        user={user}
        isAuthenticated={isAuthenticated}
        phoneLabel={phoneLabel}
        onSignOut={signOut}
        promoMessage="20% off selected dishes"
      />
    </>
  );
}
