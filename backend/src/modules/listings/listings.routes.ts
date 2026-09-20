import { Router } from 'express';
import { ListingsController } from './listings.controller';
import { protect, restrictTo } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createListingSchema, updateListingSchema } from './listings.schema';

import { upload } from '../../shared/config/cloudinary';

const router = Router();
const controller = new ListingsController();

// مسارات عامة
router.get('/', controller.getAllListings);
router.get('/:id', controller.getListing);

// مسارات محمية
router.use(protect);

router.post(
  '/',
  restrictTo(true),
  upload.array('images', 5), // السماح برفع حتى 5 صور
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
