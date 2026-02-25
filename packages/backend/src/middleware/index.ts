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

// Auth-specific rate limiting (more restrictive for login/refresh)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for non-auth endpoints
    return !req.path.startsWith('/api/auth/login') && !req.path.startsWith('/api/auth/refresh');
  },
});

// Even more restrictive for login endpoint
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Allow only 3 login attempts per 5 minutes
  message: 'Too many login attempts. Account temporarily locked.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.path.startsWith('/api/auth/login'),
});

/**
 * Sets up all application middleware including request ID, logging and rate limiting
 * @param app - Express application instance
 */
export const setupMiddleware = (app: Express) => {
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

  // Apply general rate limiting first
  app.use(limiter);

  // Apply auth-specific rate limiting
  app.use('/api/auth', authLimiter);

  // Apply restrictive login rate limiting
  app.use('/api/auth/login', loginLimiter);
};

export { authenticateToken };
export { requireRole } from './auth.js';
