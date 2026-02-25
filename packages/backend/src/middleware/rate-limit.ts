import { Request, Response, NextFunction } from 'express';
import { config } from '../lib/config';
import { RateLimitRequestHandler } from 'express-rate-limit';

export const createRateLimit = (
  windowMs: number,
  max: number,
  message: string
): RateLimitRequestHandler => {
  return require('express-rate-limit')({
    windowMs,
    max,
    message: {
      error: message,
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      });
    },
  });
};

export const createAuthRateLimit = () => {
  return createRateLimit(
    config.rateLimitWindowMs / 10, // Shorter window for auth endpoints
    config.rateLimitMaxRequests / 4, // Fewer requests allowed for auth
    'Too many authentication attempts. Please try again later.'
  );
};

export const createGeneralRateLimit = () => {
  return createRateLimit(
    config.rateLimitWindowMs,
    config.rateLimitMaxRequests,
    'Too many requests. Please try again later.'
  );
};
