import prisma from '../config/database';

export class BookingService {
  async checkAvailability(listingId: string, startDate: Date, endDate: Date) {
    // استعلام واحد لمنع أي تداخل في التواريخ
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
      throw new Error('هذا العقار محجوز بالفعل في هذه التواريخ');
    }

    return true;
  }

  async createBooking(data: { listingId: string; guestId: string; startDate: Date; endDate: Date }) {
    // تحقق أولاً من التوفر
    await this.checkAvailability(data.listingId, data.startDate, data.endDate);

    // احسب السعر الإجمالي (يمكنك جلب السعر من الـ Listing)
    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      select: { price: true }
    });

    if (!listing) throw new Error('العقار غير موجود');

    const days = Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * listing.price;

    // أنشئ الحجز
    return prisma.booking.create({
      data: {
        ...data,
        totalPrice,
        status: 'pending'
      }
    });
  }
}