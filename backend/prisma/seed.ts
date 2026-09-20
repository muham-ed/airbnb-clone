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

  // 2. Upsert Guest (إضافة الـ Guest كما طلبت)
  const guest = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      name: 'Jane Guest',
      password: hashedPassword,
      role: 'GUEST',
    },
  });

  // 3. Create Listing
  const listingData = {
    title: 'Luxury Villa in Cairo',
    description: 'A beautiful villa with a pool and great view.',
    price: 150.5,
    location: 'Cairo, Egypt',
    amenities: ['Pool', 'WiFi', 'Kitchen'],
    hostId: host.id,
  };

  const existingListing = await prisma.listing.findFirst({ where: { title: listingData.title } });
  if (!existingListing) {
    await prisma.listing.create({ data: listingData });
  }

  console.log('✅ Seeding completed! (Host, Guest, and Listing are ready)');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
