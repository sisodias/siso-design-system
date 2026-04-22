'use client';

import { Search } from 'lucide-react';

interface DrawerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function DrawerSearch({ value, onChange }: DrawerSearchProps) {
  return (
    <div className="border-b border-border/50 px-4 py-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search pages..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
