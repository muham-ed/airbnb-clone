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
      return await prisma.$transaction(
        async (tx) => {
          // 1. تحقق استباقي (للأداء) — مش بديل عن الـ DB constraint
          const conflicting = await tx.booking.findFirst({
            where: {
              listingId: data.listingId,
              status: { in: ['pending', 'confirmed'] },
              OR: [
                { startDate: { lt: data.endDate, gte: data.startDate } },
                { endDate: { gt: data.startDate, lte: data.endDate } },
                { startDate: { lte: data.startDate }, endDate: { gte: data.endDate } },
              ],
            },
          });

          if (conflicting) {
            throw new AppError(
              'هذا العقار محجوز بالفعل في هذه التواريخ',
              409,
              'BOOKING_CONFLICT'
            );
          }

          const listing = await tx.listing.findUnique({
            where: { id: data.listingId },
            select: { price: true },
          });

          if (!listing) {
            throw new AppError('العقار غير موجود', 404, 'LISTING_NOT_FOUND');
          }

          const days = Math.ceil(
            (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          const totalPrice = days * listing.price;

          // 2. المحاولة الفعلية للإنشاء — هنا بيتفحص الـ EXCLUDE constraint
          return await tx.booking.create({
            data: {
              listingId: data.listingId,
              guestId: data.guestId,
              startDate: data.startDate,
              endDate: data.endDate,
              totalPrice,
              status: 'pending',
            },
          });
        },
        {
          isolationLevel: 'Serializable',
        }
      );
    } catch (error) {
      // 3. لو الخطأ من التحقق الاستباقي (AppError)، أعِده زي ما هو
      if (error instanceof AppError) {
        throw error;
      }

      // 4. التقاط خطأ الـ Exclusion Constraint من PostgreSQL
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const message = error.message || '';

        const isExclusionViolation =
          error.code === 'P2004' ||
          error.code === 'P2010' ||
          message.includes('no_overlapping_bookings') ||
          message.includes('conflicting key value violates exclusion constraint');

        if (isExclusionViolation) {
          throw new AppError(
            'هذا العقار محجوز بالفعل في هذه التواريخ',
            409,
            'BOOKING_CONFLICT'
          );
        }
      }

      // 5. أي خطأ تاني — أعِده زي ما هو
      throw error;
    }
  }

  async getMyBookings(userId: string) {
    return prisma.booking.findMany({
      where: { guestId: userId },
      include: { listing: true },
    });
  }
}