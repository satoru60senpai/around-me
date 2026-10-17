'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { useApp } from '@/store/app';
import { captureInstall } from '@/lib/pwa';
import { BottomNav } from './bottom-nav';
import { HomeScreen } from './home-screen';
import { ResultsScreen } from './results-screen';
import { DetailScreen } from './detail-screen';
import { MapScreen } from './map-screen';
import { FavoritesScreen } from './favorites-screen';
import { ProfileScreen } from './profile-screen';

function Splash() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-3 bg-ivoire">
      <motion.span
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-corail shadow-[0_10px_30px_rgba(255,127,107,0.5)]"
      >
        {/* Cible Around Me */}
        <svg width="40" height="40" viewBox="0 0 512 512" aria-hidden>
          <g stroke="#fff" strokeWidth="26" fill="none" strokeLinecap="round">
            <circle cx="256" cy="256" r="88" />
            <path d="M256 112v46M256 354v46M112 256h46M354 256h46" />
          </g>
          <circle cx="256" cy="256" r="34" fill="#fff" />
        </svg>
      </motion.span>
      <p className="text-[17px] font-bold text-brun">
        Around <span className="text-corail">Me</span>
      </p>
    </div>
  );
}

const emptySubscribe = () => () => undefined;
/** true uniquement côté client, après hydratation */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/** Garde-fou module : ne demander la géolocalisation qu'une seule fois */
let geoRequested = false;

export default function AppShell() {
  const screen = useApp((s) => s.screen);
  const mounted = useMounted();
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
      }),
    []
  );

  useEffect(() => {
    captureInstall();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    }
    if (!mounted || geoRequested) return;
    geoRequested = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          useApp.getState().setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => undefined,
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
      );
    }
  }, [mounted]);

  if (!mounted) return <Splash />;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-dvh bg-[#F1E6D8]">
        <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-ivoire shadow-[0_0_70px_rgba(62,39,35,0.25)]">
          <main className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screen}
                className="soft-scroll absolute inset-0 overflow-y-auto overscroll-contain"
                initial={{ opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.19, ease: 'easeOut' }}
              >
                {screen === 'home' && <HomeScreen />}
                {screen === 'results' && <ResultsScreen />}
                {screen === 'detail' && <DetailScreen />}
                {screen === 'map' && <MapScreen />}
                {screen === 'favorites' && <FavoritesScreen />}
                {screen === 'profile' && <ProfileScreen />}
              </motion.div>
            </AnimatePresence>
          </main>
          {screen !== 'detail' && <BottomNav />}
        </div>
      </div>
      <Toaster position="top-center" richColors toastOptions={{ style: { fontFamily: 'inherit' } }} />
    </QueryClientProvider>
  );
}
