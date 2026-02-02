import { Express, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../lib/config.js';
import { authenticateToken } from './auth.js';
import { logger } from '../lib/logger.js';

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const requestId = uuidv4();
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

export const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
  const requestId = (req as { id?: string }).id || 'unknown';
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 500) {
      logger.error(`HTTP ${req.method} ${req.path} ${res.statusCode}`, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(`HTTP ${req.method} ${req.path} ${res.statusCode}`, logData);
    } else {
      logger.info(`HTTP ${req.method} ${req.path} ${res.statusCode}`, logData);
    }
  });

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
 * Sets up all application middleware including request ID, logging and rate limiting
 * @param app - Express application instance
 */
export const setupMiddleware = (app: Express) => {
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(limiter);
};

export { authenticateToken };
export { requireRole } from './auth.js';
