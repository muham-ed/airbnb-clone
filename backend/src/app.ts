import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './shared/middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import listingRoutes from './modules/listings/listings.routes';
import bookingRoutes from './modules/bookings/bookings.routes';
import paymentRoutes from './modules/payments/payments.routes';

const app = express();

app.use(helmet());
app.use(cors());

// استثناء الـ Webhook من الـ JSON body parser لأنه يحتاج raw body
app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'لقد تجاوزت الحد المسموح به من الطلبات، يرجى المحاولة لاحقاً'
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'airbnb-clone-backend'
  });
});

// تطبيق الـ Rate Limit على المسارات الفعلية
app.use('/api', apiLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.use(errorHandler);

export default app;
