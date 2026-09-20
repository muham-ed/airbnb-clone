import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './shared/middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import listingRoutes from './modules/listings/listings.routes';

const app = express();

// Security Middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 requests per IP
  message: 'لقد تجاوزت الحد المسموح به من الطلبات، يرجى المحاولة لاحقاً'
}));

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listings', listingRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'airbnb-clone-backend'
  });
});

app.use(errorHandler);

export default app;
