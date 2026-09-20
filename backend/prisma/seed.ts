import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Create Host
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

  // 2. Create Listing
  await prisma.listing.create({
    data: {
      title: 'Luxury Villa in Cairo',
      description: 'A beautiful villa with a pool and great view.',
      price: 150.5,
      location: 'Cairo, Egypt',
      amenities: ['Pool', 'WiFi', 'Kitchen'],
      hostId: host.id,
    },
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
