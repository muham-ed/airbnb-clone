import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './shared/config/database';
import pino from 'pino';

dotenv.config();
const logger = pino({ transport: { target: 'pino-pretty' } });
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });

  // Graceful Shutdown
  const shutdown = async () => {
    logger.info('Shutting down server...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch(err => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
