'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryLabel, formatDistance } from '@/lib/business-logic';
import type { Business } from '@/data/businesses';
import { useApp } from '@/store/app';
import { AroundMeChip, OpenBadge, PaymentChips, RatingLine } from './bits';

function useOpenBusiness() {
  return useApp((s) => s.openBusiness);
}

/* Variante liste (Résultats / Favoris) */
export function BusinessCard({ b, className }: { b: Business; className?: string }) {
  const openBusiness = useOpenBusiness();
  return (
    <button
      type="button"
      onClick={() => openBusiness(b.slug)}
      className={cn(
        'flex w-full items-center gap-3 rounded-3xl border border-black/5 bg-white p-3 text-left shadow-[0_4px_18px_rgba(62,39,35,0.06)] transition-transform active:scale-[0.985]',
        className
      )}
      aria-label={`Voir la fiche de ${b.name}`}
    >
      <span className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-2xl bg-sable">
        <Image src={b.image} alt={b.name} fill sizes="76px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-[13.5px] font-bold text-brun">{b.name}</span>
          <ChevronRight size={16} className="shrink-0 text-brun/25" />
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-brun-soft">
          {categoryLabel(b.category)} · {b.neighborhood} · <b className="font-semibold">{formatDistance(b.distanceKm)}</b>
        </span>
        <span className="mt-1 flex items-center gap-2">
          <OpenBadge b={b} />
          <RatingLine b={b} />
        </span>
        <span className="mt-1.5 flex flex-wrap items-center gap-1">
          <PaymentChips items={b.payments.slice(0, 3)} />
          <AroundMeChip />
          {b.verified && (
            <span className="inline-flex items-center rounded-full bg-sauge-soft px-1.5 py-0.5 text-[9.5px] font-bold text-sauge-deep">
              Vérifié
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

/* Variante mini (carrousel horizontal "Autour de moi") */
export function BusinessMiniCard({ b }: { b: Business }) {
  const openBusiness = useOpenBusiness();
  return (
    <button
      type="button"
      onClick={() => openBusiness(b.slug)}
      className="w-[150px] shrink-0 snap-start text-left transition-transform active:scale-[0.97]"
      aria-label={`Voir la fiche de ${b.name}`}
    >
      <span className="relative block h-[104px] w-full overflow-hidden rounded-2xl bg-sable shadow-[0_4px_14px_rgba(62,39,35,0.08)]">
        <Image src={b.image} alt={b.name} fill sizes="150px" className="object-cover" />
        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[9.5px] font-bold text-brun shadow-sm">
          {formatDistance(b.distanceKm) || b.neighborhood}
        </span>
      </span>
      <span className="mt-1.5 block truncate text-[12.5px] font-bold text-brun">{b.name}</span>
      <span className="block truncate text-[10.5px] text-brun-soft">
        {categoryLabel(b.category)} · {b.neighborhood}
      </span>
    </button>
  );
}

/* Squelette de chargement */
export function CardSkeleton() {
  return (
    <div className="flex w-full items-center gap-3 rounded-3xl border border-black/5 bg-white p-3">
      <div className="h-[76px] w-[76px] shrink-0 animate-pulse rounded-2xl bg-sable" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-sable" />
        <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-sable" />
        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-sable" />
      </div>
    </div>
  );
}
