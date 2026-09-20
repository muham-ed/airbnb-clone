import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import pino from 'pino';

const logger = pino({
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
});

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.headers['x-request-id'] || Math.random().toString(36).substring(7);

  logger.error({
    requestId,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // 1. Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        code: 'DUPLICATE_ENTRY',
        message: 'A record with this value already exists',
        requestId
      });
    }
  }

  // 2. Prisma Validation Errors (إصلاح المهمة 9)
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: 'error',
      code: 'DATABASE_VALIDATION_ERROR',
      message: 'بيانات غير صالحة لقاعدة البيانات',
      requestId
    });
  }

  // 3. Validation Errors (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      errors: err.errors,
      requestId
    });
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Unauthorized access',
      requestId
    });
  }

  // Default Internal Server Error
  res.status(err.statusCode || 500).json({
    status: 'error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong',
    requestId
  });
};
