import prisma from '../../shared/config/database';
import { z } from 'zod';
import { createListingSchema } from './listings.schema';
import { AppError } from '../../shared/utils/app-error';

type CreateListingInput = z.infer<typeof createListingSchema>['body'] & { images: string[] };

export class ListingsService {
  async getAllListings(filters: {
    maxPrice?: string;
    minPrice?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    lat?: string;
    lng?: string;
    radius?: string;
  }) {
    const { maxPrice, minPrice, location, startDate, endDate, lat, lng, radius } = filters;

    let availabilityFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      availabilityFilter = {
        bookings: {
          none: {
            status: { in: ['pending', 'confirmed'] },
            OR: [
              { startDate: { lt: end, gte: start } },
              { endDate: { gt: start, lte: end } },
              { startDate: { lte: start }, endDate: { gte: end } }
            ]
          }
        }
      };
    }

    // إذا كان البحث مكاني (جغرافي)
    if (lat && lng && radius) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const searchRadius = parseFloat(radius);

      // استخدام SQL Raw لحساب المسافة (Haversine Formula)
      // ملاحظة: هذا الاستعلام يفلتر حسب المسافة ويجلب العقارات المتاحة فقط
      return prisma.$queryRawUnsafe(`
        SELECT *,
          (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) AS distance
        FROM "Listing"
        WHERE available = true
        GROUP BY id
        HAVING (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) <= ${searchRadius}
        ORDER BY distance ASC
      `);
    }

    return prisma.listing.findMany({
      where: {
        available: true,
        ...availabilityFilter,
        price: {
          lte: maxPrice ? parseFloat(maxPrice) : undefined,
          gte: minPrice ? parseFloat(minPrice) : undefined,
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
    if (!listing) {
      throw new AppError('العقار غير موجود', 404, 'NOT_FOUND');
    }
    return listing;
  }

  async createListing(data: CreateListingInput, hostId: string) {
    return prisma.listing.create({
      data: {
        ...data,
        hostId,
      },
    });
  }

  async updateListing(id: string, data: Partial<CreateListingInput>, hostId: string) {
    const listing = await this.getListingById(id);
    if (listing.hostId !== hostId) {
      throw new AppError('لا تملك صلاحية لتعديل هذا العقار', 403, 'FORBIDDEN');
    }
    return prisma.listing.update({ where: { id }, data });
  }

  async deleteListing(id: string, hostId: string) {
    const listing = await this.getListingById(id);
    if (listing.hostId !== hostId) {
      throw new AppError('لا تملك صلاحية لحذف هذا العقار', 403, 'FORBIDDEN');
    }
    return prisma.listing.delete({ where: { id } });
  }
}
