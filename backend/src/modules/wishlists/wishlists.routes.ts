import { Router } from 'express';
import { WishlistsController } from './wishlists.controller';
import { protect } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createWishlistSchema, addWishlistItemSchema } from './wishlists.schema';

const router = Router();
const controller = new WishlistsController();

// جميع مسارات المفضلات تتطلب تسجيل الدخول
router.use(protect);

router.get('/', controller.getMyWishlists);
router.post('/', validate(createWishlistSchema), controller.createWishlist);
router.get('/:id', controller.getWishlist);
router.delete('/:id', controller.deleteWishlist);

// إضافة وإزالة عنصر في قائمة مفضلات معينة
router.post('/:id/items', validate(addWishlistItemSchema), controller.addItem);
router.delete('/:wishlistId/items/:listingId', controller.removeItem);

export default router;
