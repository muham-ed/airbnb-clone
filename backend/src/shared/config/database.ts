import { PrismaClient } from '@prisma/client';
import pino from 'pino';

const logger = pino({
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
});

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export {}

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
      backoff *= 2;
    }
  }
}
