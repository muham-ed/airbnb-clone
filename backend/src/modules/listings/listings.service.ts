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
  }) {
    const { maxPrice, minPrice, location, startDate, endDate } = filters;

    // محرك فلترة التوافر (Availability Logic)
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

    return prisma.listing.update({
      where: { id },
      data,
    });
  }

  async deleteListing(id: string, hostId: string) {
    const listing = await this.getListingById(id);
    if (listing.hostId !== hostId) {
      throw new AppError('لا تملك صلاحية لحذف هذا العقار', 403, 'FORBIDDEN');
    }

    return prisma.listing.delete({ where: { id } });
  }
}
