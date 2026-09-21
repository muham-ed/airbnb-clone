import Stripe from 'stripe';
import prisma from '../../shared/config/database';
import { AppError } from '../../shared/utils/app-error';
import Redis from 'ioredis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class PaymentsService {
  async createCheckoutSession(bookingId: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        guestId: userId // حماية ضد IDOR
      },
      include: {
        listing: true,
        guest: { select: { email: true } } // جلب البريد الإلكتروني للمستخدم
      },
    });

    if (!booking) {
      throw new AppError('الحجز غير موجود أو لا تملك صلاحية الوصول إليه', 404, 'NOT_FOUND');
    }

    if (booking.status !== 'pending') {
      throw new AppError('هذا الحجز لا يمكن دفعه الآن', 400, 'INVALID_BOOKING_STATUS');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${process.env.FRONTEND_URL}/bookings/${bookingId}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/bookings/${bookingId}?canceled=true`,
      customer_email: booking.guest.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: booking.listing.title,
              description: `حجز عقار من ${booking.startDate.toDateString()} إلى ${booking.endDate.toDateString()}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: { bookingId: booking.id },
    });

    await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: { stripeSessionId: session.id },
      create: {
        bookingId: booking.id,
        stripeSessionId: session.id,
        amount: booking.totalPrice,
        status: 'pending',
      },
    });

    return session.url;
  }

  async handleWebhook(sig: string, body: any) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      throw new AppError(`Webhook Error: ${err.message}`, 400, 'WEBHOOK_VERIFICATION_FAILED');
    }

    // Idempotency: منع معالجة نفس الـ event مرتين
    const eventKey = `stripe:event:${event.id}`;
    const isProcessed = await redis.get(eventKey);
    if (isProcessed) return { received: true, alreadyProcessed: true };

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      await prisma.$transaction([
        prisma.payment.update({
          where: { stripeSessionId: session.id },
          data: { status: 'succeeded' },
        }),
        prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'confirmed' },
        }),
      ]);
    }

    // حفظ الـ event في Redis لمدة 24 ساعة
    await redis.set(eventKey, 'true', 'EX', 86400);

    return { received: true };
  }
}
