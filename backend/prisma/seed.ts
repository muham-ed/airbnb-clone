import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  const host = await prisma.user.upsert({
    where: { email: 'host@example.com' },
    update: {},
    create: {
      email: 'host@example.com',
      name: 'John Host',
      password: hashedPassword,
      role: 'HOST',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      name: 'Jane Guest',
      password: hashedPassword,
      role: 'GUEST',
      emailVerified: true,
    },
  });

  const existingListing = await prisma.listing.findUnique({
    where: { slug: 'luxury-villa-cairo' },
  });

  if (!existingListing) {
    await prisma.listing.create({
      data: {
        slug: 'luxury-villa-cairo',
        title: 'Luxury Villa in Cairo',
        description: 'A beautiful villa with a pool and great view.',
        type: 'VILLA',
        category: 'Luxury',
        maxGuests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2.5,
        privateBaths: 2,
        sharedBaths: 0,
        address: 'New Cairo, 5th Settlement',
        city: 'Cairo',
        country: 'Egypt',
        latitude: 30.0444,
        longitude: 31.2357,
        basePrice: 150.5,
        cleaningFee: 25,
        serviceFee: 15,
        currency: 'USD',
        minNights: 2,
        maxNights: 30,
        instantBook: true,
        cancellationPolicy: 'MODERATE',
        available: true,
        publishedAt: new Date(),
        hostId: host.id,
        images: {
          create: [
            { url: 'https://example.com/villa-1.jpg', order: 0, isCover: true },
            { url: 'https://example.com/villa-2.jpg', order: 1 },
          ],
        },
        amenities: {
          create: [
            { amenity: 'WIFI' },
            { amenity: 'POOL' },
            { amenity: 'KITCHEN' },
          ],
        },
      },
    });
    console.log('🏠 Listing created');
  } else {
    console.log('🏠 Listing already exists');
  }

  console.log('✅ Seeding completed!');
  console.log('   Host:  host@example.com / password123');
  console.log('   Guest: guest@example.com / password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });