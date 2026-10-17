import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Business, CategoryKey } from '@/data/businesses';
import { withMeta } from '@/lib/business-logic';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const row = await db.business.findUnique({ where: { slug } });
    if (!row) {
      return NextResponse.json({ error: 'Établissement introuvable' }, { status: 404 });
    }
    const business: Business = {
      slug: row.slug,
      name: row.name,
      category: row.category as CategoryKey,
      tags: JSON.parse(row.tags),
      description: row.description,
      neighborhood: row.neighborhood,
      address: row.address,
      lat: row.lat,
      lng: row.lng,
      phone: row.phone,
      phoneDial: row.phone.replace(/[^+0-9]/g, ''),
      whatsapp: row.whatsapp,
      image: row.image,
      rating: row.rating,
      reviews: row.reviews,
      priceHint: row.priceHint ?? undefined,
      priceUpdatedDays: row.priceUpdatedDays,
      verified: row.verified,
      openTime: row.openTime,
      closeTime: row.closeTime,
      daysOpen: row.daysOpen as Business['daysOpen'],
      services: JSON.parse(row.services),
      payments: JSON.parse(row.payments),
    };
    const lat = Number(_req.nextUrl.searchParams.get('lat'));
    const lng = Number(_req.nextUrl.searchParams.get('lng'));
    return NextResponse.json(
      {
        business:
          Number.isFinite(lat) && Number.isFinite(lng) && _req.nextUrl.searchParams.get('lat')
            ? withMeta(business, lat, lng)
            : business,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    console.error('GET /api/businesses/[slug] error', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
