import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'البريد الإلكتروني مطلوب' }).email('صيغة البريد الإلكتروني غير صحيحة'),
    password: z.string({ required_error: 'كلمة المرور مطلوبة' }).min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
    name: z.string({ required_error: 'الاسم مطلوب' }).min(2, 'الاسم قصير جداً'),
    avatar: z.string().url('رابط الصورة غير صحيح').optional(),
    isHost: z.boolean().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'البريد الإلكتروني مطلوب' }).email('صيغة البريد الإلكتروني غير صحيحة'),
    password: z.string({ required_error: 'كلمة المرور مطلوبة' }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
