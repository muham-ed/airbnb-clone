import { z } from 'zod';

export const createListingSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'عنوان العقار مطلوب' }).min(10, 'العنوان يجب أن يكون وصفياً (10 أحرف على الأقل)'),
    description: z.string({ required_error: 'وصف العقار مطلوب' }).min(20, 'الوصف يجب أن يكون مفصلاً'),
    price: z.number({ required_error: 'السعر مطلوب' }).positive('السعر يجب أن يكون رقماً موجباً'),
    location: z.string({ required_error: 'الموقع مطلوب' }),
    amenities: z.array(z.string()).min(1, 'يجب إضافة ميزة واحدة على الأقل (مثل: واي فاي، مسبح)'),
    images: z.array(z.string()).optional(),
  }),
});

export const updateListingSchema = z.object({
  body: createListingSchema.shape.body.partial(),
});
