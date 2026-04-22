'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: { label: string; color: string } | null;
  isPrimary?: boolean;
}

interface DrawerNavSectionProps {
  title: string;
  items: NavItem[];
  activeHref: string;
  startIndex?: number;
  onLinkClick?: () => void;
}

export function DrawerNavSection({
  title,
  items,
  activeHref,
  startIndex = 0,
  onLinkClick,
}: DrawerNavSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      {title && (
        <h3 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      <ul className="flex flex-col gap-0.5">
        {items.map((item, index) => {
          const active =
            activeHref === item.href ||
            (item.href !== '/' && activeHref.startsWith(`${item.href}/`));

          const isPrimary = item.isPrimary ?? false;

          return (
            <li
              key={item.key}
              className="animate-in fade-in slide-in-from-right-2"
              style={{ animationDelay: `${(startIndex + index) * 30}ms`, animationFillMode: 'backwards' }}
            >
              <Link
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 overflow-hidden rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-primary/10 text-primary'
                    : isPrimary
                    ? 'text-foreground hover:bg-muted/70'
                    : 'text-foreground/70 hover:bg-muted/70 hover:text-foreground',
                )}
                onClick={onLinkClick}
              >
                {/* Active left border indicator */}
                <span
                  className={cn(
                    'absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary transition-all duration-300',
                    active ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'transition-colors',
                    active ? 'text-primary' : isPrimary ? 'text-primary/70' : 'text-muted-foreground',
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                      item.badge.color,
                    )}
                  >
                    {item.badge.label}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
