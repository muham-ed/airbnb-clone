import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { protect } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createReviewSchema } from './reviews.schema';

const router = Router();
const controller = new ReviewsController();

router.get('/listing/:listingId', controller.getListingReviews);

router.use(protect);
router.post('/', validate(createReviewSchema), controller.createReview);

export default router;
