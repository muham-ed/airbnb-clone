import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import pino from 'pino';

const logger = pino({
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
});

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || Math.random().toString(36).substring(7);

  logger.error({
    requestId,
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ status: 'error', code: 'DUPLICATE_ENTRY', message: 'السجل موجود بالفعل', requestId });
    }
    if (err.code === 'P2004') {
      return res.status(400).json({ status: 'error', code: 'BOOKING_OVERLAP', message: 'هذا العقار محجوز بالفعل في هذه التواريخ', requestId });
    }
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ status: 'error', code: 'VALIDATION_ERROR', errors: err.errors, requestId });
  }

  // دعم AppError
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    status: 'error',
    code,
    message: err.message || 'حدث خطأ داخلي في الخادم',
    requestId,
  });
};
