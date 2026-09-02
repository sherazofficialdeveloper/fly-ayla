import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { isMongoConnected } from '../config/database';

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  companyName?: string;
  profileImage?: string;
  emailVerified: boolean;
  lastLoginAt?: Date;
  lastPasswordChangeAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  static async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'admin';
    companyName?: string;
  }): Promise<Omit<UserRecord, 'passwordHash'>> {
    const normalizedEmail = data.email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(data.password, 12);
    const fullName = `${data.firstName} ${data.lastName}`.trim();

    const user = await (UserModel as any).create({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      fullName,
      email: normalizedEmail,
      phone: data.phone.trim(),
      passwordHash,
      role: data.role || 'customer',
      status: 'active',
      companyName: data.companyName?.trim() || '',
      emailVerified: false,
    });

    return user.toJSON();
  }

  static async findByEmailWithPassword(email: string): Promise<UserRecord | null> {
    if (!isMongoConnected()) return null;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await (UserModel as any).findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) return null;
    return {
      id: user._id?.toString() || user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName || `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      role: user.role,
      status: user.status,
      companyName: user.companyName,
      profileImage: user.profileImage,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      lastPasswordChangeAt: user.lastPasswordChangeAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async findById(id: string): Promise<Omit<UserRecord, 'passwordHash'> | null> {
    if (!isMongoConnected()) return null;
    const user = await (UserModel as any).findById(id);
    if (!user) return null;
    return user.toJSON();
  }

  static async updateLastLogin(id: string): Promise<void> {
    if (!isMongoConnected()) return;
    const now = new Date();
    await (UserModel as any).findByIdAndUpdate(id, { lastLoginAt: now });
  }

  static async updateProfile(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      companyName?: string;
      profileImage?: string;
    }
  ): Promise<Omit<UserRecord, 'passwordHash'> | null> {
    if (!isMongoConnected()) return null;
    const updates: any = { ...data };
    if (data.firstName && data.lastName) {
      updates.fullName = `${data.firstName} ${data.lastName}`.trim();
    }
    const updated = await (UserModel as any).findByIdAndUpdate(id, updates, { new: true });
    return updated ? updated.toJSON() : null;
  }

  static async updatePassword(id: string, newPassword: string): Promise<boolean> {
    if (!isMongoConnected()) return false;
    const passwordHash = await bcrypt.hash(newPassword, 12);
    const now = new Date();
    const res = await (UserModel as any).findByIdAndUpdate(id, {
      passwordHash,
      lastPasswordChangeAt: now,
    });
    return !!res;
  }

  static async getAllCustomers(): Promise<Array<Omit<UserRecord, 'passwordHash'>>> {
    if (!isMongoConnected()) return [];
    const users = await (UserModel as any).find({ role: 'customer' }).sort({ createdAt: -1 });
    return users.map((u: any) => u.toJSON());
  }

  static async updateCustomerStatus(
    id: string,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<Omit<UserRecord, 'passwordHash'> | null> {
    if (!isMongoConnected()) return null;
    const updated = await (UserModel as any).findByIdAndUpdate(id, { status }, { new: true });
    return updated ? updated.toJSON() : null;
  }
}
