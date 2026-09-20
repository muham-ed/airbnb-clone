import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    listingId: z.string({ required_error: 'listingId مطلوب' }),
    startDate: z.coerce.date({ required_error: 'تاريخ البدء مطلوب' })
      .refine((date) => date > new Date(), { message: 'تاريخ البدء يجب أن يكون في المستقبل' }),
    endDate: z.coerce.date({ required_error: 'تاريخ الانتهاء مطلوب' }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء',
    path: ['endDate'],
  })
  .refine((data) => {
    const days = (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24);
    return days <= 30;
  }, {
    message: 'الحد الأقصى للحجز هو 30 يوماً',
    path: ['endDate'],
  }),
});
