import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

const authService = new AuthService();
const refreshService = new RefreshTokenService();

export class AuthController {
  async register(req: Request, res: Response) {
    const deviceId = req.headers['user-agent'] || 'unknown';
    const result = await authService.register(req.body);
    const refreshToken = await refreshService.generateRefreshToken(result.user.id, deviceId);

    res.status(201).json({
      status: 'success',
      data: { ...result, refreshToken },
    });
  }

  async login(req: Request, res: Response) {
    const deviceId = req.headers['user-agent'] || 'unknown';
    const result = await authService.login(req.body);
    const refreshToken = await refreshService.generateRefreshToken(result.user.id, deviceId);

    res.status(200).json({
      status: 'success',
      data: { ...result, refreshToken },
    });
  }

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const currentDeviceId = req.headers['user-agent'] || 'unknown';

    const session = await refreshService.verifyRefreshToken(refreshToken);

    if (!session || session.deviceId !== currentDeviceId) {
      const error: any = new Error('Session expired or invalid device');
      error.statusCode = 401;
      throw error;
    }

    const token = authService.generateAccessToken(session.userId);

    res.status(200).json({ status: 'success', token });
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    await refreshService.revokeRefreshToken(refreshToken);
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  }
}
