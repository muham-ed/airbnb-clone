import prisma from '../../shared/config/database';
import { Prisma } from '@prisma/client';
import { AppError } from '../../shared/utils/app-error';

export interface CreateBookingInput {
  listingId: string;
  guestId: string;
  startDate: Date;
  endDate: Date;
}

export class BookingsService {
  async createBooking(data: CreateBookingInput) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. تحقق استباقي (للأداء)
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
          throw new AppError('هذا العقار محجوز بالفعل في هذه التواريخ', 400);
        }

        const listing = await tx.listing.findUnique({
          where: { id: data.listingId },
          select: { price: true }
        });

        if (!listing) {
          throw new AppError('العقار غير موجود', 404);
        }

        const days = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = days * listing.price;

        // 2. المحاولة الفعلية للإنشاء (سيفحص الـ EXCLUDE constraint هنا)
        return await tx.booking.create({
          data: {
            ...data,
            totalPrice,
            status: 'pending'
          }
        });
      }, {
        isolationLevel: 'Serializable'
      });
    } catch (error) {
      // 3. التقاط خطأ الـ Exclusion Constraint من PostgreSQL (Prisma Code P2004)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2004') {
        throw new AppError('عذراً، حدث تداخل في الحجز في هذه اللحظة، يرجى المحاولة مرة أخرى', 400);
      }
      throw error;
    }
  }

  async getMyBookings(userId: string) {
    return prisma.booking.findMany({
      where: { guestId: userId },
      include: { listing: true }
    });
  }
}
