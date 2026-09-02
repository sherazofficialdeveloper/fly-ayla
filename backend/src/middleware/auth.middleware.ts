import { Request, Response, NextFunction } from 'express';
import { TokenService, JwtPayload } from '../services/token.service';
import { UserService, UserRecord } from '../services/user.service';
import { isMongoConnected } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: Omit<UserRecord, 'passwordHash'>;
  jwtPayload?: JwtPayload;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // 1. Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      // 2. Check accessToken cookie
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.',
      });
      return;
    }

    const payload = TokenService.verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please sign in again.',
        code: 'TOKEN_EXPIRED',
      });
      return;
    }

    const user = await UserService.findById(payload.id);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User account not found in database.',
      });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({
        success: false,
        message: 'Your account is currently unavailable. Please contact Fly Ayla flight operations.',
      });
      return;
    }

    req.user = user;
    req.jwtPayload = payload;
    next();
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication verification.',
    });
  }
}

