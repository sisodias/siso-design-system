import type { LucideIcon } from 'lucide-react';
import { CalendarCheck, Info, Mail, MessageCircle, Phone } from 'lucide-react';
import type { LocationContactMethod } from '../../types/schema';

const iconMap: Record<LocationContactMethod['type'] | 'default', LucideIcon> = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  reservation: CalendarCheck,
  custom: Info,
  default: Info,
};

export function getContactIcon(method: LocationContactMethod): LucideIcon {
  return iconMap[method.type ?? 'default'];
}

function sanitisePhone(value: string) {
  return value.replace(/[^\d+]/g, '');
}

export function resolveContactHref(method: LocationContactMethod): string | undefined {
  if (method.href) {
    return method.href;
  }

  switch (method.type) {
    case 'phone':
      return `tel:${sanitisePhone(method.value)}`;
    case 'whatsapp': {
      const digits = sanitisePhone(method.value).replace(/^\+/, '');
      return `https://wa.me/${digits}`;
    }
    case 'email':
      return `mailto:${method.value}`;
    default:
      return undefined;
  }
}
