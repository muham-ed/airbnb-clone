import { Router } from 'express';
import { ListingsController } from './listings.controller';
import { protect, restrictTo } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createListingSchema, updateListingSchema, searchListingsSchema } from './listings.schema';
import { upload } from '../../shared/config/cloudinary';

const router = Router();
const controller = new ListingsController();

// مسارات عامة
router.get('/', validate(searchListingsSchema), controller.getAllListings);

// مسارات محمية
router.use(protect);

// مسار عقاراتي الخاصة بالمضيف (يجب وضعه قبل :id)
router.get('/my-listings', restrictTo('HOST'), controller.getMyListings);

// مسار جلب تفاصيل عقار بالـ id
router.get('/:id', controller.getListing);

router.post(
  '/',
  restrictTo('HOST'),
  upload.array('images', 5),
  validate(createListingSchema),
  controller.createListing
);

router.patch(
  '/:id',
  restrictTo('HOST'),
  validate(updateListingSchema),
  controller.updateListing
);

router.delete(
  '/:id',
  restrictTo('HOST'),
  controller.deleteListing
);

export default router;
