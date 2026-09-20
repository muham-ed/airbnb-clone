import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    listingId: z.string({ required_error: 'listingId مطلوب' }),
    startDate: z.coerce.date({ required_error: 'تاريخ البدء مطلوب' }),
    endDate: z.coerce.date({ required_error: 'تاريخ الانتهاء مطلوب' }),
  }).refine((data) => data.endDate > data.startDate, {
    message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء',
    path: ['endDate'],
  }),
});
