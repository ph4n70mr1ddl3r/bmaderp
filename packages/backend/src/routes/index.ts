// packages/backend/src/routes/index.ts
import { Express, Router } from 'express';
import { logger } from '../lib/logger.js';
import { ApiResponse, API_VERSION } from '@bmaderp/shared';

/**
 * Creates the API router with versioned endpoints
 * @returns Express Router with all API routes
 */
const createApiRouter = (): Router => {
  const router = Router();

  router.get('/health', (_req, res) => {
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.0.1',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
    };

    const response: ApiResponse<typeof healthData> = {
      success: true,
      data: healthData,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    };
    res.json(response);
  });

  return router;
};

/**
 * Sets up all application routes including API versioning and 404 handler
 * @param app - Express application instance
 */
export const setupRoutes = (app: Express) => {
  const apiRouter = createApiRouter();
  app.use(`/api/${API_VERSION}`, apiRouter);

  app.use((_req, res) => {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint not found',
        statusCode: 404,
        retryable: false,
      },
    };
    res.status(404).json(response);
  });

  logger.info('Routes initialized');
};
