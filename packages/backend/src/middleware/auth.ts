import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../lib/config.js';
import { UnauthorizedError, UserRole, JwtPayload } from '@bmaderp/shared';
import { logger } from '../lib/logger.js';

// Extend Express Request interface with user type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        storeId: string;
        role: UserRole;
      };
    }
  }
}

const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

const isValidJwtPayload = (payload: unknown): payload is JwtPayload => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'userId' in payload &&
    'email' in payload &&
    'storeId' in payload &&
    'role' in payload &&
    typeof payload.userId === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.storeId === 'string' &&
    typeof payload.role === 'string'
  );
};

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || typeof authHeader !== 'string') {
    throw new UnauthorizedError('Authorization header required');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Invalid authorization format. Expected: Bearer <token>');
  }

  const token = authHeader.split(' ')[1];

  if (!token || typeof token !== 'string') {
    throw new UnauthorizedError('Access token required');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!isValidJwtPayload(decoded)) {
      throw new UnauthorizedError('Invalid token payload structure');
    }

    if (!isValidUserRole(decoded.role)) {
      throw new UnauthorizedError('Invalid user role in token');
    }

    // Validate required fields
    if (!decoded.userId.trim() || !decoded.email.trim() || !decoded.storeId.trim()) {
      throw new UnauthorizedError('Invalid token: missing required fields');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(decoded.email)) {
      throw new UnauthorizedError('Invalid email format in token');
    }

    req.user = {
      userId: decoded.userId.trim(),
      email: decoded.email.trim(),
      storeId: decoded.storeId.trim(),
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      logger.error('JWT token expired', { userId: req.user?.userId, error: err.message });
      throw new UnauthorizedError('Token expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      logger.error('JWT token invalid', { error: err.message });
      throw new UnauthorizedError('Invalid token');
    }
    if (err instanceof UnauthorizedError) {
      logger.error('Authentication failed', { error: err.message });
      throw err;
    }
    logger.error('JWT verification failed', { error: err instanceof Error ? err.message : err });
    throw new UnauthorizedError('Invalid or expired token');
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    next();
  };
};
