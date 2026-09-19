import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './shared/config/database';
import pino from 'pino';

dotenv.config();
const logger = pino({ transport: { target: 'pino-pretty' } });
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📡 Health check: http://localhost:${PORT}/health`);
  });
}

startServer().catch(err => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
