'use client';

/**
 * Couche d'accès aux données : essaie l'API Next (web), puis bascule
 * automatiquement sur le dataset local embarqué (mode APK hors-ligne).
 */
import { BUSINESSES, type Business } from '@/data/businesses';
import { searchBusinesses, withMeta, type SearchParams } from '@/lib/business-logic';

async function tryJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return null; // ex: index.html renvoyé en mode APK
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function qs(p: SearchParams): string {
  const s = new URLSearchParams();
  if (p.q) s.set('q', p.q);
  if (p.category) s.set('category', p.category);
  if (p.lat != null) s.set('lat', String(p.lat));
  if (p.lng != null) s.set('lng', String(p.lng));
  if (p.maxKm != null) s.set('maxKm', String(p.maxKm));
  if (p.openNow) s.set('openNow', '1');
  if (p.verifiedOnly) s.set('verified', '1');
  if (p.payments?.length) s.set('payments', p.payments.join(','));
  if (p.sort) s.set('sort', p.sort);
  return s.toString();
}

export async function fetchBusinesses(p: SearchParams): Promise<Business[]> {
  const data = await tryJson<{ businesses: Business[] }>(`/api/businesses?${qs(p)}`);
  if (data?.businesses) return data.businesses;
  // Fallback hors-ligne : filtre local sur le dataset embarqué
  return searchBusinesses(BUSINESSES, p);
}

export async function fetchBusiness(
  slug: string,
  coords?: { lat: number; lng: number }
): Promise<Business | null> {
  const q = coords ? `?lat=${coords.lat}&lng=${coords.lng}` : '';
  const data = await tryJson<{ business: Business }>(`/api/businesses/${slug}${q}`);
  if (data?.business) return data.business;
  const b = BUSINESSES.find((x) => x.slug === slug);
  return b ? withMeta(b, coords?.lat, coords?.lng) : null;
}

export async function fetchAllWithMeta(coords?: { lat: number; lng: number }): Promise<Business[]> {
  const data = await tryJson<{ businesses: Business[] }>(`/api/businesses?lat=${coords?.lat ?? ''}&lng=${coords?.lng ?? ''}`);
  if (data?.businesses) return data.businesses;
  return BUSINESSES.map((b) => withMeta(b, coords?.lat, coords?.lng));
}
