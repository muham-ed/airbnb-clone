import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { UsersService } from './users.service';

const usersService = new UsersService();

export class UsersController {
  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getMe(req.user!.id);
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.updateMe(req.user!.id, req.body);
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}
