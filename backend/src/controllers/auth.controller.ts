import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { TokenService } from '../services/token.service';
import { AdminDataService } from '../services/adminData.service';
import { EmailService } from '../services/email.service';
import { validateEmail, validatePassword, sanitizeInput } from '../validators/auth.validator';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';

function logMongoDebug(action: string) {
  console.log(`\n[MONGO DEBUG - ${action}]`);
  console.log(`readyState: ${mongoose.connection.readyState}`);
  console.log(`connection.name: ${mongoose.connection.name || 'none'}`);
  console.log(`connection.host: ${mongoose.connection.host || 'none'}`);
  console.log(`connection.db.databaseName: ${mongoose.connection.db?.databaseName || 'none'}`);
  console.log(`mongoose.connection.readyState: ${mongoose.connection.readyState}\n`);
}

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      let { email, password, firstName, lastName, fullName, phone, companyName } = req.body;

      if (!firstName && fullName) {
        const parts = fullName.trim().split(/\s+/);
        firstName = parts[0];
        lastName = parts.slice(1).join(' ') || parts[0];
      }

      if (!email || !password || !firstName) {
        ApiResponse.error(res, 'Name, email, and password are required.', 400);
        return;
      }

      lastName = lastName || firstName;

      if (!validateEmail(email)) {
        ApiResponse.error(res, 'Please provide a valid corporate or private email address.', 400);
        return;
      }

      const passCheck = validatePassword(password);
      if (!passCheck.isValid) {
        ApiResponse.error(res, passCheck.message || 'Password too weak.', 400);
        return;
      }

      const normalizedEmail = sanitizeInput(email).trim().toLowerCase();
      
      logMongoDebug('Before Register UserModel.findOne');
      const existingUser = await (UserModel as any).findOne({ email: normalizedEmail });
      console.log('[MONGO DEBUG] User query completed successfully');
      
      if (existingUser) {
        ApiResponse.error(res, 'An account with this email address already exists. Please log in.', 409);
        return;
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userData = {
        email: normalizedEmail,
        passwordHash: hashedPassword,
        firstName: sanitizeInput(firstName).trim(),
        lastName: sanitizeInput(lastName).trim(),
        fullName: `${sanitizeInput(firstName).trim()} ${sanitizeInput(lastName).trim()}`.trim(),
        phone: sanitizeInput(phone || '').trim(),
        companyName: sanitizeInput(companyName || '').trim(),
        role: 'customer' as const, // Strict: always customer
        status: 'active' as const,
      };

      let newUser: any;
      try {
        newUser = await (UserModel as any).create(userData);
      } catch (createErr: any) {
        if (createErr.code === 11000 || (createErr.name === 'MongoServerError' && createErr.code === 11000)) {
          ApiResponse.error(res, 'An account with this email address already exists. Please log in.', 409);
          return;
        }
        throw createErr;
      }

      // Explicit MongoDB verification query
      const verifiedUser = await (UserModel as any).findById(newUser._id);
      if (!verifiedUser) {
        ApiResponse.error(res, 'Failed to verify user creation in MongoDB.', 500);
        return;
      }

      const userIdStr = verifiedUser._id.toString();

      const tokenPayload: { id: string; email: string; role: 'customer' | 'admin'; fullName: string } = {
        id: userIdStr,
        email: verifiedUser.email,
        role: (verifiedUser.role as 'customer' | 'admin') || 'customer',
        fullName: verifiedUser.fullName,
      };

      const accessToken = TokenService.generateAccessToken(tokenPayload);
      const refreshToken = TokenService.generateRefreshToken(tokenPayload);

      await TokenService.saveRefreshToken(userIdStr, refreshToken, req.ip, req.headers['user-agent']);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      await AdminDataService.logAction({
        action: `Customer registered: ${verifiedUser.fullName} (${verifiedUser.email})`,
        user: verifiedUser.fullName,
        userEmail: verifiedUser.email,
        userId: userIdStr,
        role: 'Customer',
        category: 'AUTH',
        recordRef: userIdStr,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      Logger.info(`Registered new user ${verifiedUser.email}`);

      ApiResponse.created(
        res,
        {
          user: {
            id: userIdStr,
            email: verifiedUser.email,
            firstName: verifiedUser.firstName,
            lastName: verifiedUser.lastName,
            fullName: verifiedUser.fullName,
            role: verifiedUser.role,
            tier: verifiedUser.tier || 'Member',
            phone: verifiedUser.phone,
            companyName: verifiedUser.companyName,
          },
          tokens: {
            accessToken,
            refreshToken,
          },
          accessToken,
        },
        'Account created successfully. Welcome to Fly Ayla Private Aviation.'
      );
    } catch (error: any) {
      Logger.error('Register error', error);
      if (error.code === 11000 || (error.name === 'MongoServerError' && error.code === 11000)) {
        ApiResponse.error(res, 'An account with this email address already exists. Please log in.', 409);
        return;
      }
      ApiResponse.error(res, error.message || 'Registration failed due to server error.', 500);
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        ApiResponse.error(res, 'Email and password are required.', 400);
        return;
      }

      const normalizedEmail = sanitizeInput(email).trim().toLowerCase();
      
      logMongoDebug('Before Login UserModel.findOne');
      const user = await (UserModel as any).findOne({ email: normalizedEmail }).select('+passwordHash +password');
      console.log('[MONGO DEBUG] User query completed successfully');

      if (!user) {
        ApiResponse.error(res, 'Invalid email or password.', 401);
        return;
      }

      if (user.status === 'suspended') {
        ApiResponse.error(res, 'Account is suspended. Please contact Fly Ayla Security Desk.', 403);
        return;
      }

      const hash = user.passwordHash || user.password;
      const isMatch = hash ? await bcrypt.compare(password, hash) : false;
      if (!isMatch) {
        ApiResponse.error(res, 'Invalid email or password.', 401);
        return;
      }

      const userIdStr = user._id.toString();

      await (UserModel as any).findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

      const tokenPayload: { id: string; email: string; role: 'customer' | 'admin'; fullName: string } = {
        id: userIdStr,
        email: user.email,
        role: (user.role as 'customer' | 'admin') || 'customer',
        fullName: user.fullName,
      };

      const accessToken = TokenService.generateAccessToken(tokenPayload);
      const refreshToken = TokenService.generateRefreshToken(tokenPayload);

      await TokenService.saveRefreshToken(userIdStr, refreshToken, req.ip, req.headers['user-agent']);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      await AdminDataService.logAction({
        action: `User logged in: ${user.fullName} (${user.role.toUpperCase()})`,
        user: user.fullName,
        userEmail: user.email,
        userId: userIdStr,
        role: user.role,
        category: 'AUTH',
        recordRef: userIdStr,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(
        res,
        {
          user: {
            id: userIdStr,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            role: user.role,
            tier: user.tier || 'Member',
            phone: user.phone || '',
            companyName: user.companyName || '',
          },
          tokens: {
            accessToken,
            refreshToken,
          },
          accessToken,
        },
        'Authentication successful.'
      );
    } catch (error: any) {
      Logger.error('Login error', error);
      ApiResponse.error(res, 'Authentication failed.', 500);
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        ApiResponse.error(res, 'Refresh token not provided.', 401);
        return;
      }

      const decoded = TokenService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        ApiResponse.error(res, 'Invalid or expired refresh token. Please sign in again.', 401);
        return;
      }

      const isValid = await TokenService.isRefreshTokenValid(refreshToken);
      if (!isValid) {
        ApiResponse.error(res, 'Refresh token has been revoked or expired.', 401);
        return;
      }

      const user = await (UserModel as any).findById(decoded.id);

      if (!user || user.status === 'suspended') {
        ApiResponse.error(res, 'User inactive or suspended.', 401);
        return;
      }

      const tokenPayload: { id: string; email: string; role: 'customer' | 'admin'; fullName: string } = {
        id: user._id.toString(),
        email: user.email,
        role: (user.role as 'customer' | 'admin') || 'customer',
        fullName: user.fullName,
      };

      const newAccessToken = TokenService.generateAccessToken(tokenPayload);
      ApiResponse.success(res, { accessToken: newAccessToken, user }, 'Token refreshed successfully.');
    } catch (error: any) {
      Logger.error('Refresh token error', error);
      ApiResponse.error(res, 'Failed to refresh token.', 500);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (refreshToken) {
        await TokenService.revokeRefreshToken(refreshToken);
      }

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      ApiResponse.success(res, null, 'Successfully logged out.');
    } catch (error: any) {
      ApiResponse.error(res, 'Logout failed.', 500);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        ApiResponse.error(res, 'Not authenticated.', 401);
        return;
      }

      logMongoDebug('Before me UserModel.findById');
      const user = await (UserModel as any).findById(req.user.id).select('-password -passwordHash');
      console.log('[MONGO DEBUG] User query completed successfully');

      if (!user) {
        ApiResponse.error(res, 'User record not found in database.', 404);
        return;
      }

      ApiResponse.success(
        res,
        {
          user: {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            role: user.role,
            tier: user.tier || 'Member',
            phone: user.phone || '',
            companyName: user.companyName || '',
          },
        },
        'Session profile fetched.'
      );
    } catch (error: any) {
      ApiResponse.error(res, 'Failed to retrieve session.', 500);
    }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        ApiResponse.error(res, 'Email address is required.', 400);
        return;
      }

      const user = await (UserModel as any).findOne({ email: sanitizeInput(email).toLowerCase() });
      if (user && user.status === 'active') {
        const resetToken = await TokenService.createPasswordResetToken(user._id.toString(), user.email);
        const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
        await EmailService.sendPasswordResetEmail(user.email, resetToken, appUrl);
      }

      ApiResponse.success(
        res,
        null,
        'If an account exists for this email, password reset instructions have been dispatched.'
      );
    } catch (error: any) {
      Logger.error('Forgot Password Error', error);
      ApiResponse.error(res, 'Failed to process password reset request.', 500);
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        ApiResponse.error(res, 'Reset token and new password are required.', 400);
        return;
      }

      if (newPassword.length < 8) {
        ApiResponse.error(res, 'New password must be at least 8 characters long.', 400);
        return;
      }

      const tokenData = await TokenService.verifyPasswordResetToken(token);
      if (!tokenData) {
        ApiResponse.error(res, 'Password reset link is invalid or has expired. Please request a new one.', 400);
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await (UserModel as any).findByIdAndUpdate(tokenData.userId, {
        passwordHash: hashedPassword,
        password: hashedPassword,
        lastPasswordChangeAt: new Date(),
      });
      await TokenService.markPasswordResetTokenUsed(token);

      ApiResponse.success(
        res,
        null,
        'Password has been successfully updated. You may now sign in with your new credentials.'
      );
    } catch (error: any) {
      Logger.error('Reset Password Error', error);
      ApiResponse.error(res, 'Failed to reset password.', 500);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        ApiResponse.error(res, 'Current password and new password are required.', 400);
        return;
      }

      if (newPassword.length < 8) {
        ApiResponse.error(res, 'New password must be at least 8 characters long.', 400);
        return;
      }

      const user = await (UserModel as any).findById(req.user!.id).select('+passwordHash +password');
      if (!user) {
        ApiResponse.error(res, 'User account not found.', 404);
        return;
      }

      const hash = user.passwordHash || user.password;
      const isMatch = hash ? await bcrypt.compare(currentPassword, hash) : false;
      if (!isMatch) {
        ApiResponse.error(res, 'Current password provided is incorrect.', 400);
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await (UserModel as any).findByIdAndUpdate(user._id, {
        passwordHash: hashedPassword,
        password: hashedPassword,
        lastPasswordChangeAt: new Date(),
      });

      ApiResponse.success(res, null, 'Password changed successfully.');
    } catch (error: any) {
      Logger.error('Change Password Error', error);
      ApiResponse.error(res, 'Failed to update password.', 500);
    }
  }

  static async verifyEmail(req: Request, res: Response): Promise<void> {
    ApiResponse.success(res, null, 'Email verified successfully. Your account is fully active.');
  }

  static async resendVerification(req: AuthenticatedRequest, res: Response): Promise<void> {
    const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
    await EmailService.sendVerificationEmail(req.user!.email, 'new_verify_token', appUrl);
    ApiResponse.success(res, null, 'Verification link resent to your email address.');
  }
}
