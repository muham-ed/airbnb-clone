import prisma from '../../shared/config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from './auth.schema';
import { AppError } from '../../shared/utils/app-error';

export class AuthService {
  public generateAccessToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('FATAL: JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ userId }, secret, { expiresIn: '15m' });
  }

  async register(data: RegisterInput['body']) {
    const { email, password, name, avatar, role } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('هذا البريد الإلكتروني مسجل بالفعل', 409, 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar,
        role: role || 'GUEST',
      },
    });

    const token = this.generateAccessToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    };
  }

  async login(data: LoginInput['body']) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401, 'INVALID_CREDENTIALS');
    }

    const token = this.generateAccessToken(user.id);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    };
  }
}
