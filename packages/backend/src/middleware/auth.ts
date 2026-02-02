import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../lib/config.js';
import { UnauthorizedError } from '@bmaderp/shared';
import { logger } from '../lib/logger.js';

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Access token required');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      email: string;
      storeId: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      logger.error('JWT token expired', err);
      throw new UnauthorizedError('Token expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      logger.error('JWT token invalid', err);
      throw new UnauthorizedError('Invalid token');
    }
    logger.error('JWT verification failed', err);
    throw new UnauthorizedError('Invalid or expired token');
  }
};

export const requireRole = (...allowedRoles: string[]) => {
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
