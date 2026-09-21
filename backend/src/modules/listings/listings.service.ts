import prisma from '../../shared/config/database';
import { CreateListingInput, UpdateListingInput, SearchListingsInput } from './listings.schema';
import { AppError } from '../../shared/utils/app-error';

export class ListingsService {
  async getAllListings(filters: SearchListingsInput['query']) {
    const { maxPrice, minPrice, location, startDate, endDate, lat, lng, radius } = filters;

    // 1. البحث الجغرافي الآمن (إصلاح القاتل الجديد)
    if (lat && lng && radius) {
      // استخدام $queryRaw مع Template Literal لمنع الـ SQL Injection تلقائياً
      return prisma.$queryRaw`
        SELECT *,
          (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) AS distance
        FROM "Listing"
        WHERE available = true
        GROUP BY id
        HAVING (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) <= ${radius}
        ORDER BY distance ASC
      `;
    }

    // 2. الفلترة العادية
    let availabilityFilter = {};
    if (startDate && endDate) {
      availabilityFilter = {
        bookings: {
          none: {
            status: { in: ['pending', 'confirmed'] },
            OR: [
              { startDate: { lt: endDate, gte: startDate } },
              { endDate: { gt: startDate, lte: endDate } },
              { startDate: { lte: startDate }, endDate: { gte: endDate } }
            ]
          }
        }
      };
    }

    return prisma.listing.findMany({
      where: {
        available: true,
        ...availabilityFilter,
        price: {
          lte: maxPrice,
          gte: minPrice,
        },
        location: location ? { contains: location, mode: 'insensitive' } : undefined,
      },
      include: {
        host: { select: { name: true, avatar: true } },
        _count: { select: { reviews: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getListingById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, name: true, avatar: true, email: true } },
        reviews: { include: { user: { select: { name: true, avatar: true } } } }
      },
    });
    if (!listing) throw new AppError('العقار غير موجود', 404, 'NOT_FOUND');
    return listing;
  }

  async createListing(data: CreateListingInput['body'] & { images: string[] }, hostId: string) {
    return prisma.listing.create({
      data: { ...data, hostId },
    });
  }

  async updateListing(id: string, data: UpdateListingInput['body'], hostId: string) {
    // إصلاح المهمة 5: جلب hostId فقط لتقليل الاستهلاك
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { hostId: true }
    });

    if (!listing) throw new AppError('العقار غير موجود', 404, 'NOT_FOUND');
    if (listing.hostId !== hostId) throw new AppError('لا تملك صلاحية لتعديل هذا العقار', 403, 'FORBIDDEN');

    return prisma.listing.update({ where: { id }, data });
  }

  async deleteListing(id: string, hostId: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { hostId: true }
    });

    if (!listing) throw new AppError('العقار غير موجود', 404, 'NOT_FOUND');
    if (listing.hostId !== hostId) throw new AppError('لا تملك صلاحية لحذف هذا العقار', 403, 'FORBIDDEN');

    return prisma.listing.delete({ where: { id } });
  }
}
