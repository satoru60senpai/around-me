'use client';

import { Heart, Search } from 'lucide-react';
import { useActiveCoords, useApp } from '@/store/app';
import { useAllBusinesses } from '@/hooks/use-businesses';
import { BusinessCard, CardSkeleton } from './business-card';
import { SectionLabel } from './bits';

export function FavoritesScreen() {
  const favorites = useApp((s) => s.favorites);
  const go = useApp((s) => s.go);
  const coords = useActiveCoords();
  const { data: all, isLoading } = useAllBusinesses({ lat: coords.lat, lng: coords.lng });

  const favs = (all ?? []).filter((b) => favorites.includes(b.slug));

  return (
    <div className="flex min-h-full flex-col">
      <header className="px-5 pt-6">
        <h1 className="text-[22px] font-bold text-brun">Favoris</h1>
        <p className="mt-0.5 text-[12px] text-brun-soft">
          {favorites.length === 0
            ? 'Vos commerces enregistrés apparaîtront ici'
            : `${favorites.length} commerce${favorites.length > 1 ? 's' : ''} enregistré${favorites.length > 1 ? 's' : ''}`}
        </p>
      </header>

      <section className="mt-4 flex-1 px-4 pb-6" aria-label="Liste des favoris">
        {isLoading &&
          favorites.length > 0 &&
          Array.from({ length: Math.min(3, favorites.length) }).map((_, i) => <CardSkeleton key={i} />)}

        {!isLoading && favs.length > 0 && (
          <>
            <SectionLabel className="mb-2 ml-1">À portée de main</SectionLabel>
            <div className="flex flex-col gap-3">
              {favs.map((b) => (
                <BusinessCard key={b.slug} b={b} />
              ))}
            </div>
          </>
        )}

        {!isLoading && favs.length === 0 && (
          <div className="flex h-full min-h-[380px] flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-corail-soft">
              <Heart size={26} className="text-corail" />
            </span>
            <p className="text-[14px] font-bold text-brun">Aucun favori pour le moment</p>
            <p className="text-[12px] leading-relaxed text-brun-soft">
              Appuyez sur le cœur ♥ en haut d&apos;une fiche pour retrouver facilement vos commerces
              préférés.
            </p>
            <button
              type="button"
              onClick={() => go('home')}
              className="mt-2 flex h-10 items-center gap-1.5 rounded-full bg-corail px-5 text-[12.5px] font-bold text-white shadow-[0_5px_14px_rgba(255,127,107,0.4)] active:scale-95"
            >
              <Search size={14} /> Découvrir autour de moi
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
