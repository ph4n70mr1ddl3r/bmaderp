import { Request, Response } from 'express';
import { config } from '../lib/config';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

export const createRateLimit = (
  windowMs: number,
  max: number,
  message: string
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      });
    },
  });
};

export const createAuthRateLimit = () => {
  // Validate config values and provide fallbacks
  const authWindowMs = Math.max(60000, config.rateLimitWindowMs / 10); // Minimum 1 minute
  const authMaxRequests = Math.max(3, Math.min(10, config.rateLimitMaxRequests / 4)); // Between 3-10 requests

  return createRateLimit(
    authWindowMs,
    authMaxRequests,
    'Too many authentication attempts. Please try again later.'
  );
};

export const createGeneralRateLimit = () => {
  // Validate config values and provide fallbacks
  const windowMs = Math.max(60000, config.rateLimitWindowMs); // Minimum 1 minute
  const maxRequests = Math.max(10, config.rateLimitMaxRequests); // Minimum 10 requests

  return createRateLimit(windowMs, maxRequests, 'Too many requests. Please try again later.');
};
