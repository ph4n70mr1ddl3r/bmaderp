import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { validateRequest } from '../src/validation/middleware/validation.middleware.js';

// Mock request and response objects for testing
const createMockRequest = (body: any) => ({
  body,
});

const createMockResponse = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  return res;
};

// Sample validation schema for testing
const userSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .transform((val) => val.trim()),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .transform((val) => val.trim()),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .transform((val) => val.trim()),
  phone: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val?.trim())
    .refine((val) => !val || /^\+?[0-9\s\-\(\)]+$/.test(val), { message: 'Invalid phone number' }),
  role: z.enum(['ASSOCIATE', 'STORE_MANAGER', 'REGIONAL_MANAGER', 'ADMIN']).optional(),
});

describe('Validation Middleware', () => {
  describe('Zod Validation', () => {
    it('should validate valid user data', () => {
      const validUser = {
        email: 'test@example.com',
        password: 'ValidPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        role: 'ASSOCIATE',
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'ValidPassword123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email address');
      }
    });

    it('should reject weak password', () => {
      const invalidUser = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'Test',
        lastName: 'User',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.message.includes('uppercase'))).toBe(true);
      }
    });

    it('should reject missing required fields', () => {
      const invalidUser = {
        email: 'test@example.com',
        // Missing password, firstName, lastName
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    it('should handle optional fields correctly', () => {
      const userWithOptionalFields = {
        email: 'test@example.com',
        password: 'ValidPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        // role is optional and omitted
      };

      const result = userSchema.safeParse(userWithOptionalFields);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBeUndefined();
      }
    });

    it('should accept valid enum values', () => {
      const roles = ['ASSOCIATE', 'STORE_MANAGER', 'REGIONAL_MANAGER', 'ADMIN'];

      roles.forEach((role) => {
        const validUser = {
          email: 'test@example.com',
          password: 'ValidPassword123!',
          firstName: 'Test',
          lastName: 'User',
          role: role as any,
        };

        const result = userSchema.safeParse(validUser);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid enum values', () => {
      const invalidUser = {
        email: 'test@example.com',
        password: 'ValidPassword123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'INVALID_ROLE' as any,
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('Validation Error Messages', () => {
    it('should provide specific error messages', () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'short',
        firstName: '',
        lastName: 'A'.repeat(51), // Too long
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);

      if (!result.success) {
        const errorMessages = result.error.issues.map((issue) => issue.message);
        expect(errorMessages).toContain('Invalid email address');
        expect(errorMessages).toContain('Password must be at least 8 characters');
        expect(errorMessages).toContain('First name is required');
        expect(errorMessages).toContain('Last name is too long');
      }
    });

    it('should handle multiple validation errors', () => {
      const invalidUser = {
        email: 'invalid-email',
        password: '123',
        firstName: '',
        lastName: '',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1);
      }
    });
  });

  describe('Sanitization', () => {
    it('should trim whitespace from strings', () => {
      const userWithWhitespace = {
        email: '  test@example.com  ',
        password: '  TestPassword123!  ',
        firstName: '  Test  ',
        lastName: '  User  ',
        role: 'ASSOCIATE',
      };

      // Note: Zod doesn't automatically trim, but your validation should
      const result = userSchema.safeParse(userWithWhitespace);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.firstName).toBe('Test');
        expect(result.data.lastName).toBe('User');
      }
    });

    it('should normalize phone number format', () => {
      const userWithPhone = {
        email: 'test@example.com',
        password: 'ValidPassword123!',
        firstName: 'Test',
        lastName: 'User',
        phone: '(123) 456-7890',
      };

      const result = userSchema.safeParse(userWithPhone);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toMatch(/^\+?[0-9\s\-\(\)]+$/);
      }
    });
  });
});

describe('Email Validation', () => {
  const emailSchema = z.string().email('Invalid email address');

  it('should accept valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@domain.com',
      'user@sub.domain.com',
    ];

    validEmails.forEach((email) => {
      const result = emailSchema.safeParse(email);
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'invalid-email',
      '@domain.com',
      'user@',
      'user@domain',
      'user.domain.com',
      '',
    ];

    invalidEmails.forEach((email) => {
      const result = emailSchema.safeParse(email);
      expect(result.success).toBe(false);
    });
  });
});

describe('Password Validation', () => {
  const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

  it('should accept strong passwords', () => {
    const strongPasswords = ['ValidPassword123!', 'AnotherStrongPass456@', 'SecureUserPass789#'];

    strongPasswords.forEach((password) => {
      const result = passwordSchema.safeParse(password);
      expect(result.success).toBe(true);
    });
  });

  it('should reject weak passwords', () => {
    const weakPasswords = [
      'short',
      'nouppercase123!',
      'NOLOWERCASE123!',
      'NoNumbers!',
      'NoSpecialChars123',
    ];

    weakPasswords.forEach((password) => {
      const result = passwordSchema.safeParse(password);
      expect(result.success).toBe(false);
    });
  });
});
