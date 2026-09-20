import Stripe from 'stripe';
import prisma from '../../shared/config/database';
import { AppError } from '../../shared/utils/app-error';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27' as any, // استخدام أحدث إصدار متاح
});

export class PaymentsService {
  async createCheckoutSession(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: true },
    });

    if (!booking) {
      throw new AppError('الحجز غير موجود', 404);
    }

    if (booking.status !== 'pending') {
      throw new AppError('هذا الحجز لا يمكن دفعه الآن', 400);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${process.env.FRONTEND_URL}/bookings/${bookingId}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/bookings/${bookingId}?canceled=true`,
      customer_email: (booking as any).guest?.email, // سيتم تحسينها لاحقاً
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: booking.listing.title,
              description: `حجز عقار من ${booking.startDate.toDateString()} إلى ${booking.endDate.toDateString()}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Stripe يستخدم السنت
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        bookingId: booking.id,
      },
    });

    // تسجيل محاولة الدفع في قاعدة البيانات
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
      throw new AppError(`Webhook Error: ${err.message}`, 400);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      await prisma.$transaction([
        prisma.payment.update({
          where: { stripeSessionId: session.id },
          data: { status: 'succeeded' },
        }),
        prisma.booking.update({
          where: { id: session.metadata?.bookingId },
          data: { status: 'confirmed' },
        }),
      ]);
    }

    return { received: true };
  }
}
