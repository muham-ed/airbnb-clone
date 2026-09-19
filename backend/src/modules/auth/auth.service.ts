import prisma from '../../shared/config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
  }

  async register(data: any) {
    const { email, password, name, avatar, isHost } = data;

    // 1. تحقق من تكرار البريد الإلكتروني
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const error: any = new Error('هذا البريد الإلكتروني مسجل بالفعل');
      error.statusCode = 409;
      throw error;
    }

    // 2. تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. إنشاء المستخدم في قاعدة البيانات
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar,
        isHost: isHost || false,
      },
    });

    // 4. توليد الـ Token
    const token = this.generateToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, isHost: user.isHost },
      token,
    };
  }

  async login(data: any) {
    const { email, password } = data;

    // 1. البحث عن المستخدم
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const error: any = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      error.statusCode = 401;
      throw error;
    }

    // 2. التحقق من كلمة المرور
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      const error: any = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      error.statusCode = 401;
      throw error;
    }

    // 3. توليد الـ Token
    const token = this.generateToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, isHost: user.isHost },
      token,
    };
  }
}
