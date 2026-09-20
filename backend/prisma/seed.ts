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

  // 2. Upsert Listing (باستخدام العنوان كمعرف فريد للـ seed فقط)
  const listingTitle = 'Luxury Villa in Cairo';
  const existingListing = await prisma.listing.findFirst({ where: { title: listingTitle } });

  if (!existingListing) {
    await prisma.listing.create({
      data: {
        title: listingTitle,
        description: 'A beautiful villa with a pool and great view.',
        price: 150.5,
        location: 'Cairo, Egypt',
        amenities: ['Pool', 'WiFi', 'Kitchen'],
        hostId: host.id,
      },
    });
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
