import { z } from 'zod';

export const createWishlistSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'اسم قائمة المفضلات مطلوب' }).min(1, 'اسم القائمة لا يمكن أن يكون فارغاً'),
  }),
});

export const addWishlistItemSchema = z.object({
  body: z.object({
    listingId: z.string({ required_error: 'معرف العقار مطلوب' }).uuid('صيغة معرف العقار غير صحيحة'),
  }),
});

export type CreateWishlistInput = z.infer<typeof createWishlistSchema>;
export type AddWishlistItemInput = z.infer<typeof addWishlistItemSchema>;
