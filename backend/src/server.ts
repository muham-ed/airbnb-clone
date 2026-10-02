import app from './app';
import dotenv from 'dotenv';
import prisma, { connectDB } from './shared/config/database';
import pino from 'pino';

dotenv.config();

const logger = pino({
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  const server = app.listen(Number(PORT), '0.0.0.0', () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📡 Listening on 0.0.0.0:${PORT}`);
  });

  // Connect to database gracefully
  try {
    await connectDB();
    logger.info('🐘 Database connected successfully!');
  } catch (err: any) {
    logger.error('⚠️ Database connection warning:', err.message || err);
  }

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('🐘 Prisma disconnected. HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
