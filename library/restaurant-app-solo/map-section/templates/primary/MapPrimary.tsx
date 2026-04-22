"use client";

import { Fragment } from "react";
import { Clock, MapPin, Navigation, MessageCircle, ParkingCircle, Phone } from "lucide-react";
import { SectionHeading } from "@/domains/shared/components";
import type { MapContent } from "../../types/schema";

function ContactIcon({ icon }: { icon?: string }) {
  if (!icon) return <Phone className="h-4 w-4" />;
  switch (icon) {
    case "phone":
      return <Phone className="h-4 w-4" />;
    case "whatsapp":
      return <MessageCircle className="h-4 w-4" />;
    case "maps":
      return <Navigation className="h-4 w-4" />;
    default:
      return <Phone className="h-4 w-4" />;
  }
}

export default function MapPrimary({
  address,
  label,
  embedUrl,
  iframeTitle,
  mapLink,
  hoursSummary,
  operatingHours,
  directions,
  parkingInfo,
  arrivalNotes,
  contacts,
}: MapContent) {
  const iframeSrc = embedUrl ?? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const title = iframeTitle ?? "Google Maps";

  const hasHours = Boolean(hoursSummary) || Boolean(operatingHours?.length);
  const hasContacts = Boolean(contacts && contacts.length > 0);
  const hasArrivalInfo = Boolean(parkingInfo) || Boolean(arrivalNotes?.length);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <SectionHeading
        pillText="Visit Us"
        title="Our Location"
        subtitle={label}
        centered={false}
        className="mb-10 max-w-2xl"
        titleClassName="text-3xl md:text-4xl font-semibold"
      />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
            <iframe
              src={iframeSrc}
              title={title}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          {mapLink && (
            <a
              href={mapLink}
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
          <div className="space-y-2 rounded-2xl border border-border bg-background/80 p-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4" />
              <h3 className="text-base font-semibold">How to Find Us</h3>
            </div>
            <p className="leading-relaxed text-foreground">{address}</p>
            {directions ? <p className="leading-relaxed">{directions}</p> : null}
          </div>

          {hasHours && (
            <div className="space-y-3 rounded-2xl border border-border bg-background/80 p-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                <h3 className="text-base font-semibold">Hours</h3>
              </div>
              {hoursSummary ? <p className="leading-relaxed">{hoursSummary}</p> : null}
              {operatingHours && operatingHours.length > 0 ? (
                <dl className="space-y-2">
                  {operatingHours.map((slot) => (
                    <Fragment key={slot.day}>
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-sm font-medium text-foreground">{slot.day}</dt>
                        <dd className="text-sm">
                          {slot.open} – {slot.close}
                        </dd>
                      </div>
                      {slot.note ? <p className="text-xs text-muted-foreground/80">{slot.note}</p> : null}
                    </Fragment>
                  ))}
                </dl>
              ) : null}
            </div>
          )}

          {hasContacts && (
            <div className="space-y-3 rounded-2xl border border-border bg-background/80 p-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4" />
                <h3 className="text-base font-semibold">Quick Actions</h3>
              </div>
              <div className="grid gap-3">
                {contacts!.map((contact) => {
                  const content = (
                    <div className="flex w-full items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{contact.label}</p>
                        {contact.description ? (
                          <p className="text-xs text-muted-foreground">{contact.description}</p>
                        ) : null}
                      </div>
                      <span className="rounded-full bg-primary/10 p-2 text-primary">
                        <ContactIcon icon={contact.icon} />
                      </span>
                    </div>
                  );

                  if (contact.href) {
                    const isExternal = contact.href.startsWith("http");
                    return (
                      <a
                        key={contact.id}
                        href={contact.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/70 px-4 py-3 transition hover:border-primary/60 hover:bg-background"
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/70 px-4 py-3"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {hasArrivalInfo && (
            <div className="space-y-2 rounded-2xl border border-border bg-background/80 p-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <ParkingCircle className="h-4 w-4" />
                <h3 className="text-base font-semibold">On Arrival</h3>
              </div>
              {parkingInfo ? <p className="leading-relaxed">{parkingInfo}</p> : null}
              {arrivalNotes && arrivalNotes.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5">
                  {arrivalNotes.map((note, index) => (
                    <li key={`${note}-${index}`}>{note}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
