import { Express, RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { authenticateToken } from './auth.js';
import { logger } from '../lib/logger.js';
import { createAuthRateLimit, createGeneralRateLimit } from './rate-limit.js';
import { generateCsrfToken, skipCsrfForPublicEndpoints } from './csrf.js';

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

// Create reusable rate limiters
const generalRateLimiter = createGeneralRateLimit();
const authRateLimiter = createAuthRateLimit();

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
  app.use(generalRateLimiter);

  // Apply CSRF protection for state-changing requests
  app.use(skipCsrfForPublicEndpoints);

  // Generate CSRF token endpoint (public)
  app.get('/api/csrf-token', generateCsrfToken);

  // Apply auth-specific rate limiting
  app.use('/api/auth', authRateLimiter);

  // Apply restrictive login rate limiting
  app.use('/api/auth/login', loginLimiter);
};

export { authenticateToken };
export { requireRole } from './auth.js';
