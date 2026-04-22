import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { LocationVariant } from '../types';
import type { LocationContent } from '../types/schema';

const baseContacts: NonNullable<LocationContent['contacts']> = [
  {
    id: 'call',
    type: 'phone',
    label: 'Call the cafe',
    value: '0813-3840-9090',
  },
  {
    id: 'whatsapp',
    type: 'whatsapp',
    label: 'WhatsApp reservations',
    value: '+62 819-9977-7138',
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email enquiries',
    value: 'hello@dracobali.com',
  },
];

const baseHours: NonNullable<LocationContent['operatingHours']> = [
  { day: 'Monday – Thursday', open: '08:00', close: '23:00' },
  { day: 'Friday', open: '08:00', close: '24:00', note: 'Late-night music from 21:00' },
  { day: 'Saturday', open: '08:00', close: '24:00' },
  { day: 'Sunday', open: '08:00', close: '22:00' },
];

const sharedMap: NonNullable<LocationContent['map']> = {
  embedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.2!2d115.2!3d-8.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzknMDAuMCJTIDExNcKwMTInMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890',
  link:
    'https://maps.google.com/?q=Jl.+Mahendradatta+Selatan+No.7b,+Pemecutan+Klod,+Denpasar,+Bali',
};

export const locationMocks = defineSectionMocks<LocationVariant, LocationContent>('Location Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      pillText: 'Visit Draco',
      title: 'Jl. Mahendradatta Selatan No.7b',
      subtitle: 'Open daily until 11:00 PM',
      address: 'Jl. Mahendradatta Selatan No.7b, Pemecutan Klod, Denpasar, Bali 80119',
      map: sharedMap,
      contacts: baseContacts,
      hoursSummary: 'Coffee from 8am • Kitchen til late',
      operatingHours: baseHours,
      directions:
        'Look for the glowing Draco marquee across from the community garden. We are two doors down from the artisan bakery.',
      parkingInfo: 'Street parking out front plus dedicated motorcycle bays after 5 PM.',
      notes: ['Ride-hailing drop-off zone on Jalan Mahendradatta', 'Wheelchair access via the east entrance ramp'],
    },
    'template-2': {
      pillText: 'Plan Your Visit',
      title: 'Hospitality Hub in West Denpasar',
      subtitle: 'Reserve a table or drop in anytime',
      address: 'Jl. Mahendradatta Selatan No.7b, Pemecutan Klod, Denpasar, Bali 80119',
      map: sharedMap,
      contacts: [baseContacts[1], baseContacts[0]],
      parkingInfo: 'Complimentary valet on Friday and Saturday evenings.',
      hoursSummary: 'Late-night espresso bar every Friday until midnight.',
      operatingHours: baseHours,
    },
    'template-3': {
      title: 'Location Placeholder',
      subtitle: 'Swap with upcoming 21st.dev module',
      address: 'Jl. Mahendradatta Selatan No.7b, Pemecutan Klod, Denpasar, Bali 80119',
      map: sharedMap,
      contacts: baseContacts,
    },
  },
});

export type LocationMockKey = keyof typeof locationMocks;
