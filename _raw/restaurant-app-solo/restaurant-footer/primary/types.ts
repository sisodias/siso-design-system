/**
 * Type definitions for Restaurant Footer components
 */

export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  email?: string;
  hours?: string;
  address?: string;
}

export interface RestaurantFeatures {
  onlineOrdering?: boolean;
  reservations?: boolean;
  contact?: ContactInfo;
  deliveryPartners?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
  ratings?: {
    google?: {
      score: number;
      reviews: number;
    };
  };
  certifications?: {
    halal?: boolean;
    organic?: boolean;
  };
  paymentMethods?: string[];
}

export interface OperatingHours {
  display: string; // "Mon–Sun 10:00–22:00"
  // Future: structured format for dynamic "Open Now" calculation
  schedule?: {
    [key: string]: { open: string; close: string } | null;
  };
}
