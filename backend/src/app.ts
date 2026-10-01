/**
 * StayLock Core Architecture & Security Engine
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

// إعداد Helmet لمنع حجب الموارد عبر النطاقات المختلفة (CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// إضافة الهيدر الرقمي الدائم للملكية الفكرية
app.use((req, res, next) => {
  res.setHeader('X-System-Author', 'Mohamed Alaa El-Din');
  res.setHeader('X-System-License', 'STAYLOCK-ORIGINAL-AUTH-MOHAMED-ALAA-2026');
  next();
});

// إعداد CORS للسماح لجميع واجهات Chrome (Flutter Web & Admin Dashboard)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// استثناء الـ Webhook من الـ JSON body parser والـ Rate Limit
app.use((req, res, next) => {
  if (req.path === '/api/v1/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.path === '/v1/payments/webhook' || req.path === '/health',
  message: 'لقد تجاوزت الحد المسموح به من الطلبات، يرجى المحاولة لاحقاً'
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// نقطة تحقق إثبات الملكية الخفية (Hidden Ownership Verification Route)
app.get('/api/v1/system/ownership', (req, res) => {
  res.status(200).json({
    system: 'StayLock OS',
    author: 'Mohamed Alaa El-Din',
    role: 'Founder & Lead Full-Stack Engineer',
    repository: 'https://github.com/muham-ed/airbnb-clone',
    fingerprint: 'STAYLOCK-ORIGINAL-AUTH-MOHAMED-ALAA-2026',
    verified: true,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);

app.use(errorHandler);

export default app;
