import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.review.deleteMany().catch(() => {});
  await prisma.payment.deleteMany().catch(() => {});
  await prisma.booking.deleteMany().catch(() => {});
  await prisma.wishlistItem.deleteMany().catch(() => {});
  await prisma.wishlist.deleteMany().catch(() => {});
  await prisma.listing.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const host = await prisma.user.create({
    data: {
      email: 'host@example.com',
      name: 'محمد المضيف',
      password: hashedPassword,
      role: 'HOST',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    },
  });

  const guest = await prisma.user.create({
    data: {
      email: 'guest@example.com',
      name: 'أحمد الضيف',
      password: hashedPassword,
      role: 'GUEST',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    },
  });

  // 2. Create 7 Rich Properties
  const listingsData = [
    {
      title: 'فيلا فاخرة بإطلالة على النيل - القاهرة',
      description: 'فيلا حديثة ومجهزة بالكامل تحتوي على حمام سباحة خاص وحديقة واسعة في موقع متميز بالتجمع الخامس بالقاهرة.',
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
    {
      title: 'شقة شاطئية مطلة على البحر - الإسكندرية',
      description: 'شقة ريفية ساحرة تقع على بعد خطوات من شاطئ البحر في الإسكندرية مع بلكونة بإطلالة مدهشة على الغروب.',
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
    {
      title: 'شالية مودرن في الجونة - البحر الأحمر',
      description: 'شالية فاخر يطل على البحيرة الكريستالية بالجونة مباشرة، مجهز بجميع أجهزة الترفيه والتكييف المركزي.',
      price: 220,
      location: 'البحر الأحمر، الجونة',
      latitude: 27.3949,
      longitude: 33.6782,
      maxGuests: 5,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
      cleaningFee: 40,
      available: true,
      isApproved: true,
      hostId: host.id,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
      amenities: ['واي فاي', 'حمام سباحة', 'تكييف', 'شاطئ خاص', 'شاشة 65 بوصة'],
    },
    {
      title: 'شقة تاريخية بقلب الزمالك - القاهرة',
      description: 'شقة ذات طراز معماري كلاسيكي فريد بإطلالة على أشجار الزمالك الهادئة ومحيطة بأفضل الكافيهات والمطاعم.',
      price: 110,
      location: 'القاهرة، الزمالك',
      latitude: 30.0626,
      longitude: 31.2210,
      maxGuests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      cleaningFee: 15,
      available: true,
      isApproved: true,
      hostId: host.id,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800',
      ],
      amenities: ['واي فاي', 'تكييف', 'مكتب عمل', 'مصعد'],
    },
    {
      title: 'جناح بوهيمي ساحر في دهب - جنوب سيناء',
      description: 'جناح مميز يدمج الطراز البدوي مع الديكور العصري، على بعد 5 دقائق من الممشى السياحي ومنطقة الثري بولز.',
      price: 65,
      location: 'جنوب سيناء، دهب',
      latitude: 28.5097,
      longitude: 34.5136,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      cleaningFee: 10,
      available: true,
      isApproved: true,
      hostId: host.id,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      ],
      amenities: ['واي فاي', 'تكييف', 'جلسة خارجية', 'مطبخ كامل'],
    },
    {
      title: 'فيلا مستقلة بحمام سباحة دافئ - الشيخ زايد',
      description: 'فيلا راقية بحديقة واسعة وحمام سباحة مغطى ومكيف، مناسبة جداً للعائلات والمناسبات الخاصة.',
      price: 250,
      location: 'الجيزة، الشيخ زايد',
      latitude: 30.0125,
      longitude: 30.9822,
      maxGuests: 8,
      bedrooms: 4,
      beds: 5,
      bathrooms: 3,
      cleaningFee: 50,
      available: true,
      isApproved: true,
      hostId: host.id,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      ],
      amenities: ['واي فاي', 'حمام سباحة دافئ', 'موقف سيارات مغطى', 'شواية باربيكيو'],
    },
    {
      title: 'استوديو أنيق قريب من مطار القاهرة الدولي',
      description: 'استوديو هادئ وحديث ومجهز بالكامل، يبعد 10 دقائق فقط عن مطار القاهرة الدولي ومراكز التسوق بالشرقية.',
      price: 75,
      location: 'القاهرة، مصر الجديدة',
      latitude: 30.0911,
      longitude: 31.3236,
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      cleaningFee: 15,
      available: true,
      isApproved: true,
      hostId: host.id,
      images: [
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
      ],
      amenities: ['واي فاي', 'تكييف', 'شاشة سمارت', 'مطبخ صغير'],
    },
  ];

  const createdListings = [];
  for (const lData of listingsData) {
    const listing = await prisma.listing.create({ data: lData });
    createdListings.push(listing);
  }

  // 3. Create Bookings (Confirmed & Pending)
  const booking1 = await prisma.booking.create({
    data: {
      listingId: createdListings[0].id,
      guestId: guest.id,
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-15'),
      totalPrice: 930,
      status: 'confirmed',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      stripeSessionId: `cs_test_mock_${Date.now()}_1`,
      amount: 930,
      status: 'succeeded',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      listingId: createdListings[1].id,
      guestId: guest.id,
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-04'),
      totalPrice: 305,
      status: 'pending',
    },
  });

  // 4. Create Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'إقامة رائعة جداً! الفيلا نظيفة وحمام السباحة ممتاز والمضيف محمد كان متعاوناً للغاية.',
      userId: guest.id,
      listingId: createdListings[0].id,
      bookingId: booking1.id,
    },
  });

  // 5. Create Wishlist
  const wishlist = await prisma.wishlist.create({
    data: {
      userId: guest.id,
      name: 'رحلات الشتاء المفضلة 🌴',
    },
  });

  await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      listingId: createdListings[2].id,
    },
  });

  await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      listingId: createdListings[4].id,
    },
  });

  console.log('✅ Seeding completed successfully with 7 listings, 2 bookings, reviews, and wishlists!');
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
