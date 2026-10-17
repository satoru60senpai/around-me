import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Business, CategoryKey } from '@/data/businesses';
import { searchBusinesses } from '@/lib/business-logic';

export const dynamic = 'force-dynamic';

interface Row {
  slug: string;
  name: string;
  category: string;
  tags: string;
  description: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp: boolean;
  image: string;
  rating: number;
  reviews: number;
  priceHint: string | null;
  priceUpdatedDays: number;
  verified: boolean;
  openTime: string;
  closeTime: string;
  daysOpen: string;
  services: string;
  payments: string;
}

function rowToBusiness(r: Row): Business {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category as CategoryKey,
    tags: JSON.parse(r.tags),
    description: r.description,
    neighborhood: r.neighborhood,
    address: r.address,
    lat: r.lat,
    lng: r.lng,
    phone: r.phone,
    phoneDial: r.phone.replace(/[^+0-9]/g, ''),
    whatsapp: r.whatsapp,
    image: r.image,
    rating: r.rating,
    reviews: r.reviews,
    priceHint: r.priceHint ?? undefined,
    priceUpdatedDays: r.priceUpdatedDays,
    verified: r.verified,
    openTime: r.openTime,
    closeTime: r.closeTime,
    daysOpen: r.daysOpen as Business['daysOpen'],
    services: JSON.parse(r.services),
    payments: JSON.parse(r.payments),
  };
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const num = (k: string): number | undefined => {
      const v = sp.get(k);
      if (v == null || v === '') return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    };

    const rows = await db.business.findMany();
    const businesses: Business[] = rows.map(rowToBusiness);

    const result = searchBusinesses(businesses, {
      q: sp.get('q') ?? undefined,
      category: sp.get('category') || null,
      lat: num('lat'),
      lng: num('lng'),
      maxKm: num('maxKm') ?? null,
      openNow: sp.get('openNow') === '1',
      verifiedOnly: sp.get('verified') === '1',
      payments: sp.get('payments') ? sp.get('payments')!.split(',').filter(Boolean) : [],
      sort: sp.get('sort') ?? 'distance',
    });

    return NextResponse.json(
      { count: result.length, businesses: result },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    console.error('GET /api/businesses error', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
