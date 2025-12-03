// packages/backend/src/middleware/errorHandler.ts
import { Express, Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '@bmaderp/shared';
import { logger } from '../lib/logger.js';

export const errorHandler = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    logger.error('Error caught by error handler', err);

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
            },
        };
        res.status(500).json(response);
    }
};
