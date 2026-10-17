'use client';

import { BadgeCheck, Clock, MapPin, Phone, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Business } from '@/data/businesses';
import { closesAtLabel, formatDistance } from '@/lib/business-logic';

/* ---------- Badges & chips ---------- */

export function OpenBadge({ b, className }: { b: Business; className?: string }) {
  const open = b.isOpen === true;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-bold',
        open ? 'text-sauge-deep' : 'text-destructive',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', open ? 'bg-sauge' : 'bg-destructive')} />
      {open ? `Ouvert · ${closesAtLabel(b)}` : 'Fermé'}
    </span>
  );
}

const PAY_STYLES: Record<string, string> = {
  Flooz: 'bg-[#E4EAEF] text-[#46617A]',
  TMoney: 'bg-[#FFF1DC] text-[#A2651A]',
  'Espèces': 'bg-[#F0EAE0] text-[#6B5A4C]',
  'Western Union': 'bg-[#F0EAE0] text-[#6B5A4C]',
  Ria: 'bg-[#F0EAE0] text-[#6B5A4C]',
};

export function PaymentChips({
  items,
  size = 'sm',
  className,
}: {
  items: string[];
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <span className={cn('inline-flex flex-wrap gap-1', className)}>
      {items.map((p) => (
        <span
          key={p}
          className={cn(
            'inline-flex items-center rounded-md font-semibold',
            PAY_STYLES[p] ?? 'bg-[#F0EAE0] text-[#6B5A4C]',
            size === 'sm' ? 'px-1.5 py-0.5 text-[9.5px]' : 'rounded-xl px-3 py-1.5 text-[12px]'
          )}
        >
          {p}
        </span>
      ))}
    </span>
  );
}

export function AroundMeChip({ label = 'Around Me', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-corail-soft px-2 py-0.5 text-[9.5px] font-bold text-corail-deep',
        className
      )}
    >
      {label}
    </span>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full bg-sauge-soft px-2 py-0.5 text-[10px] font-bold text-sauge-deep',
        className
      )}
    >
      <BadgeCheck size={12} />
      Vérifié
    </span>
  );
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-[10.5px] font-bold uppercase tracking-[0.18em] text-brun/45', className)}>
      {children}
    </h2>
  );
}

/* ---------- Étoiles ---------- */

export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-[1.5px]" aria-label={`Note ${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M12 2l2.9 6.26 6.6.7-4.9 4.5 1.35 6.54L12 16.77 6.05 20l1.35-6.54-4.9-4.5 6.6-.7L12 2z"
            fill={i <= Math.round(value) ? '#E8A33D' : '#EADFD2'}
          />
        </svg>
      ))}
    </span>
  );
}

export function RatingLine({ b, className }: { b: Business; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] text-brun-soft', className)}>
      <span className="font-bold text-brun">{b.rating.toFixed(1).replace('.', ',')}</span>
      <span aria-hidden>★</span>
      <span>({b.reviews} avis)</span>
    </span>
  );
}

/* ---------- Rangée d'info de la fiche ---------- */

export function InfoRow({
  icon: Icon,
  tint,
  color,
  children,
}: {
  icon: typeof MapPin;
  tint: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: tint, color }}
      >
        <Icon size={15} strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">{children}</div>
    </div>
  );
}

export const INFO_ICONS = { MapPin, Clock, Phone, Wallet };

/* ---------- Distance ---------- */

export function DistanceLabel({ b, className }: { b: Business; className?: string }) {
  const d = formatDistance(b.distanceKm);
  if (!d) return null;
  return <span className={cn('font-bold text-corail-deep', className)}>{d}</span>;
}
