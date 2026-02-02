import { Express, Request, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../lib/config';

/**
 * Middleware to assign a unique request ID to each request
 */
export const requestIdMiddleware: RequestHandler = (req: Request, res, next) => {
  const requestId = uuidv4();
  (req as Request & { id: string }).id = requestId;
  res.setHeader('X-Request-ID', requestId);
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
  app.use(limiter);
};
