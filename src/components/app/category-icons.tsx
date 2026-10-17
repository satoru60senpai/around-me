import {
  Banknote,
  Briefcase,
  Bus,
  Coffee,
  HeartPulse,
  Scissors,
  ShoppingBag,
  Smartphone,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryKey } from '@/data/businesses';

export const CATEGORY_ICONS: Record<CategoryKey, LucideIcon> = {
  manger: UtensilsCrossed,
  cafe: Coffee,
  acheter: ShoppingBag,
  argent: Banknote,
  services: Briefcase,
  beaute: Scissors,
  telephone: Smartphone,
  reparation: Wrench,
  sante: HeartPulse,
  transport: Bus,
};
