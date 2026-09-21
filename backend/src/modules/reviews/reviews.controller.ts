import { Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { ReviewsService } from './reviews.service';

const reviewsService = new ReviewsService();

export class ReviewsController {
  async createReview(req: AuthRequest, res: Response) {
    const review = await reviewsService.createReview(req.user!.id, req.body);
    res.status(201).json({ status: 'success', data: review });
  }

  async getListingReviews(req: AuthRequest, res: Response) {
    const reviews = await reviewsService.getListingReviews(req.params.listingId);
    res.status(200).json({ status: 'success', results: reviews.length, data: reviews });
  }
}
