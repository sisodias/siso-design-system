'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { NavItem } from '../types';
import { BottomSheet } from '@/domains/shared/components/BottomSheet';

export function TopNavMoreSheet({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const primary = items.slice(0, 3);
  const overflow = items.slice(3);
  return (
    <div className="lg:hidden border-b border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-2">
        <ul className="flex flex-1 items-center gap-2 text-sm">
          {primary.map((it) => {
            const active = pathname === it.href || (it.href !== '/' && pathname?.startsWith(`${it.href}/`));
            return (
              <li key={it.href}>
                <Link href={it.href} className={active ? 'inline-flex rounded-md bg-primary/10 px-3 py-1.5 font-medium text-primary' : 'inline-flex rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground'}>
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {overflow.length > 0 ? (
          <button type="button" onClick={() => setOpen(true)} className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground" aria-label="More sections">
            More
          </button>
        ) : null}
      </div>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="More sections">
        <ul className="grid gap-2">
          {items.map((it) => (
            <li key={it.href}>
              <Link href={it.href} className="block rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted" onClick={() => setOpen(false)}>
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  );
}
