import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { apiRouter } from './routes/index';
import { isMongoConnected } from './config/database';
import { requireDatabaseReady } from './middleware/dbCheck.middleware';

export function createApp() {
  const app = express();

  // =========================================================
  // CORE MIDDLEWARES
  // =========================================================
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // =========================================================
  // CORS CONFIGURATION
  // =========================================================

  const allowedOrigins = [
    'https://fly-ayla.vercel.app',
    process.env.FRONTEND_URL,
    process.env.APP_URL,
    'http://localhost:3000',
    'http://localhost:5173',
  ].filter(Boolean) as string[];

  console.log('[CORS] Allowed Origins:', allowedOrigins);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Requests without an Origin header
        // (Postman, server-to-server, health checks, etc.)
        if (!origin) {
          return callback(null, true);
        }

        // Allow configured origins
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Development mode: allow localhost/dev requests
        if (process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }

        console.warn(`[CORS] Blocked origin: ${origin}`);

        return callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
      },

      credentials: true,

      methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
      ],

      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
      ],

      exposedHeaders: [
        'Content-Length',
        'Content-Type',
      ],

      optionsSuccessStatus: 204,
    })
  );

  // Explicitly handle browser preflight requests
  app.options('*', cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }

      console.warn(`[CORS] Preflight blocked origin: ${origin}`);

      return callback(
        new Error(`CORS policy: Origin ${origin} is not allowed`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],

    optionsSuccessStatus: 204,
  }));

  // =========================================================
  // HEALTH CHECK
  // =========================================================

  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      message: 'Fly Ayla Private Aviation API is running',
      database: isMongoConnected() ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // =========================================================
  // DATABASE READINESS CHECK
  // =========================================================

  app.use('/api', requireDatabaseReady);

  // =========================================================
  // REST API ROUTES
  // =========================================================

  app.use('/api', apiRouter);

  // =========================================================
  // GLOBAL API 404 HANDLER
  // =========================================================

  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
    });
  });

  // =========================================================
  // GLOBAL ERROR HANDLER
  // =========================================================

  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error('[Server Error]:', err);

      // Handle CORS errors cleanly
      if (err?.message?.startsWith('CORS policy:')) {
        return res.status(403).json({
          success: false,
          message: 'CORS origin is not allowed.',
        });
      }

      res.status(err.status || 500).json({
        success: false,
        message:
          process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message || 'Server error',
      });
    }
  );

  return app;
}
