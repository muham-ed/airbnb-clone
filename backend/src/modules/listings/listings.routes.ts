import { Router } from 'express';
import { ListingsController } from './listings.controller';
import { protect, restrictTo } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createListingSchema, updateListingSchema } from './listings.schema';

const router = Router();
const controller = new ListingsController();

// مسارات عامة (للجميع)
router.get('/', controller.getAllListings);
router.get('/:id', controller.getListing);

// مسارات محمية (للمستخدمين المسجلين والذين هم "Hosts")
router.use(protect);

router.post(
  '/',
  restrictTo(true), // true تعني أنه يجب أن يكون Host
  validate(createListingSchema),
  controller.createListing
);

router.patch(
  '/:id',
  restrictTo(true),
  validate(updateListingSchema),
  controller.updateListing
);

router.delete(
  '/:id',
  restrictTo(true),
  controller.deleteListing
);

export default router;
