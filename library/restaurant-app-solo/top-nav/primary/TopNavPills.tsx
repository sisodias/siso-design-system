'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '../types';
import { cn } from '@/lib/utils';

export function TopNavPills({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <div className="lg:hidden border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-6xl overflow-x-auto px-6">
        <ul className="-mb-px flex gap-2 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {items.map((tab) => {
            const active = pathname === tab.href || (tab.href !== '/' && pathname?.startsWith(`${tab.href}/`));
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors', active ? 'border-primary/40 bg-primary/10 text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
