import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { RefreshTokenModel } from '../models/RefreshToken';
import { PasswordResetTokenModel } from '../models/PasswordResetToken';
import { isMongoConnected } from '../config/database';
import crypto from 'crypto';

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || 'fly_ayla_access_jwt_secret_2026_super_key';
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'fly_ayla_refresh_jwt_secret_2026_super_key';

const inMemoryRefreshTokens = new Map<string, { userId: string; expiresAt: Date; revokedAt: Date | null }>();
const inMemoryResetTokens = new Map<string, { userId: string; email: string; expiresAt: Date; usedAt: Date | null }>();

export interface JwtPayload {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  fullName: string;
}

export class TokenService {
  static generateAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as any,
    };
    return jwt.sign(payload, ACCESS_SECRET, options);
  }

  static generateRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES || '7d') as any,
    };
    return jwt.sign(payload, REFRESH_SECRET, options);
  }

  static verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }

  static async saveRefreshToken(
    userId: string,
    token: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (isMongoConnected()) {
      await (RefreshTokenModel as any).create({
        userId,
        tokenHash,
        expiresAt,
        ipAddress,
        userAgent,
      });
    } else {
      inMemoryRefreshTokens.set(tokenHash, { userId, expiresAt, revokedAt: null });
    }
  }

  static async isRefreshTokenValid(token: string): Promise<boolean> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (isMongoConnected()) {
      const stored = await (RefreshTokenModel as any).findOne({ tokenHash, revokedAt: null });
      if (!stored) return false;
      return stored.expiresAt > new Date();
    } else {
      const stored = inMemoryRefreshTokens.get(tokenHash);
      if (!stored || stored.revokedAt !== null) return false;
      return stored.expiresAt > new Date();
    }
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    if (isMongoConnected()) {
      await (RefreshTokenModel as any).findOneAndUpdate({ tokenHash }, { revokedAt: new Date() });
    } else {
      const stored = inMemoryRefreshTokens.get(tokenHash);
      if (stored) {
        stored.revokedAt = new Date();
      }
    }
  }

  static async createPasswordResetToken(userId: string, email: string): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    if (isMongoConnected()) {
      await (PasswordResetTokenModel as any).create({
        userId,
        email: email.toLowerCase(),
        tokenHash,
        expiresAt,
      });
    } else {
      inMemoryResetTokens.set(tokenHash, { userId, email: email.toLowerCase(), expiresAt, usedAt: null });
    }

    return rawToken;
  }

  static async verifyPasswordResetToken(
    rawToken: string
  ): Promise<{ userId: string; email: string } | null> {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    if (isMongoConnected()) {
      const record = await (PasswordResetTokenModel as any).findOne({
        tokenHash,
        usedAt: null,
      });

      if (!record || record.expiresAt < new Date()) {
        return null;
      }

      return {
        userId: record.userId.toString(),
        email: record.email,
      };
    } else {
      const record = inMemoryResetTokens.get(tokenHash);
      if (!record || record.usedAt !== null || record.expiresAt < new Date()) {
        return null;
      }
      return {
        userId: record.userId,
        email: record.email,
      };
    }
  }

  static async markPasswordResetTokenUsed(rawToken: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    if (isMongoConnected()) {
      await (PasswordResetTokenModel as any).findOneAndUpdate({ tokenHash }, { usedAt: new Date() });
    } else {
      const record = inMemoryResetTokens.get(tokenHash);
      if (record) {
        record.usedAt = new Date();
      }
    }
  }
}
