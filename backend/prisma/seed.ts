import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. إنشاء حساب الأدمن
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. إنشاء حساب المضيف
  const host = await prisma.user.upsert({
    where: { email: 'host@example.com' },
    update: {},
    create: {
      email: 'host@example.com',
      name: 'محمد المضيف',
      password: hashedPassword,
      role: 'HOST',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    },
  });

  // 3. إنشاء حساب الضيف
  const guest = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      name: 'أحمد الضيف',
      password: hashedPassword,
      role: 'GUEST',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    },
  });

  // 4. إضافة عقارات نموذجية
  const listing1 = await prisma.listing.create({
    data: {
      title: 'فيلا فاخرة بإطلالة على النيل - القاهرة',
      description: 'فيلا حديثة ومجهزة بالكامل تحتوي على حمام سباحة خاص وحديقة واسعة في موقع متميز بالقاهرة.',
      price: 180,
      location: 'القاهرة، التجمع الخامس',
      latitude: 30.0444,
      longitude: 31.2357,
      maxGuests: 6,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      cleaningFee: 30,
      available: true,
      isApproved: true,
      hostId: host.id,
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      ],
      amenities: ['واي فاي', 'حمام سباحة', 'تكييف', 'موقف سيارات', 'مطبخ مجهز'],
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      title: 'شقة شاطئية مطلة على البحر - الإسكندرية',
      description: 'شقة ريفية ساحرة تقع على بعد خطوات من شاطئ البحر في الإسكندرية مع بلكونة بإطلالة مدهشة.',
      price: 95,
      location: 'الإسكندرية، المنتزه',
      latitude: 31.2001,
      longitude: 29.9187,
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      cleaningFee: 20,
      available: true,
      isApproved: true,
      hostId: host.id,
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ],
      amenities: ['واي فاي', 'تكييف', 'إطلالة على البحر', 'مصعد'],
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('🔑 Credentials for Demo / Competition:');
  console.log('   Admin: admin@example.com / password123');
  console.log('   Host:  host@example.com / password123');
  console.log('   Guest: guest@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
