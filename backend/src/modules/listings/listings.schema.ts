import { z } from 'zod';

export const createListingSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'عنوان العقار مطلوب' }).min(10, 'العنوان يجب أن يكون وصفياً (10 أحرف على الأقل)'),
    description: z.string({ required_error: 'وصف العقار مطلوب' }).min(20, 'الوصف يجب أن يكون مفصلاً'),
    price: z.coerce.number({ required_error: 'السعر مطلوب' }).positive('السعر يجب أن يكون رقماً موجباً'),
    location: z.string({ required_error: 'الموقع مطلوب' }),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    amenities: z.array(z.string()).min(1, 'يجب إضافة ميزة واحدة على الأقل (مثل: واي فاي، مسبح)'),
  }),
});

export const updateListingSchema = z.object({
  body: createListingSchema.shape.body.partial(),
});

// Schema لفلترة البحث (إصلاح المهمة 6)
export const searchListingsSchema = z.object({
  query: z.object({
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),
    radius: z.coerce.number().positive().max(1000).optional(),
    maxPrice: z.coerce.number().positive().optional(),
    minPrice: z.coerce.number().positive().optional(),
    location: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type SearchListingsInput = z.infer<typeof searchListingsSchema>;
