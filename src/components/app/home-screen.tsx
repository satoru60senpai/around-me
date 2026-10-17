'use client';

import { ArrowRight, ChevronDown, MapPin, Search } from 'lucide-react';
import { CATEGORIES, POPULAR_SEARCHES } from '@/data/businesses';
import { greeting } from '@/lib/business-logic';
import { useActiveCoords, useApp } from '@/store/app';
import { useBusinesses } from '@/hooks/use-businesses';
import { CATEGORY_ICONS } from './category-icons';
import { BusinessMiniCard, CardSkeleton } from './business-card';
import { SectionLabel } from './bits';

export function HomeScreen() {
  const search = useApp((s) => s.search);
  const go = useApp((s) => s.go);
  const zone = useApp((s) => s.zone);
  const coords = useActiveCoords();
  // Rendu client uniquement (l'app se monte après hydratation) → pas de risque de mismatch
  const g = greeting();

  const { data: nearby, isLoading } = useBusinesses({
    lat: coords.lat,
    lng: coords.lng,
    sort: 'distance',
  });

  return (
    <div className="flex min-h-full flex-col">
      {/* En-tête zone + profil */}
      <header className="flex items-center justify-between px-5 pt-5">
        <div>
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-brun/45">
            <MapPin size={11} className="text-corail" /> Votre zone
          </p>
          <button
            type="button"
            onClick={() => go('profile')}
            className="mt-0.5 flex items-center gap-1 text-[15px] font-bold text-brun"
          >
            Lomé · {coords.zoneLabel}
            <ChevronDown size={14} className="text-brun-soft" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => go('profile')}
          aria-label="Mon profil"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-corail to-corail-deep text-[15px] font-bold text-white shadow-[0_4px_12px_rgba(255,127,107,0.45)]"
        >
          K
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-sauge" />
        </button>
      </header>

      {/* Accroche + recherche */}
      <section className="px-5 pt-4" aria-label="Recherche">
        <p className="text-[13.5px] font-medium text-brun-soft">{g}, Koffi 👋</p>
        <h1 className="mt-1 text-[27px] font-bold leading-[1.12] text-brun">
          Qu&apos;est-ce qu&apos;il
          <br />
          te faut&nbsp;?
        </h1>
        <button
          type="button"
          onClick={() => search({})}
          className="mt-4 flex h-12 w-full items-center gap-2.5 rounded-full bg-white px-4 text-left shadow-[0_6px_20px_rgba(62,39,35,0.07)] ring-1 ring-black/5 transition-transform active:scale-[0.99]"
        >
          <Search size={17} className="shrink-0 text-brun-soft" />
          <span className="truncate text-[13.5px] text-brun/35">Réparation téléphone, café…</span>
        </button>
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-0.5" aria-label="Recherches populaires">
          {POPULAR_SEARCHES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => search({ q: s })}
              className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-brun-soft ring-1 ring-black/5 active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Catégories */}
      <section className="mt-6 px-5" aria-label="Catégories">
        <SectionLabel>Catégories</SectionLabel>
        <div className="mt-3 grid grid-cols-5 gap-2.5">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.key];
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => search({ category: c.key, q: '' })}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl transition-transform active:scale-95"
                style={{ backgroundColor: c.tint }}
                aria-label={`Catégorie ${c.label}`}
              >
                <Icon size={19} style={{ color: c.fg }} strokeWidth={2.1} />
                <span className="text-[9.5px] font-bold leading-none" style={{ color: c.fg }}>
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Autour de moi */}
      <section className="mt-7 flex-1" aria-label="Autour de moi">
        <div className="flex items-center justify-between px-5">
          <SectionLabel>Autour de moi</SectionLabel>
          <button
            type="button"
            onClick={() => go('map')}
            className="flex items-center gap-1 text-[11.5px] font-bold text-corail active:opacity-70"
          >
            Voir la carte <ArrowRight size={13} />
          </button>
        </div>
        <div className="no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[150px] shrink-0">
                <div className="h-[104px] animate-pulse rounded-2xl bg-sable" />
                <div className="mt-2 h-3 w-3/4 animate-pulse rounded-full bg-sable" />
                <div className="mt-1.5 h-2.5 w-1/2 animate-pulse rounded-full bg-sable" />
              </div>
            ))}
          {nearby?.slice(0, 8).map((b) => <BusinessMiniCard key={b.slug} b={b} />)}
        </div>
      </section>

      {/* Disclaimer (maquette) */}
      <footer className="mt-auto px-5 pb-4 pt-6">
        <p className="text-[9.5px] leading-relaxed text-brun/35">
          ⚠️ Données de démonstration uniquement. Les commerces, numéros, avis et prix affichés sont
          fictifs et ne représentent aucun établissement réel. Conforme à l&apos;exigence du cahier
          des charges.
        </p>
      </footer>
    </div>
  );
}
