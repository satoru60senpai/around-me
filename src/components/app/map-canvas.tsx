'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import type { Business } from '@/data/businesses';

interface Props {
  businesses: Business[];
  userCoords: { lat: number; lng: number };
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  recenterToken: number;
}

export default function MapCanvas({ businesses, userCoords, selectedSlug, onSelect, recenterToken }: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [ready, setReady] = useState(0);

  // Init carte (une seule fois)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !divRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(divRef.current, {
        zoomControl: false,
        center: [userCoords.lat, userCoords.lng],
        zoom: 14,
        zoomSnap: 0.5,
      });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      L.marker([userCoords.lat, userCoords.lng], {
        icon: L.divIcon({ className: '', html: '<div class="am-user-dot"></div>', iconSize: [16, 16], iconAnchor: [8, 8] }),
        zIndexOffset: 600,
        interactive: false,
      }).addTo(map);
      mapRef.current = map;
      setReady((r) => r + 1);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Marqueurs des commerces
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map || !layerRef.current) return;
    layerRef.current.clearLayers();
    markersRef.current = {};
    for (const b of businesses) {
      const selected = b.slug === selectedSlug;
      const color = b.verified ? '#8AA376' : '#FF7F6B';
      const icon = L.divIcon({
        className: '',
        html: `<div class="am-pin ${selected ? 'am-pin-selected' : ''}"><svg width="30" height="38" viewBox="0 0 24 30"><path fill="${color}" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18C24 5.4 18.6 0 12 0z"/><circle cx="12" cy="12" r="4.6" fill="#fff"/></svg></div>`,
        iconSize: [30, 38],
        iconAnchor: [15, 36],
      });
      const marker = L.marker([b.lat, b.lng], { icon, zIndexOffset: selected ? 400 : 0 });
      marker.on('click', () => onSelect(b.slug));
      marker.addTo(layerRef.current);
      markersRef.current[b.slug] = marker;
    }
  }, [ready, businesses, selectedSlug, onSelect]);

  // Cadrage initial / mise à jour
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!ready || !map || !L) return;
    if (businesses.length > 0) {
      const bounds = L.latLngBounds(businesses.map((b) => [b.lat, b.lng] as [number, number]));
      bounds.extend([userCoords.lat, userCoords.lng]);
      map.fitBounds(bounds, { padding: [50, 70], maxZoom: 15, animate: true });
    } else {
      map.setView([userCoords.lat, userCoords.lng], 14, { animate: true });
    }
  }, [ready, businesses.length]);

  // Pan vers le marqueur sélectionné
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !selectedSlug) return;
    const m = markersRef.current[selectedSlug];
    if (m) map.panTo(m.getLatLng(), { animate: true });
  }, [ready, selectedSlug]);

  // Recentrage manuel
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !recenterToken) return;
    map.setView([userCoords.lat, userCoords.lng], 14, { animate: true });
  }, [recenterToken]);

  return <div ref={divRef} className="absolute inset-0" role="application" aria-label="Carte des commerces autour de moi" />;
}
