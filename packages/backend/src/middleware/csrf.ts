import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';
import { config } from '../lib/config';
import { logger } from '../lib/logger';

// Configure CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'strict' : 'lax',
    path: '/',
    maxAge: config.nodeEnv === 'production' ? 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000, // 24 hours in production, 12 hours in development
  },
});

export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  csrfProtection(req, res, (err) => {
    if (err) {
      logger.error('CSRF token generation failed', { error: err.message });
      return res.status(500).json({
        success: false,
        error: 'Failed to generate CSRF token',
      });
    }
    next();
  });
};

export const validateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  csrfProtection(req, res, (err) => {
    if (err) {
      logger.warn('CSRF validation failed', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      return res.status(403).json({
        success: false,
        error: 'Invalid CSRF token',
        message: 'Your request could not be verified due to an invalid security token.',
      });
    }
    next();
  });
};

// CSRF protection is skipped for GET, HEAD, OPTIONS requests
// and for API paths that don't modify state
export const skipCsrfForPublicEndpoints = (req: Request, res: Response, next: NextFunction) => {
  const publicMethods = ['GET', 'HEAD', 'OPTIONS'];
  const publicPaths = ['/api/public/', '/api/health', '/api/docs', '/api/status'];

  if (
    publicMethods.includes(req.method) ||
    publicPaths.some((path) => req.path.startsWith(path)) ||
    req.path.startsWith('/api/auth/logout') // Logout doesn't need CSRF as it clears auth
  ) {
    next();
  } else {
    validateCsrfToken(req, res, next);
  }
};
