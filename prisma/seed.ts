/**
 * Seed la base SQLite avec les commerces de démonstration de Lomé.
 * Usage: bun prisma/seed.ts
 */
import { PrismaClient } from '@prisma/client';
import { BUSINESSES } from '../src/data/businesses';

const db = new PrismaClient();

async function main() {
  for (const b of BUSINESSES) {
    await db.business.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        category: b.category,
        tags: JSON.stringify(b.tags),
        description: b.description,
        neighborhood: b.neighborhood,
        address: b.address,
        lat: b.lat,
        lng: b.lng,
        phone: b.phone,
        whatsapp: b.whatsapp,
        image: b.image,
        rating: b.rating,
        reviews: b.reviews,
        priceHint: b.priceHint ?? null,
        priceUpdatedDays: b.priceUpdatedDays ?? 0,
        verified: b.verified,
        openTime: b.openTime,
        closeTime: b.closeTime,
        daysOpen: b.daysOpen,
        services: JSON.stringify(b.services),
        payments: JSON.stringify(b.payments),
      },
      create: {
        slug: b.slug,
        name: b.name,
        category: b.category,
        tags: JSON.stringify(b.tags),
        description: b.description,
        neighborhood: b.neighborhood,
        address: b.address,
        lat: b.lat,
        lng: b.lng,
        phone: b.phone,
        whatsapp: b.whatsapp,
        image: b.image,
        rating: b.rating,
        reviews: b.reviews,
        priceHint: b.priceHint ?? null,
        priceUpdatedDays: b.priceUpdatedDays ?? 0,
        verified: b.verified,
        openTime: b.openTime,
        closeTime: b.closeTime,
        daysOpen: b.daysOpen,
        services: JSON.stringify(b.services),
        payments: JSON.stringify(b.payments),
      },
    });
  }
  const count = await db.business.count();
  console.log(`✓ Seed terminé : ${count} commerces dans la base.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
