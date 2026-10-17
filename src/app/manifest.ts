import { MetadataRoute } from 'next';

// Requis pour l'export statique (build APK hors-ligne)
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Around Me — Lomé',
    short_name: 'Around Me',
    description:
      "Trouvez ce qu'il vous faut, autour de vous. Commerces et services à Lomé, Togo.",
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFF8F0',
    theme_color: '#FF7F6B',
    lang: 'fr',
    categories: ['business', 'food', 'shopping', 'travel'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
