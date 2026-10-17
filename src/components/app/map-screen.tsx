'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { LocateFixed, Search } from 'lucide-react';
import { categoryLabel, formatDistance } from '@/lib/business-logic';
import type { Business } from '@/data/businesses';
import { useActiveCoords, useApp } from '@/store/app';
import { useBusinesses } from '@/hooks/use-businesses';

const MapCanvas = dynamic(() => import('./map-canvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#F2EADD]">
      <p className="animate-pulse text-[12px] font-semibold text-brun/40">Chargement de la carte…</p>
    </div>
  ),
});

export function MapScreen() {
  const search = useApp((s) => s.search);
  const openBusiness = useApp((s) => s.openBusiness);
  const submittedQuery = useApp((s) => s.submittedQuery);
  const category = useApp((s) => s.category);
  const filters = useApp((s) => s.filters);
  const coords = useActiveCoords();

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [recenterToken, setRecenterToken] = useState(0);

  const { data: businesses } = useBusinesses({
    q: submittedQuery,
    category,
    lat: coords.lat,
    lng: coords.lng,
    maxKm: filters.maxKm,
    openNow: filters.openNow,
    verifiedOnly: filters.verifiedOnly,
    payments: filters.payments,
    sort: 'distance',
  });

  const selected: Business | undefined = businesses?.find((b) => b.slug === selectedSlug);

  const contextLabel = submittedQuery
    ? `« ${submittedQuery} »`
    : category
      ? categoryLabel(category)
      : 'Rechercher autour de moi…';

  return (
    <div className="relative h-full w-full">
      <MapCanvas
        businesses={businesses ?? []}
        userCoords={{ lat: coords.lat, lng: coords.lng }}
        selectedSlug={selectedSlug}
        onSelect={setSelectedSlug}
        recenterToken={recenterToken}
      />

      {/* Recherche + recentrage */}
      <div className="absolute left-4 right-4 top-4 z-[600] flex gap-2">
        <button
          type="button"
          onClick={() => search({})}
          className="flex h-11 flex-1 items-center gap-2 rounded-full bg-white px-4 text-left shadow-[0_8px_24px_rgba(62,39,35,0.18)] ring-1 ring-black/5"
        >
          <Search size={16} className="shrink-0 text-brun-soft" />
          <span className="truncate text-[13px] font-medium text-brun/45">{contextLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => setRecenterToken(Date.now())}
          aria-label="Me recentrer sur ma position"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(62,39,35,0.18)] ring-1 ring-black/5 active:scale-95"
        >
          <LocateFixed size={18} className="text-corail" />
        </button>
      </div>

      {/* Fiche en bas */}
      <div className="absolute bottom-3 left-4 right-4 z-[600]">
        {selected ? (
          <div className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-[0_10px_30px_rgba(62,39,35,0.22)] ring-1 ring-black/5">
            <img
              src={selected.image}
              alt={selected.name}
              className="h-14 w-14 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-bold text-brun">{selected.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-brun-soft">
                <span className={selected.isOpen ? 'font-bold text-sauge-deep' : 'font-bold text-destructive'}>
                  {selected.isOpen ? 'Ouvert' : 'Fermé'}
                </span>
                {selected.distanceKm != null && <> · {formatDistance(selected.distanceKm)}</>} ·{' '}
                {selected.rating.toFixed(1).replace('.', ',')} ★
              </p>
            </div>
            <button
              type="button"
              onClick={() => openBusiness(selected.slug)}
              className="h-10 shrink-0 rounded-full bg-corail px-4 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(255,127,107,0.45)] transition-transform active:scale-95"
            >
              Voir la fiche
            </button>
          </div>
        ) : (
          <div className="mx-auto w-fit rounded-full bg-white/95 px-4 py-2 text-[11.5px] font-semibold text-brun-soft shadow-[0_8px_24px_rgba(62,39,35,0.16)] ring-1 ring-black/5">
            Touchez un marqueur pour voir le commerce
          </div>
        )}
      </div>
    </div>
  );
}
