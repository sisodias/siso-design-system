"use client";

import { Fragment } from 'react';
import { Clock, MapPin, Navigation, ParkingCircle, Phone } from 'lucide-react';
import { SectionHeading } from '@/domains/shared/components';
import type { LocationContactMethod, LocationContent } from '../../types/schema';
import { getContactIcon, resolveContactHref } from '../../shared/utils/contact';

function ContactLink({ method }: { method: LocationContactMethod }) {
  const Icon = getContactIcon(method);
  const href = resolveContactHref(method);

  return (
    <a
      key={method.id}
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-left transition hover:border-primary/60 hover:bg-background"
    >
      <div>
        <p className="text-sm font-medium text-foreground">{method.label}</p>
        <p className="text-sm text-muted-foreground">{method.value}</p>
      </div>
      <span className="rounded-full bg-primary/10 p-2 text-primary">
        <Icon className="h-4 w-4" />
      </span>
    </a>
  );
}

function AddressBlock({ address, directions }: { address: string; directions?: string }) {
  const addressLines = address.split('\n').filter(Boolean);

  return (
    <div className="space-y-2 rounded-2xl border border-border/60 bg-background/80 p-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-2 text-foreground">
        <MapPin className="h-4 w-4" />
        <h3 className="text-base font-semibold">How to Find Us</h3>
      </div>
      <div className="space-y-1">
        {addressLines.length > 0 ? (
          addressLines.map((line, index) => (
            <p key={`${line}-${index}`} className="leading-relaxed">
              {line}
            </p>
          ))
        ) : (
          <p className="leading-relaxed">{address}</p>
        )}
      </div>
      {directions && <p className="leading-relaxed">{directions}</p>}
    </div>
  );
}

function HoursBlock({
  summary,
  children,
}: {
  summary?: string;
  children: React.ReactNode;
}) {
  if (!summary && !children) {
    return null;
  }

  return (
    <div className="space-y-2 rounded-2xl border border-border/60 bg-background/80 p-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-2 text-foreground">
        <Clock className="h-4 w-4" />
        <h3 className="text-base font-semibold">Hours</h3>
      </div>
      {summary && <p className="leading-relaxed">{summary}</p>}
      {children}
    </div>
  );
}

export default function LocationPrimary(content: LocationContent) {
  const {
    pillText,
    title,
    subtitle,
    address,
    map,
    contacts,
    hoursSummary,
    operatingHours,
    directions,
    parkingInfo,
    notes,
  } = content;

  const hasContacts = contacts && contacts.length > 0;
  const hasHours = Boolean(hoursSummary) || Boolean(operatingHours?.length);

  return (
    <section className="bg-background py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6">
        <SectionHeading
          pillText={pillText ?? 'Find Us'}
          title={title}
          subtitle={subtitle}
          titleClassName="text-3xl md:text-4xl font-semibold"
          as="h2"
          centered={false}
          className="max-w-2xl"
        />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted/20">
              {map?.embedUrl ? (
                <iframe
                  src={map.embedUrl}
                  width="100%"
                  height="420"
                  title={`Directions to ${title}`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[420px] w-full"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center bg-muted">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="mx-auto mb-4 h-10 w-10" />
                    Map preview coming soon.
                  </div>
                </div>
              )}
            </div>

            {map?.link && (
              <a
                href={map.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition hover:opacity-80"
              >
                <Navigation className="h-4 w-4" />
                Open in Google Maps
              </a>
            )}
          </div>

          <div className="space-y-6">
            <AddressBlock address={address} directions={directions} />

            {hasHours && (
              <HoursBlock summary={hoursSummary}>
                {operatingHours && operatingHours.length > 0 && (
                  <dl className="space-y-2">
                    {operatingHours.map((slot) => (
                      <Fragment key={slot.day}>
                        <div className="flex items-baseline justify-between gap-4">
                          <dt className="text-sm font-medium text-foreground">{slot.day}</dt>
                          <dd className="text-sm text-muted-foreground">
                            {slot.open} – {slot.close}
                          </dd>
                        </div>
                        {slot.note && (
                          <p className="text-xs text-muted-foreground/80">{slot.note}</p>
                        )}
                      </Fragment>
                    ))}
                  </dl>
                )}
              </HoursBlock>
            )}

            {hasContacts && (
              <div className="space-y-3 rounded-2xl border border-border/60 bg-background/80 p-6">
                <div className="mb-2 flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4" />
                  <h3 className="text-base font-semibold">Quick Actions</h3>
                </div>
                <div className="grid gap-3">
                  {contacts!.map((method) => (
                    <ContactLink key={method.id} method={method} />
                  ))}
                </div>
              </div>
            )}

            {(parkingInfo || notes?.length) && (
              <div className="space-y-2 rounded-2xl border border-border/60 bg-background/80 p-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground">
                  <ParkingCircle className="h-4 w-4" />
                  <h3 className="text-base font-semibold">On Arrival</h3>
                </div>
                {parkingInfo && <p className="leading-relaxed">{parkingInfo}</p>}
                {notes?.length ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {notes.map((note, index) => (
                      <li key={`${note}-${index}`}>{note}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
