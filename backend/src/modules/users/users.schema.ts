import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'الاسم يجب ألا يقل عن حرفين').optional(),
    avatar: z.string().url('رابط الصورة غير صحيح').nullable().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().min(6, 'كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف').optional(),
  }).refine((data) => {
    if (data.newPassword && !data.oldPassword) {
      return false;
    }
    return true;
  }, {
    message: 'كلمة المرور القديمة مطلوبة لتغيير كلمة المرور',
    path: ['oldPassword'],
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
