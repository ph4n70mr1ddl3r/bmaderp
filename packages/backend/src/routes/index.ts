// packages/backend/src/routes/index.ts
import { Express } from 'express';
import { logger } from '../lib/logger.js';

export const setupRoutes = (app: Express) => {
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint not found',
        statusCode: 404,
        retryable: false,
      },
    });
  });

  logger.info('Routes initialized');
};
