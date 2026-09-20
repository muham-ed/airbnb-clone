import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';

const logger = pino();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => {
  logger.error('❌ Redis Connection Error', err);
});

export class RefreshTokenService {
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

  async generateRefreshToken(userId: string, deviceId: string): Promise<string> {
    try {
      const token = uuidv4();
      await redis.set(
        `refresh_token:${token}`,
        JSON.stringify({ userId, deviceId }),
        'EX',
        this.REFRESH_TOKEN_EXPIRY
      );
      return token;
    } catch (error) {
      logger.error('Failed to set refresh token in Redis', error);
      throw new Error('Internal server error related to session');
    }
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string; deviceId: string } | null> {
    try {
      const data = await redis.get(`refresh_token:${token}`);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      logger.error('Failed to get refresh token from Redis', error);
      return null;
    }
  }

  async revokeRefreshToken(token: string): Promise<void> {
    try {
      await redis.del(`refresh_token:${token}`);
    } catch (error) {
      logger.error('Failed to delete refresh token from Redis', error);
    }
  }
}
