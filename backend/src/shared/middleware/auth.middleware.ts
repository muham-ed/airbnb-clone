import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    isHost: boolean;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error: any = new Error('غير مصرح لك بالدخول، يرجى تسجيل الدخول أولاً');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';
    const decoded: any = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, isHost: true }
    });

    if (!user) {
      const error: any = new Error('المستخدم صاحب هذا المفتاح لم يعد موجوداً');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    const authError: any = new Error('مفتاح الدخول غير صالح أو منتهي الصلاحية');
    authError.statusCode = 401;
    next(authError);
  }
};

export const restrictTo = (...roles: boolean[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.isHost)) {
      const error: any = new Error('ليس لديك صلاحية للقيام بهذا الإجراء');
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
