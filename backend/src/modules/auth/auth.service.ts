import prisma from '../../shared/config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('FATAL: JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ userId }, secret, { expiresIn: '15m' }); // 15 دقيقة كما طلبت
  }

  async register(data: any) {
    const { email, password, name, avatar, isHost } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const error: any = new Error('هذا البريد الإلكتروني مسجل بالفعل');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar,
        role: isHost ? 'HOST' : 'GUEST',
      },
    });

    const token = this.generateToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    };
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const error: any = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      const error: any = new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    };
  }
}
