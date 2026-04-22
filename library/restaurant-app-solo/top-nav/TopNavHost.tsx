import { getTenantFromRequest } from '@/domains/shared/hooks/useTenantServer';
import { loadTenantRuntime } from '@/lib/config/site';
import type { NavItem } from './types';
import { TopNavPills } from './primary/TopNavPills';
import { TopNavSegments } from './variant-2/TopNavSegments';
import { TopNavMoreSheet } from './variant-3/TopNavMoreSheet';

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  menu: 'Menu',
  specials: 'Specials',
  loyalty: 'Membership',
  reviews: 'Reviews',
  contact: 'Contact',
  about: 'About',
  reservations: 'Reserve',
  'gift-cards': 'Gift Cards',
};

export default async function TopNavHost() {
  const tenant = await getTenantFromRequest();
  const runtime = await loadTenantRuntime(tenant);
  const enabledRaw = ((runtime.siteConfig?.enabled_pages as string[] | undefined) ?? [
    'home',
    'menu',
    'loyalty',
    'reviews',
    'contact',
  ]);
  const enabled = enabledRaw
    .filter((p) => p !== 'home')
    .filter((p) => p !== 'specials' && p !== 'orders');

  const items: NavItem[] = enabled.map((p) => ({ href: `/${p}`, label: PAGE_LABELS[p] ?? p }));

  const variantRaw = (runtime.siteConfig as any)?.features?.topNavVariant as string | undefined;
  const variant = normalizeVariant(variantRaw);

  if (variant === 'segments') return <TopNavSegments items={items} />;
  if (variant === 'more-sheet') return <TopNavMoreSheet items={items} />;
  return <TopNavPills items={items} />; // default
}

function normalizeVariant(v?: string) {
  if (!v) return 'pills' as const;
  const map: Record<string, 'pills' | 'segments' | 'more-sheet'> = {
    '1': 'pills',
    '2': 'segments',
    '3': 'more-sheet',
    pills: 'pills',
    segments: 'segments',
    'more-sheet': 'more-sheet',
    more: 'more-sheet',
    primary: 'pills',
  };
  return map[v] ?? 'pills';
}
