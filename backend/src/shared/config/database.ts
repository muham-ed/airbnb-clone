import { PrismaClient } from '@prisma/client';
import pino from 'pino';

const logger = pino({ transport: { target: 'pino-pretty' } });
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function connectDB(retries = 5) {
  while (retries > 0) {
    try {
      await prisma.$connect();
      logger.info('🐘 Database connected successfully');
      return;
    } catch (error) {
      retries -= 1;
      logger.warn(`⚠️ Database connection failed. Retries left: ${retries}`);
      if (retries === 0) {
        logger.error('❌ Could not connect to database after multiple attempts', error);
        process.exit(1);
      }
      // انتظر ثانيتين قبل المحاولة التالية
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

export default prisma;
