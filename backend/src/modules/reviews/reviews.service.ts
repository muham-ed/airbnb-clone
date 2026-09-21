import prisma from '../../shared/config/database';
import { AppError } from '../../shared/utils/app-error';

export class ReviewsService {
  async createReview(userId: string, data: { bookingId: string; rating: number; comment: string }) {
    // 1. التحقق من وجود الحجز وانتمائه للمستخدم
    const booking = await prisma.booking.findFirst({
      where: {
        id: data.bookingId,
        guestId: userId,
        status: 'confirmed' // لا يمكن التقييم إلا للحجوزات المؤكدة
      },
    });

    if (!booking) {
      throw new AppError('لا يمكنك تقييم هذا الحجز. تأكد أنه حجزك الخاص وأنه مؤكد.', 400, 'INVALID_REVIEW_TARGET');
    }

    // 2. التحقق من عدم وجود تقييم مسبق لنفس الحجز
    const existingReview = await prisma.review.findUnique({
      where: { bookingId: data.bookingId }
    });

    if (existingReview) {
      throw new AppError('لقد قمت بتقييم هذا الحجز مسبقاً', 400, 'DUPLICATE_REVIEW');
    }

    // 3. إنشاء التقييم
    return prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        userId: userId,
        listingId: booking.listingId,
        bookingId: data.bookingId,
      }
    });
  }

  async getListingReviews(listingId: string) {
    return prisma.review.findMany({
      where: { listingId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
