import type { LucideIcon } from 'lucide-react';
import { Award, Coffee, Globe, Heart, Sprout, Star, Users } from 'lucide-react';
import type { ValuesIcon } from '../../types/schema';

export const valuesIconMap: Record<ValuesIcon, LucideIcon> = {
  sprout: Sprout,
  users: Users,
  award: Award,
  globe: Globe,
  heart: Heart,
  star: Star,
  coffee: Coffee,
};
