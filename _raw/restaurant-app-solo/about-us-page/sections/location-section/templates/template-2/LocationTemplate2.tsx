"use client";

import { SectionHeading } from '@/domains/shared/components';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LocationContent } from '../../types/schema';
import { getContactIcon, resolveContactHref } from '../../shared/utils/contact';

export default function LocationTemplate2(content: LocationContent) {
  const { pillText, title, subtitle, address, map, contacts, hoursSummary, operatingHours, parkingInfo } = content;

  return (
    <section className="relative overflow-hidden bg-muted/20 py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 lg:flex-row lg:items-start">
        <div className="w-full space-y-8 lg:max-w-lg">
          <SectionHeading
            pillText={pillText ?? 'Plan Your Visit'}
            title={title}
            subtitle={subtitle ?? hoursSummary}
            titleClassName="text-3xl md:text-4xl font-semibold"
            as="h2"
            centered={false}
            className="max-w-lg"
          />

          <div className="space-y-4 rounded-3xl border border-border/60 bg-background/80 p-6 backdrop-blur">
            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Address</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{address}</p>
                {parkingInfo && (
                  <p className="text-xs text-muted-foreground/70">Parking: {parkingInfo}</p>
                )}
              </div>
            </div>

            {contacts?.length ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Quick Contacts</p>
                <div className="grid gap-2">
                  {contacts.map((method) => {
                    const Icon = getContactIcon(method);
                    const href = resolveContactHref(method);
                    return (
                      <a
                        key={method.id}
                        href={href}
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noreferrer' : undefined}
                        className={cn(
                          'flex items-center gap-3 rounded-2xl border border-border/60 px-4 py-3 text-left transition',
                          'hover:border-primary/60 hover:bg-background'
                        )}
                      >
                        <span className="rounded-full bg-primary/10 p-2 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{method.label}</p>
                          <p className="truncate text-xs text-muted-foreground">{method.value}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {operatingHours?.length ? (
            <div className="rounded-3xl border border-border/60 bg-foreground text-background">
              <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
                <Clock className="h-4 w-4" />
                <p className="text-sm font-semibold uppercase tracking-[0.25em]">Service Hours</p>
              </div>
              <dl className="grid gap-3 px-6 py-5 text-sm">
                {operatingHours.map((window) => (
                  <div key={window.day} className="flex items-baseline justify-between gap-4">
                    <dt className="font-medium">{window.day}</dt>
                    <dd className="text-right text-sm">
                      {window.open} – {window.close}
                      {window.note ? <span className="block text-xs text-background/80">{window.note}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            hoursSummary && (
              <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-background/80 px-6 py-4 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                {hoursSummary}
              </div>
            )
          )}
        </div>

        <div className="w-full max-w-2xl lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[28px] border border-border/60 bg-background shadow-xl shadow-primary/10">
            <div className="relative">
              {map?.embedUrl ? (
                <iframe
                  src={map.embedUrl}
                  width="100%"
                  height="520"
                  title={`Map preview for ${title}`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[520px] w-full"
                />
              ) : (
                <div className="flex h-[520px] items-center justify-center bg-muted">
                  <div className="text-center text-muted-foreground">
                    <Phone className="mx-auto mb-4 h-10 w-10" />
                    Map embed coming soon.
                  </div>
                </div>
              )}
            </div>

            {map?.link && (
              <a
                href={map.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 border-t border-border/60 bg-background/90 px-6 py-4 text-sm font-medium text-primary transition hover:bg-background"
              >
                <span>Launch Google Maps</span>
                <Navigation className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
