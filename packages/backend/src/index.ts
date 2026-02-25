/**
 * Main application entry point for bmaderp backend API server
 */
// packages/backend/src/index.ts
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';

import { setupMiddleware } from './middleware/index.js';
import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './lib/logger.js';
import { config } from './lib/config.js';
import { connectRedis, disconnectRedis } from './lib/redis.js';
import { connectDatabase, disconnectDatabase } from './lib/prisma.js';
import { TIMEOUTS } from '@bmaderp/shared';

const app: Express = express();
const port = config.backendPort;

app.use(helmet());
app.use(compression());

const isAllowedOrigin = (origin: string): boolean => {
  if (!origin) return false;

  const allowedOrigins = config.corsOrigin
    ? config.corsOrigin.split(',').map((origin) => origin.trim())
    : [];

  // Always allow localhost in development
  if (config.nodeEnv !== 'production') {
    return origin.startsWith('http://localhost') || origin.startsWith('https://localhost');
  }

  // In production, only allow explicitly defined origins
  return allowedOrigins.includes(origin);
};

const corsOrigins =
  config.nodeEnv === 'production'
    ? config.corsOrigin
      ? config.corsOrigin.split(',').map((origin) => origin.trim())
      : []
    : ['http://localhost:5173']; // Explicitly allow only development server

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is allowed
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      // Log blocked origin for security monitoring
      logger.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: config.nodeEnv !== 'production', // Only allow credentials in trusted environments
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit', 'X-Sort-By', 'X-Sort-Order'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Custom middleware
setupMiddleware(app);

// API routes
setupRoutes(app);

// Error handling (must be last)
app.use(errorHandler);

// Start server
const server = createServer(app);

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Connect to Redis
    await connectRedis();

    server.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await disconnectRedis();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection', error);
    }

    try {
      await disconnectDatabase();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error closing database connection', error);
    }

    process.exit(0);
  });

  // Force close after timeout
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, TIMEOUTS.GRACEFUL_SHUTDOWN);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
