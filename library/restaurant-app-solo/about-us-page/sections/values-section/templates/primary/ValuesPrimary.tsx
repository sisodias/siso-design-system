"use client";

import type { ValuesContent } from '../../types/schema';
import { ValuesGrid } from './components/ValuesGrid';

export default function ValuesPrimary(content: ValuesContent) {
  const { pillText, title, subtitle, values } = content;

  if (!values?.length) {
    return (
      <section className="flex min-h-[30vh] items-center justify-center bg-muted/20 px-6 text-center">
        <div className="max-w-xl space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Values</p>
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Add at least one value item to render this section.
          </h2>
        </div>
      </section>
    );
  }

  return <ValuesGrid pillText={pillText} title={title} subtitle={subtitle} values={values} />;
}
