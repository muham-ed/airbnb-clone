import prisma from '../../shared/config/database';
import bcrypt from 'bcryptjs';
import { UpdateProfileInput } from './users.schema';
import { AppError } from '../../shared/utils/app-error';

export class UsersService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            listings: true,
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('المستخدم غير موجود', 404, 'USER_NOT_FOUND');
    }

    return user;
  }

  async updateMe(userId: string, data: UpdateProfileInput['body']) {
    const { name, avatar, oldPassword, newPassword } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('المستخدم غير موجود', 404, 'USER_NOT_FOUND');
    }

    let hashedPassword = user.password;

    if (newPassword) {
      if (!oldPassword) {
        throw new AppError('كلمة المرور القديمة مطلوبة لتغيير كلمة المرور', 400, 'BAD_REQUEST');
      }

      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        throw new AppError('كلمة المرور القديمة غير صحيحة', 400, 'INVALID_PASSWORD');
      }

      hashedPassword = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(avatar !== undefined && { avatar }),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
