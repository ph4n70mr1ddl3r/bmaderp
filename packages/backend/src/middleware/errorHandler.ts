import { ErrorRequestHandler, Request } from 'express';
import { ApiError, ApiResponse } from '@bmaderp/shared';
import { logger } from '../lib/logger';

/**
 * Global error handling middleware
 * Converts errors to standardized API responses
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = (req as Request & { id?: string }).id || 'unknown';
  logger.error(`Error caught by error handler [Request ID: ${requestId}]`, err);

  if (err instanceof ApiError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        statusCode: err.statusCode,
        retryable: err.retryable,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        requestId,
      },
    };
    res.status(err.statusCode).json(response);
  } else {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        statusCode: 500,
        retryable: false,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        requestId,
      },
    };
    res.status(500).json(response);
  }
};
