'use client';

import { useState } from 'react';
import { ChevronLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '@/data/businesses';
import { categoryLabel } from '@/lib/business-logic';
import { useActiveCoords, useApp } from '@/store/app';
import { useBusinesses } from '@/hooks/use-businesses';
import { BusinessCard, CardSkeleton } from './business-card';
import { FilterSheet } from './filter-sheet';
import { SectionLabel } from './bits';

export function ResultsScreen() {
  const query = useApp((s) => s.query);
  const setQuery = useApp((s) => s.setQuery);
  const submitQuery = useApp((s) => s.submitQuery);
  const submittedQuery = useApp((s) => s.submittedQuery);
  const category = useApp((s) => s.category);
  const search = useApp((s) => s.search);
  const go = useApp((s) => s.go);
  const filters = useApp((s) => s.filters);
  const setFilters = useApp((s) => s.setFilters);
  const setFilterSheetOpen = useApp((s) => s.setFilterSheetOpen);
  const coords = useActiveCoords();

  const [inputFocused, setInputFocused] = useState(false);

  const { data: businesses, isLoading } = useBusinesses({
    q: submittedQuery,
    category,
    lat: coords.lat,
    lng: coords.lng,
    maxKm: filters.maxKm,
    openNow: filters.openNow,
    verifiedOnly: filters.verifiedOnly,
    payments: filters.payments,
    sort: filters.sort,
  });

  const activeFilters: Array<{ label: string; clear: () => void }> = [];
  if (filters.maxKm != null)
    activeFilters.push({ label: `Moins de ${filters.maxKm} km`, clear: () => setFilters({ maxKm: null }) });
  if (filters.openNow) activeFilters.push({ label: 'Ouvert', clear: () => setFilters({ openNow: false }) });
  if (filters.verifiedOnly)
    activeFilters.push({ label: 'Vérifiés', clear: () => setFilters({ verifiedOnly: false }) });
  filters.payments.forEach((p) =>
    activeFilters.push({
      label: p,
      clear: () => setFilters({ payments: filters.payments.filter((x) => x !== p) }),
    })
  );

  const filterActive =
    filters.maxKm != null || filters.openNow || filters.verifiedOnly || filters.payments.length > 0;

  return (
    <div className="flex min-h-full flex-col">
      {/* Barre de recherche */}
      <header className="sticky top-0 z-20 bg-ivoire/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go('home')}
            aria-label="Retour à l'accueil"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brun shadow-[0_4px_14px_rgba(62,39,35,0.08)] ring-1 ring-black/5 active:scale-95"
          >
            <ChevronLeft size={19} />
          </button>
          <form
            className="relative flex-1"
            onSubmit={(e) => {
              e.preventDefault();
              submitQuery();
              (document.activeElement as HTMLElement)?.blur();
            }}
          >
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brun-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Réparation téléphone, café…"
              aria-label="Rechercher un commerce"
              className="h-10 w-full rounded-full bg-white pl-9 pr-9 text-[13px] font-medium text-brun shadow-[0_4px_14px_rgba(62,39,35,0.08)] ring-1 ring-black/5 outline-none placeholder:text-brun/30 focus:ring-2 focus:ring-corail/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  search({ q: '' });
                }}
                aria-label="Effacer la recherche"
                className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-brun/10 text-brun/50"
              >
                <X size={11} />
              </button>
            )}
          </form>
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            aria-label="Ouvrir les filtres"
            className={
              filterActive
                ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brun text-white shadow-md active:scale-95'
                : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brun shadow-[0_4px_14px_rgba(62,39,35,0.08)] ring-1 ring-black/5 active:scale-95'
            }
          >
            <SlidersHorizontal size={17} />
          </button>
        </div>

        {/* Chips filtres actifs + catégorie */}
        {(activeFilters.length > 0 || category) && (
          <div className="no-scrollbar mt-2.5 flex gap-1.5 overflow-x-auto">
            {category && (
              <button
                type="button"
                onClick={() => search({ category: null })}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-corail-soft px-2.5 py-1 text-[10.5px] font-bold text-corail-deep"
              >
                {categoryLabel(category)} <X size={10} />
              </button>
            )}
            {activeFilters.map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={f.clear}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold text-brun-soft ring-1 ring-black/5"
              >
                {f.label} <X size={10} />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Compteur */}
      <div className="px-5 pt-1">
        <p className="text-[11.5px] text-brun-soft">
          <b className="text-brun">
            {isLoading ? '…' : businesses?.length ?? 0}{' '}
            {(businesses?.length ?? 0) > 1 ? 'résultats' : 'résultat'}
          </b>{' '}
          à proximité · triés par {filters.sort === 'distance' ? 'distance' : 'note'}
        </p>
      </div>

      {/* Liste */}
      <section className="mt-3 flex-1 px-4 pb-8" aria-label="Résultats de recherche">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && businesses && businesses.length > 0 && (
          <div className="flex flex-col gap-3">
            {businesses.map((b) => (
              <BusinessCard key={b.slug} b={b} />
            ))}
          </div>
        )}

        {!isLoading && businesses?.length === 0 && (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sable">
              <Search size={24} className="text-brun/35" />
            </span>
            <p className="text-[14px] font-bold text-brun">
              Aucun résultat {submittedQuery ? `pour « ${submittedQuery} »` : ''}
            </p>
            <p className="text-[12px] leading-relaxed text-brun-soft">
              Essayez un autre mot-clé ou élargissez vos filtres — il y a sûrement ce qu&apos;il vous
              faut un peu plus loin 😉
            </p>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => search({ q: '' })}
                className="h-10 rounded-full bg-corail px-5 text-[12.5px] font-bold text-white shadow-[0_5px_14px_rgba(255,127,107,0.4)] active:scale-95"
              >
                Voir tout autour
              </button>
              <button
                type="button"
                onClick={() => go('map')}
                className="h-10 rounded-full border border-brun/15 bg-white px-5 text-[12.5px] font-bold text-brun active:scale-95"
              >
                Ouvrir la carte
              </button>
            </div>
          </div>
        )}

        {!isLoading && businesses && businesses.length > 0 && (
          <p className="mt-4 text-center text-[9.5px] leading-relaxed text-brun/35">
            Données de démonstration — commerces fictifs.
          </p>
        )}
      </section>

      <FilterSheet />
    </div>
  );
}
