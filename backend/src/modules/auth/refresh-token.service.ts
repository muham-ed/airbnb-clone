import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class RefreshTokenService {
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days

  async generateRefreshToken(userId: string, deviceId: string): Promise<string> {
    const token = uuidv4();
    await redis.set(
      `refresh_token:${token}`,
      JSON.stringify({ userId, deviceId }),
      'EX',
      this.REFRESH_TOKEN_EXPIRY
    );
    return token;
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string; deviceId: string } | null> {
    const data = await redis.get(`refresh_token:${token}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await redis.del(`refresh_token:${token}`);
  }
}
