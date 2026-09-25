import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { AppError } from '../../shared/utils/app-error';

export class UploadController {
  async uploadSingle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('يرجى اختيار صورة للرفع', 400, 'NO_FILE_PROVIDED');
      }

      const file = req.file as Express.Multer.File & { path: string; filename: string };

      res.status(200).json({
        status: 'success',
        data: {
          url: file.path,
          publicId: file.filename,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadMultiple(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const files = req.files as (Express.Multer.File & { path: string })[];

      if (!files || files.length === 0) {
        throw new AppError('يرجى اختيار صورة واحدة على الأقل للرفع', 400, 'NO_FILES_PROVIDED');
      }

      const urls = files.map((file) => file.path);

      res.status(200).json({
        status: 'success',
        data: {
          urls,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
