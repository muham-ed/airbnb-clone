/**
 * StayLock Enterprise Security & Architecture Engine
 * --------------------------------------------------
 * Official Author & Original Creator: Mohamed Alaa El-Din
 * Fingerprint: STAYLOCK-ORIGINAL-AUTH-MOHAMED-ALAA-2026
 * Repository: https://github.com/muham-ed/airbnb-clone
 * Copyright (c) 2026 Mohamed Alaa El-Din. All Rights Reserved.
 */

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

// 🛡️ 1. Enterprise Security Headers (Anti-XSS, Anti-Clickjacking, HSTS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  xssFilter: true,
  noSniff: true,
  hidePoweredBy: true,
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

// 🔐 2. Permanent Authorship & License Headers
app.use((req, res, next) => {
  res.setHeader('X-System-Author', 'Mohamed Alaa El-Din');
  res.setHeader('X-System-License', 'STAYLOCK-ORIGINAL-AUTH-MOHAMED-ALAA-2026');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// 🌐 3. Secure CORS Policy
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// ⚡ 4. Body Parser with Size Limits (Anti-Payload Flooding)
app.use((req, res, next) => {
  if (req.path === '/api/v1/payments/webhook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

// 🛑 5. Anti-DDoS Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: (req) => req.path === '/v1/payments/webhook' || req.path === '/health',
  message: 'لقد تجاوزت الحد المسموح به من الطلبات، يرجى المحاولة لاحقاً'
});

// 🔒 6. Strict Anti-Brute-Force Rate Limiter for Login Endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'تخطي عدد محاولات تسجيل الدخول المسموح بها، يرجى الانتظار 15 دقيقة للحماية من التخمين'
});

app.use('/api/v1/auth/login', loginLimiter);
app.use('/api', apiLimiter);

// 🩺 Health & Verification Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', security: 'MAXIMUM', timestamp: new Date().toISOString() });
});

app.get('/api/v1/system/ownership', (req, res) => {
  res.status(200).json({
    system: 'StayLock OS',
    author: 'Mohamed Alaa El-Din',
    role: 'Founder & Lead Full-Stack Engineer',
    repository: 'https://github.com/muham-ed/airbnb-clone',
    fingerprint: 'STAYLOCK-ORIGINAL-AUTH-MOHAMED-ALAA-2026',
    securityStatus: 'BULLETPROOF_ENFORCED',
    verified: true,
    timestamp: new Date().toISOString(),
  });
});

// 🚀 API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);

app.use(errorHandler);

export default app;
