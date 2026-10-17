'use client';

import { Heart, House, Map, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp, type Screen } from '@/store/app';

const TABS: Array<{ key: Screen; label: string; icon: typeof Search }> = [
  { key: 'home', label: 'Accueil', icon: House },
  { key: 'results', label: 'Recherche', icon: Search },
  { key: 'map', label: 'Carte', icon: Map },
  { key: 'favorites', label: 'Favoris', icon: Heart },
  { key: 'profile', label: 'Profil', icon: User },
];

export function BottomNav() {
  const screen = useApp((s) => s.screen);
  const go = useApp((s) => s.go);

  return (
    <nav
      aria-label="Navigation principale"
      className="relative z-30 shrink-0 border-t border-brun/5 bg-white/95 backdrop-blur-md"
    >
      <div className="grid grid-cols-5">
        {TABS.map((t) => {
          const active = screen === t.key || (screen === 'detail' && t.key === 'results');
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => go(t.key)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-0.5 pb-2 pt-2.5 text-[9.5px] font-bold transition-colors',
                active ? 'text-corail' : 'text-brun/35 hover:text-brun/60'
              )}
            >
              <Icon size={21} strokeWidth={active ? 2.4 : 2} />
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="pb-safe" />
    </nav>
  );
}
