import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { isMongoConnected } from '../config/database';
import { ApiResponse } from '../utils/response.util';

export function requireDatabaseReady(req: Request, res: Response, next: NextFunction): void {
  // Allow health endpoint through
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  if (!isMongoConnected() || mongoose.connection.readyState !== 1) {
    ApiResponse.error(
      res,
      'Database service is temporarily unavailable. Please verify network access and try again.',
      503
    );
    return;
  }

  next();
}
