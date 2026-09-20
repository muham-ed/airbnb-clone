import { PrismaClient } from '@prisma/client';
import pino from 'pino';

const logger = pino({
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined
});

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export async function connectDB(retries = 5) {
  let backoff = 1000;
  while (retries > 0) {
    try {
      await prisma.$connect();
      logger.info('🐘 Database connected successfully');
      return;
    } catch (error) {
      retries -= 1;
      logger.warn(`⚠️ Database connection failed. Retries left: ${retries}. Backoff: ${backoff}ms`);
      if (retries === 0) {
        throw new Error('Could not connect to database after multiple attempts');
      }
      await new Promise(res => setTimeout(res, backoff));
      backoff *= 2; // Exponential backoff
    }
  }
}

export default prisma;
