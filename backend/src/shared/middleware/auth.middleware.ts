import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { AppError } from '../utils/app-error';

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
    return next(new AppError('يرجى تسجيل الدخول للوصول لهذا المورد', 401, 'UNAUTHORIZED'));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('FATAL: JWT_SECRET is not defined');

    // تحديد الخوارزمية صراحة
    const decoded: any = jwt.verify(token, secret, { algorithms: ['HS256'] });

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return next(new AppError('المستخدم صاحب هذا المفتاح لم يعد موجوداً', 401, 'USER_NOT_FOUND'));
    }

    req.user = user as { id: string; email: string; role: UserRole };
    next();
  } catch (error: any) {
    // عدم إخفاء أخطاء الإعداد القاتلة
    if (error.message && error.message.startsWith('FATAL')) {
      return next(error);
    }
    next(new AppError('مفتاح الدخول غير صالح أو منتهي الصلاحية', 401, 'INVALID_TOKEN'));
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('ليس لديك صلاحية للقيام بهذا الإجراء', 403, 'FORBIDDEN'));
    }
    next();
  };
};
