import bcrypt from 'bcryptjs';
import { ValidationError } from '@bmaderp/shared';
import { logger } from './logger.js';

const saltRounds = 12;
const MIN_PASSWORD_LENGTH = 8;

export const hashPassword = async (password: string): Promise<string> => {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  if (!password || typeof password !== 'string') {
    logger.warn('Password validation failed: empty or invalid password');
    return false;
  }
  if (!hash || typeof hash !== 'string') {
    logger.warn('Password validation failed: empty or invalid hash');
    return false;
  }
  return bcrypt.compare(password, hash);
};
