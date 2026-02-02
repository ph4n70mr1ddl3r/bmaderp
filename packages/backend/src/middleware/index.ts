import { Express, Request, RequestHandler, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../lib/config.js';
import { authenticateToken } from './auth.js';
import { ApiResponse } from '@bmaderp/shared';

/**
 * Middleware to assign a unique request ID to each request
 */
export const requestIdMiddleware: RequestHandler = (req: Request, res, next) => {
  const requestId = uuidv4();
  (req as Request & { id: string }).id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

/**
 * Middleware to validate JSON body size and structure
 */
export const validateBodyMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.is('application/json') && req.body) {
    try {
      const bodySize = JSON.stringify(req.body).length;
      if (bodySize > 1024 * 1024) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'PAYLOAD_TOO_LARGE',
            message: 'Request body exceeds maximum size',
            statusCode: 413,
            retryable: false,
          },
        };
        return res.status(413).json(response);
      }
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Invalid JSON in request body',
          statusCode: 400,
          retryable: false,
        },
      };
      return res.status(400).json(response);
    }
  }
  next();
};

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Sets up all application middleware including request ID and rate limiting
 * @param app - Express application instance
 */
export const setupMiddleware = (app: Express) => {
  app.use(requestIdMiddleware);
  app.use(validateBodyMiddleware);
  app.use(limiter);
};

export { authenticateToken };
export { requireRole } from './auth.js';
