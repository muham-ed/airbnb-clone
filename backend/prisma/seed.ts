import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Upsert Host
  const host = await prisma.user.upsert({
    where: { email: 'host@example.com' },
    update: {},
    create: {
      email: 'host@example.com',
      name: 'John Host',
      password: hashedPassword,
      role: 'HOST',
    },
  });

  // 2. Create Listing only if it doesn't exist
  // ملاحظة: بما أن Prisma لا تدعم upsert على الحقول غير الفريدة، سنستخدم منطقاً ذكياً
  const listingData = {
    title: 'Luxury Villa in Cairo',
    description: 'A beautiful villa with a pool and great view.',
    price: 150.5,
    location: 'Cairo, Egypt',
    amenities: ['Pool', 'WiFi', 'Kitchen'],
    hostId: host.id,
  };

  const existingListing = await prisma.listing.findFirst({
    where: { title: listingData.title }
  });

  if (!existingListing) {
    await prisma.listing.create({ data: listingData });
    console.log('🏠 Listing created');
  } else {
    console.log('🏠 Listing already exists, skipping');
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
