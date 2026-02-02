import { ErrorRequestHandler, Request } from 'express';
import { ApiError, ApiResponse } from '@bmaderp/shared';
import { logger } from '../lib/logger.js';

/**
 * Global error handling middleware
 * Converts errors to standardized API responses
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = (req as Request & { id?: string }).id || 'unknown';
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (err instanceof ApiError) {
    logger.error(`API Error [Request ID: ${requestId}]`, {
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
      retryable: err.retryable,
      path: req.path,
      method: req.method,
    });

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
    logger.error(`Unhandled Error [Request ID: ${requestId}]`, {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });

    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: isDevelopment && err instanceof Error ? err.message : 'Internal server error',
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
