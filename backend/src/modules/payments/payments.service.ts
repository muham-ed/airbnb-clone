import Stripe from 'stripe';
import Redis from 'ioredis';
import prisma from '../../shared/config/database';
import { AppError } from '../../shared/utils/app-error';

// ============ Lazy Stripe Init ============
let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new AppError(
      'FATAL: STRIPE_SECRET_KEY is not defined in environment variables',
      500,
      'CONFIG_ERROR'
    );
  }

  stripeClient = new Stripe(key, {
    apiVersion: '2025-01-27.acacia' as any,
  });
  return stripeClient;
}

// ============ Lazy Redis Init ============
let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: false,
  });

  redisClient.on('error', (err) => {
    console.error('[Redis] Connection error:', err.message);
  });

  return redisClient;
}

// ============ Service ============
export class PaymentsService {
  async createCheckoutSession(bookingId: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        guestId: userId,
      },
      include: {
        listing: true,
        guest: { select: { email: true } },
      },
    });

    if (!booking) {
      throw new AppError(
        'الحجز غير موجود أو لا تملك صلاحية الوصول إليه',
        404,
        'NOT_FOUND'
      );
    }

    if (booking.status.toLowerCase() !== 'pending') {
      throw new AppError(
        'هذا الحجز لا يمكن دفعه الآن',
        400,
        'INVALID_BOOKING_STATUS'
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${frontendUrl}/bookings/${bookingId}?success=true`,
      cancel_url: `${frontendUrl}/bookings/${bookingId}?canceled=true`,
      customer_email: booking.guest.email,
      line_items: [
        {
          price_data: {
            currency: booking.currency.toLowerCase(),
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
        currency: booking.currency,
        status: 'pending',
      },
    });

    return session.url;
  }

  async handleWebhook(sig: string, body: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new AppError(
        'FATAL: STRIPE_WEBHOOK_SECRET is not defined',
        500,
        'CONFIG_ERROR'
      );
    }

    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      throw new AppError(
        `Webhook Error: ${err.message}`,
        400,
        'WEBHOOK_VERIFICATION_FAILED'
      );
    }

    // Idempotency
    const redis = getRedis();
    const eventKey = `stripe:event:${event.id}`;
    const isProcessed = await redis.get(eventKey);
    if (isProcessed) return { received: true, alreadyProcessed: true };

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        throw new AppError(
          'Missing bookingId in session metadata',
          400,
          'INVALID_WEBHOOK_PAYLOAD'
        );
      }

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

    await redis.set(eventKey, 'true', 'EX', 86400);

    return { received: true };
  }
}
