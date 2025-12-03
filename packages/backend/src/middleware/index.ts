// packages/backend/src/middleware/index.ts
import { Express, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';

// Request ID middleware
export const requestIdMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    const requestId = uuidv4();
    _req.id = requestId;
    _res.setHeader('X-Request-ID', requestId);
    next();
};

// Rate limiting
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

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}
