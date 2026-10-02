import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './shared/middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import listingRoutes from './modules/listings/listings.routes';
import bookingRoutes from './modules/bookings/bookings.routes';
import paymentRoutes from './modules/payments/payments.routes';
import uploadRoutes from './modules/upload/upload.routes';
import wishlistRoutes from './modules/wishlists/wishlists.routes';

const app = express();

// Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration for Flutter Web & Mobile Clients
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Webhook raw body bypass
app.use((req, res, next) => {
  if (req.path === '/api/v1/payments/webhook') {
    next();
  } else {
    express.json({ limit: '1mb' })(req, res, next);
  }
});

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: (req) => req.path === '/v1/payments/webhook' || req.path === '/health',
  message: 'لقد تجاوزت الحد المسموح به من الطلبات، يرجى المحاولة لاحقاً'
});

const loginMaxRequests = parseInt(process.env.LOGIN_RATE_MAX || '30', 10);
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: loginMaxRequests,
  message: 'تخطي عدد محاولات تسجيل الدخول المسموح بها، يرجى الانتظار لاحقاً'
});

app.use('/api/v1/auth/login', loginLimiter);
app.use('/api', apiLimiter);

// Health Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);

app.use(errorHandler);

export default app;
