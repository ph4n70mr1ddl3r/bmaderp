import { Express, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const requestId = uuidv4();
  (req as any).id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const setupMiddleware = (app: Express) => {
  app.use(requestIdMiddleware);
  app.use(limiter);
};
