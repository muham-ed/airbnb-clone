import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    return res.status(201).json({
      status: 'success',
      data: result,
    });
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return res.status(200).json({
      status: 'success',
      data: result,
    });
  }
}
