import bcrypt from 'bcryptjs';
import { ValidationError } from '@bmaderp/shared';
import { logger } from './logger.js';

const saltRounds = 12;
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

// Password complexity requirements:
// At least 12 characters
// At least one uppercase letter
// At least one lowercase letter
// At least one number
// At least one special character from @$!%*?&
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,128}$/;

// Common passwords to block
const COMMON_PASSWORDS = [
  'password',
  '123456',
  '12345678',
  'qwerty',
  'abc123',
  'letmein',
  'monkey',
  'password1',
  'welcome',
  'admin',
  'login',
  'user',
];

// Check if password contains common patterns
const hasCommonPattern = (password: string): boolean => {
  const lowerPassword = password.toLowerCase();

  // Check for common passwords
  if (COMMON_PASSWORDS.includes(lowerPassword)) {
    return true;
  }

  // Check for sequential characters (e.g., '1234', 'abcd')
  const sequentialPatterns = [
    /1234/,
    /2345/,
    /3456/,
    /4567/,
    /5678/,
    /6789/,
    /abcd/,
    /bcde/,
    /cdef/,
    /defg/,
    /efgh/,
    /0123/,
    /abcd/,
    /qwerty/,
    /asdfg/,
    /zxcvb/,
  ];

  return sequentialPatterns.some((pattern) => pattern.test(lowerPassword));
};

// Check for character repetition (e.g., 'aaaa', '1111')
const hasCharacterRepetition = (password: string): boolean => {
  const repetitionPattern = /(.)\1{2,}/;
  return repetitionPattern.test(password);
};

export const validatePassword = (password: string): void => {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required');
  }

  const trimmedPassword = password.trim();

  // Check length
  if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (trimmedPassword.length > MAX_PASSWORD_LENGTH) {
    throw new ValidationError(`Password must be less than ${MAX_PASSWORD_LENGTH} characters`);
  }

  // Check complexity requirements
  if (!PASSWORD_REGEX.test(trimmedPassword)) {
    throw new ValidationError(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character from @$!%*?&'
    );
  }

  // Check for common patterns
  if (hasCommonPattern(trimmedPassword)) {
    throw new ValidationError('Password is too common or easily guessable');
  }

  // Check for character repetition
  if (hasCharacterRepetition(trimmedPassword)) {
    throw new ValidationError('Password contains repeated characters');
  }

  // Check for keyboard patterns
  const keyboardPatterns = [
    /qwerty/i,
    /asdf/i,
    /zxcv/i,
    /qwer/i,
    /!@#\$/,
    /%^&/,
    /\(\)_/,
    /\+\{\}/,
    /[[\]|]/,
  ];

  if (keyboardPatterns.some((pattern) => pattern.test(trimmedPassword))) {
    throw new ValidationError('Password contains keyboard patterns');
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  validatePassword(password);
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
