import prisma from '../../shared/config/database';

export interface CreateBookingInput {
  listingId: string;
  guestId: string;
  startDate: Date;
  endDate: Date;
}

export class BookingsService {
  async checkAvailability(listingId: string, startDate: Date, endDate: Date) {
    const conflicting = await prisma.booking.findFirst({
      where: {
        listingId,
        status: { in: ['pending', 'confirmed'] },
        OR: [
          { startDate: { lt: endDate, gte: startDate } },
          { endDate: { gt: startDate, lte: endDate } },
          { startDate: { lte: startDate }, endDate: { gte: endDate } }
        ]
      }
    });

    if (conflicting) {
      const error: any = new Error('هذا العقار محجوز بالفعل في هذه التواريخ');
      error.statusCode = 400;
      throw error;
    }
  }

  async createBooking(data: CreateBookingInput) {
    await this.checkAvailability(data.listingId, data.startDate, data.endDate);

    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      select: { price: true }
    });

    if (!listing) {
      const error: any = new Error('العقار غير موجود');
      error.statusCode = 404;
      throw error;
    }

    const days = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * listing.price;

    return prisma.booking.create({
      data: {
        ...data,
        totalPrice,
        status: 'pending'
      }
    });
  }

  async getMyBookings(userId: string) {
    return prisma.booking.findMany({
      where: { guestId: userId },
      include: { listing: true }
    });
  }
}
