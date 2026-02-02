/**
 * Main application entry point for bmaderp backend API server
 */
// packages/backend/src/index.ts
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';

import { setupMiddleware } from './middleware/index.js';
import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './lib/logger.js';
import { config } from './lib/config.js';
import { connectRedis, disconnectRedis } from './lib/redis.js';
import { connectDatabase, disconnectDatabase } from './lib/prisma.js';

const app: Express = express();
const port = config.backendPort;

app.use(helmet());
const corsOrigins =
  config.nodeEnv === 'production'
    ? config.corsOrigin
      ? config.corsOrigin.split(',')
      : []
    : [config.corsOrigin];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
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

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
