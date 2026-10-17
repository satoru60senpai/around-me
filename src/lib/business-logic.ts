/**
 * Logique métier pure partagée entre l'API (serveur) et le fallback client (mode hors-ligne APK).
 * Lomé = fuseau UTC+0 (Afrika/Lome, sans changement d'heure).
 */
import type { Business, CategoryKey } from '@/data/businesses';
import { CATEGORIES } from '@/data/businesses';

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Distance Haversine en km */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function withMeta<T extends Business>(b: T, lat?: number, lng?: number, now = new Date()): T {
  return {
    ...b,
    distanceKm:
      lat != null && lng != null
        ? Math.round(haversineKm(lat, lng, b.lat, b.lng) * 1000) / 1000
        : undefined,
    isOpen: isOpenNow(b, now),
  };
}

/** Statut d'ouverture calculé en UTC (= heure de Lomé) */
export function isOpenNow(b: Business, now = new Date()): boolean {
  const day = now.getUTCDay(); // 0 = dimanche
  const inDays = b.daysOpen === 'mon-sun' ? true : day >= 1 && day <= 6;
  const [oh, om] = b.openTime.split(':').map(Number);
  const [ch, cm] = b.closeTime.split(':').map(Number);
  const minutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  return inDays && minutes >= oh * 60 + om && minutes < ch * 60 + cm;
}

export interface SearchParams {
  q?: string;
  category?: string | null;
  lat?: number;
  lng?: number;
  maxKm?: number | null;
  openNow?: boolean;
  verifiedOnly?: boolean;
  payments?: string[];
  sort?: 'distance' | 'rating' | string | null;
}

export function searchBusinesses<T extends Business>(
  list: T[],
  p: SearchParams,
  now = new Date()
): T[] {
  const q = normalizeText(p.q ?? '');
  const tokens = q ? q.split(' ') : [];
  let out = list.map((b) => withMeta(b, p.lat, p.lng, now));

  if (tokens.length) {
    out = out.filter((b) => {
      const hay = normalizeText(
        [
          b.name,
          b.neighborhood,
          b.address,
          b.tags.join(' '),
          b.services.join(' '),
          b.description,
          categoryLabel(b.category),
        ].join(' ')
      );
      return tokens.every((t) => hay.includes(t));
    });
  }
  if (p.category) out = out.filter((b) => b.category === p.category);
  if (p.maxKm != null) out = out.filter((b) => (b.distanceKm ?? 99) <= p.maxKm!);
  if (p.openNow) out = out.filter((b) => b.isOpen);
  if (p.verifiedOnly) out = out.filter((b) => b.verified);
  if (p.payments?.length) {
    out = out.filter((b) => p.payments!.some((pay) => b.payments.includes(pay)));
  }

  const sort = p.sort ?? 'distance';
  if (sort === 'rating') out.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
  else if (p.lat != null && p.lng != null)
    out.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
  else out.sort((a, b) => a.name.localeCompare(b.name));

  return out;
}

export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

/* ---------- Formatage FR ---------- */

export function formatDistance(km?: number): string {
  if (km == null) return '';
  if (km < 1) {
    const m = Math.max(50, Math.round((km * 1000) / 50) * 50);
    return `${m} m`;
  }
  if (km < 10) return `${km.toFixed(1).replace('.', ',')} km`;
  return `${Math.round(km)} km`;
}

function parseH(hhmm: string): number {
  const [h] = hhmm.split(':').map(Number);
  return h;
}

export function formatHoursRange(b: Business): string {
  return `${parseH(b.openTime)} h – ${parseH(b.closeTime)} h`;
}

export function formatDays(b: Business): string {
  return b.daysOpen === 'mon-sun' ? 'Lun – Dim' : 'Lun – Sam';
}

export function closesAtLabel(b: Business): string {
  return `ferme à ${parseH(b.closeTime)} h`;
}

export function opensAtLabel(b: Business): string {
  return `ouvre à ${parseH(b.openTime)} h`;
}

export function greeting(now = new Date()): string {
  const h = now.getUTCHours(); // Lomé = UTC+0
  return h >= 5 && h < 18 ? 'Bonjour' : 'Bonsoir';
}

/** Message WhatsApp pré-rempli */
export function whatsappLink(b: Business): string {
  const num = b.phoneDial.replace(/[^0-9]/g, '');
  const text = encodeURIComponent(
    `Bonjour ${b.name}, je vous contacte depuis Around Me (Lomé) au sujet de vos services. `
  );
  return `https://wa.me/${num}?text=${text}`;
}

export function mapsDirectionsLink(b: Business): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`;
}
