import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './shared/middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import listingRoutes from './modules/listings/listings.routes';

const app = express();

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
