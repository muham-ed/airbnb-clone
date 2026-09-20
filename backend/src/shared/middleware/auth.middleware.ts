import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export type UserRole = 'GUEST' | 'HOST' | 'ADMIN';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
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
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('FATAL: JWT_SECRET is not defined in environment variables');
    }

    const decoded: any = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      const error: any = new Error('المستخدم صاحب هذا المفتاح لم يعد موجوداً');
      error.statusCode = 401;
      throw error;
    }

    req.user = user as { id: string; email: string; role: UserRole };
    next();
  } catch (error) {
    const authError: any = new Error('مفتاح الدخول غير صالح أو منتهي الصلاحية');
    authError.statusCode = 401;
    next(authError);
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error: any = new Error('ليس لديك صلاحية للقيام بهذا الإجراء');
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
