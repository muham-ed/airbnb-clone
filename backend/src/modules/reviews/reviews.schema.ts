import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string({ required_error: 'رقم الحجز مطلوب' }),
    rating: z.number({ required_error: 'التقييم مطلوب' }).min(1, 'التقييم الأدنى هو 1').max(5, 'التقييم الأقصى هو 5'),
    comment: z.string({ required_error: 'التعليق مطلوب' }).min(10, 'التعليق يجب أن يكون 10 أحرف على الأقل'),
  }),
});
