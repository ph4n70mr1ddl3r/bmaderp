import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../lib/config.js';
import { UnauthorizedError } from '@bmaderp/shared';
import { logger } from '../lib/logger.js';

interface JwtPayloadExtended {
  userId: string;
  email: string;
  storeId: string;
  role: string;
}

declare module 'express' {
  interface Request {
    user?: JwtPayloadExtended;
  }
}

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthorizedError('Access token required');
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      logger.error('JWT verification failed', err);
      throw new UnauthorizedError('Invalid or expired token');
    }

    req.user = decoded as JwtPayloadExtended;
    next();
  });
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
