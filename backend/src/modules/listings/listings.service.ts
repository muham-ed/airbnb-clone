import prisma from '../../shared/config/database';

export class ListingsService {
  async getAllListings(filters: any) {
    return prisma.listing.findMany({
      where: {
        available: true,
        price: {
          lte: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
          gte: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        },
        location: filters.location ? { contains: filters.location, mode: 'insensitive' } : undefined,
      },
      include: { host: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getListingById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, name: true, avatar: true, email: true } },
        reviews: true
      },
    });
    if (!listing) {
      const error: any = new Error('العقار غير موجود');
      error.statusCode = 404;
      throw error;
    }
    return listing;
  }

  async createListing(data: any, hostId: string) {
    return prisma.listing.create({
      data: {
        ...data,
        hostId,
      },
    });
  }

  async updateListing(id: string, data: any, hostId: string) {
    const listing = await this.getListingById(id);

    if (listing.hostId !== hostId) {
      const error: any = new Error('لا تملك صلاحية لتعديل هذا العقار');
      error.statusCode = 403;
      throw error;
    }

    return prisma.listing.update({
      where: { id },
      data,
    });
  }

  async deleteListing(id: string, hostId: string) {
    const listing = await this.getListingById(id);

    if (listing.hostId !== hostId) {
      const error: any = new Error('لا تملك صلاحية لحذف هذا العقار');
      error.statusCode = 403;
      throw error;
    }

    return prisma.listing.delete({ where: { id } });
  }
}
