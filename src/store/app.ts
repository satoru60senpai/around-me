'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_ZONE, ZONES } from '@/data/businesses';

export type Screen = 'home' | 'results' | 'detail' | 'map' | 'favorites' | 'profile';

export interface Filters {
  maxKm: number | null;
  openNow: boolean;
  verifiedOnly: boolean;
  payments: string[];
  sort: 'distance' | 'rating';
}

export const DEFAULT_FILTERS: Filters = {
  maxKm: null,
  openNow: false,
  verifiedOnly: false,
  payments: [],
  sort: 'distance',
};

interface AppState {
  screen: Screen;
  query: string; // texte dans la barre
  submittedQuery: string; // requête active (validée)
  category: string | null;
  selectedSlug: string | null;
  filters: Filters;
  favorites: string[];
  zone: string;
  userCoords: { lat: number; lng: number };
  filterSheetOpen: boolean;

  go: (s: Screen) => void;
  search: (opts?: { q?: string; category?: string | null }) => void;
  setQuery: (q: string) => void;
  submitQuery: () => void;
  openBusiness: (slug: string) => void;
  backToResults: () => void;
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
  setFilterSheetOpen: (open: boolean) => void;
  toggleFavorite: (slug: string) => void;
  setZone: (key: string) => void;
  setUserCoords: (c: { lat: number; lng: number }) => void;
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      screen: 'home',
      query: '',
      submittedQuery: '',
      category: null,
      selectedSlug: null,
      filters: DEFAULT_FILTERS,
      favorites: [],
      zone: DEFAULT_ZONE,
      userCoords: { lat: ZONES[0].lat, lng: ZONES[0].lng },
      filterSheetOpen: false,

      go: (s) => set({ screen: s }),
      search: (opts) =>
        set({
          screen: 'results',
          query: opts?.q ?? get().query,
          submittedQuery: opts?.q !== undefined ? opts.q : get().query,
          category: opts?.category !== undefined ? opts.category : get().category,
          selectedSlug: null,
        }),
      setQuery: (q) => set({ query: q }),
      submitQuery: () => set({ submittedQuery: get().query }),
      openBusiness: (slug) => set({ screen: 'detail', selectedSlug: slug }),
      backToResults: () => set({ screen: 'results', selectedSlug: null }),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
      setFilterSheetOpen: (open) => set({ filterSheetOpen: open }),
      toggleFavorite: (slug) => {
        const { favorites } = get();
        set({
          favorites: favorites.includes(slug)
            ? favorites.filter((f) => f !== slug)
            : [...favorites, slug],
        });
      },
      setZone: (key) => {
        const z = ZONES.find((x) => x.key === key);
        if (z) set({ zone: key, userCoords: { lat: z.lat, lng: z.lng } });
      },
      setUserCoords: (c) => set({ userCoords: c }),
    }),
    {
      name: 'around-me-prefs',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ favorites: s.favorites, zone: s.zone }) as unknown as AppState,
    }
  )
);

/** Coordonnées actives : GPS si disponible, sinon zone choisie */
export function useActiveCoords() {
  const { userCoords, zone } = useApp();
  const zoneObj = ZONES.find((z) => z.key === zone);
  return { ...userCoords, zoneLabel: zoneObj?.label ?? 'Lomé' };
}
