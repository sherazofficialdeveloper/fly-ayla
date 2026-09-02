import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { apiRouter } from './routes/index';
import { isMongoConnected } from './config/database';
import { requireDatabaseReady } from './middleware/dbCheck.middleware';

export function createApp() {
  const app = express();

  // Core Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // CORS
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.APP_URL,
    'http://localhost:3000',
    'http://localhost:5173',
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'Fly Ayla Private Aviation API is running',
      database: isMongoConnected() ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Database Readiness Check for API Operations
  app.use('/api', requireDatabaseReady);

  // REST API Routes
  app.use('/api', apiRouter);

  // Global API 404 handler
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
    });
  });

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Server Error]:', err);
    res.status(err.status || 500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Server error',
    });
  });

  return app;
}
