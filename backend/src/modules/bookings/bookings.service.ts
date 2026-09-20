import prisma from '../../shared/config/database';

export interface CreateBookingInput {
  listingId: string;
  guestId: string;
  startDate: Date;
  endDate: Date;
}

export class BookingsService {
  async createBooking(data: CreateBookingInput) {
    // استخدام Serializable isolation لضمان عدم وجود Race Condition
    return prisma.$transaction(async (tx) => {
      // 1. تحقق من التوفر (داخل الـ transaction)
      const conflicting = await tx.booking.findFirst({
        where: {
          listingId: data.listingId,
          status: { in: ['pending', 'confirmed'] },
          OR: [
            { startDate: { lt: data.endDate, gte: data.startDate } },
            { endDate: { gt: data.startDate, lte: data.endDate } },
            { startDate: { lte: data.startDate }, endDate: { gte: data.endDate } }
          ]
        }
      });

      if (conflicting) {
        const error: any = new Error('هذا العقار محجوز بالفعل في هذه التواريخ');
        error.statusCode = 400;
        throw error;
      }

      // 2. جلب سعر العقار
      const listing = await tx.listing.findUnique({
        where: { id: data.listingId },
        select: { price: true }
      });

      if (!listing) {
        const error: any = new Error('العقار غير موجود');
        error.statusCode = 404;
        throw error;
      }

      // 3. حساب السعر الإجمالي
      const days = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = days * listing.price;

      // 4. إنشاء الحجز
      return tx.booking.create({
        data: {
          ...data,
          totalPrice,
          status: 'pending'
        }
      });
    }, {
      isolationLevel: 'Serializable' // أقصى درجات الأمان لمنع التداخل
    });
  }

  async getMyBookings(userId: string) {
    return prisma.booking.findMany({
      where: { guestId: userId },
      include: { listing: true }
    });
  }
}
