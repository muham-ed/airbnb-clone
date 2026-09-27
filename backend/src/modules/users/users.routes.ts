import { Router } from 'express';
import { UsersController } from './users.controller';
import { protect, restrictTo } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { updateProfileSchema } from './users.schema';

const router = Router();
const usersController = new UsersController();

// جميع مسارات هذه الوحدة تتطلب تسجيل الدخول
router.use(protect);

router.get('/me', usersController.getMe);
router.put('/me', validate(updateProfileSchema), usersController.updateMe);
router.patch('/me', validate(updateProfileSchema), usersController.updateMe);

// مسارات الأدمن فقط
router.get('/', restrictTo('ADMIN'), usersController.getAllUsers);
router.patch('/:id/ban', restrictTo('ADMIN'), usersController.toggleBanUser);

export default router;
