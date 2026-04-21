"use client";

import { MapPin, Navigation } from 'lucide-react';
import { SectionHeading } from '@/domains/shared/components';

export interface LocationContactProps {
  title?: string;
  subtitle?: string;
  address: string;
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  directions?: string;
  parkingInfo?: string;
}

export function LocationContact({
  title = "Visit Us",
  subtitle = "We’re open and ready to serve you",
  address,
  googleMapsUrl,
  googleMapsEmbedUrl,
  phone: _phone,
  whatsapp: _whatsapp,
  email: _email,
  directions,
  parkingInfo,
}: LocationContactProps) {
  return (
    <section className="bg-background py-16 px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <SectionHeading
          pillText="Find Us"
          title={title}
          subtitle={subtitle}
          titleClassName="text-3xl md:text-4xl font-bold"
          as="h2"
          centered={true}
          className="mb-8"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Map Section */}
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
              {googleMapsEmbedUrl ? (
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map directions to ${title}`}
                  className="w-full"
                />
              ) : (
                <div className="flex h-[450px] items-center justify-center bg-muted">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Map loading...</p>
                  </div>
                </div>
              )}
            </div>

            {googleMapsUrl && (
              <div className="mt-4">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Navigation className="h-4 w-4" />
                  Open in Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Contact Info Section */}
          <div className="order-1 lg:order-2 space-y-4">
            {/* Additional Info (black cards): include address + how to find us + parking */}
            {(address || directions || parkingInfo) && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black p-6 text-white">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">
                    How to Find Us
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {address}
                  </p>
                  {directions && (
                    <p className="mt-2 text-sm text-white/80 leading-relaxed">
                      {directions}
                    </p>
                  )}
                </div>
                {parkingInfo && (
                  <div className="rounded-2xl border border-white/10 bg-black p-6 text-white">
                    <h4 className="mb-2 text-sm font-semibold text-foreground">
                      Parking
                    </h4>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {parkingInfo}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
