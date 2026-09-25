import { Router } from 'express';
import { UploadController } from './upload.controller';
import { protect } from '../../shared/middleware/auth.middleware';
import { upload } from '../../shared/config/cloudinary';

const router = Router();
const uploadController = new UploadController();

// جميع مسارات الرفع تتطلب تسجيل الدخول
router.use(protect);

// رفع صورة واحدة (مثل صورة الحساب أو غلاف العقار)
router.post('/single', upload.single('image'), uploadController.uploadSingle);

// رفع صور متعددة (مثل معرض صور العقار - بحد أقصى 10 صور)
router.post('/multiple', upload.array('images', 10), uploadController.uploadMultiple);

export default router;
