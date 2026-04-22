'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '../types';

export function TopNavSegments({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const visible = items.slice(0, 4);
  return (
    <nav className="lg:hidden border-b border-border/60 bg-background">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-4 text-center text-sm">
        {visible.map((it) => {
          const active = pathname === it.href || (it.href !== '/' && pathname?.startsWith(`${it.href}/`));
          return (
            <li key={it.href} className="relative">
              <Link href={it.href} className={active ? 'block py-3 font-semibold text-primary' : 'block py-3 text-muted-foreground'}>
                {it.label}
              </Link>
              <span className={active ? 'absolute inset-x-6 -bottom-[1px] h-[2px] rounded-full bg-primary' : 'hidden'} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
