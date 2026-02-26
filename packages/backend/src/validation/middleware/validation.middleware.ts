import { Request, Response, NextFunction } from 'express';
import { validationResult, body, query, param } from 'express-validator';
import { ValidationError } from '@bmaderp/shared';

// Input sanitization function
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Output sanitization function to prevent XSS
const sanitizeOutput = (data: unknown): unknown => {
  if (typeof data === 'string') {
    return data
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeOutput(item));
  }

  if (data && typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      sanitized[key] = sanitizeOutput(value);
    }
    return sanitized;
  }

  return data;
};

import { ValidationChain } from 'express-validator';

export const withValidation = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        field: 'param' in error ? error.param : 'unknown',
        message: sanitizeOutput(error.msg),
      }));

      throw new ValidationError(`Validation failed: ${JSON.stringify(errorMessages)}`);
    }

    // Sanitize input data
    if (req.body) {
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeInput(req.body[key]);
        }
      });
    }

    next();
  };
};

// Auth validation chains
export const validateLogin = withValidation([
  body('email').isEmail().withMessage('Invalid email format').trim().normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password is required')
    .isLength({ min: 1, max: 128 })
    .withMessage('Password must be between 1 and 128 characters')
    .trim(),
]);

export const validateRegister = withValidation([
  body('email').isEmail().withMessage('Invalid email format').trim().normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password is required')
    .isLength({ min: 12, max: 128 })
    .withMessage('Password must be between 12 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character')
    .trim(),
  body('firstName')
    .isString()
    .withMessage('First name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name contains invalid characters')
    .trim(),
  body('lastName')
    .isString()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name contains invalid characters')
    .trim(),
  body('role')
    .isString()
    .withMessage('Role is required')
    .isIn(['ASSOCIATE', 'STORE_MANAGER', 'REGIONAL_MANAGER', 'ADMIN'])
    .withMessage('Invalid user role'),
]);

// Inventory validation chains
export const validateCreateInventoryItem = withValidation([
  body('sku')
    .isString()
    .withMessage('SKU is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('SKU must be between 1 and 50 characters')
    .matches(/^[A-Z0-9\-_]+$/)
    .withMessage('SKU can only contain uppercase letters, numbers, hyphens, and underscores')
    .trim(),
  body('productName')
    .isString()
    .withMessage('Product name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Product name must be between 1 and 255 characters')
    .trim(),
  body('category')
    .isString()
    .withMessage('Category is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters')
    .trim(),
  body('quantity')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Quantity must be an integer between 0 and 999999'),
  body('reorderLevel')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Reorder level must be an integer between 0 and 999999'),
  body('reorderQuantity')
    .isInt({ min: 1, max: 999999 })
    .withMessage('Reorder quantity must be an integer between 1 and 999999'),
  body('price')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Price must be a number greater than 0 and less than 999999.99'),
  body('cost')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Cost must be a number greater than 0 and less than 999999.99'),
]);

export const validateUpdateInventoryQuantity = withValidation([
  body('quantity')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Quantity must be an integer between 0 and 999999'),
  body('reason')
    .isString()
    .withMessage('Reason is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Reason must be between 1 and 255 characters')
    .trim(),
]);

// Order validation chains
export const validateCreateOrder = withValidation([
  body('orderNumber')
    .isString()
    .withMessage('Order number is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Order number must be between 1 and 50 characters')
    .trim(),
  body('orderType')
    .isString()
    .isIn(['ONLINE', 'OMNICHANNEL', 'IN_STORE'])
    .withMessage('Invalid order type'),
  body('items')
    .isArray({ min: 1, max: 1000 })
    .withMessage('Items must be an array with 1 to 1000 items'),
  body('items.*.sku')
    .isString()
    .withMessage('Item SKU is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Item SKU must be between 1 and 50 characters')
    .trim(),
  body('items.*.quantity')
    .isInt({ min: 1, max: 999999 })
    .withMessage('Item quantity must be an integer between 1 and 999999'),
  body('items.*.price')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Item price must be a number greater than 0 and less than 999999.99'),
  body('customerId')
    .isString()
    .withMessage('Customer ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Customer ID must be between 1 and 50 characters')
    .trim(),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be a number between 0 and 100'),
  body('taxRate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Tax rate must be a number between 0 and 100'),
]);

// Pagination validation
export const validatePagination = withValidation([
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Page must be an integer between 1 and 1000'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('sortBy')
    .optional()
    .isString()
    .isIn(['createdAt', 'updatedAt', 'orderNumber', 'totalAmount'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isString()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either "asc" or "desc'),
]);

// Generic ID validation
export const validateIdParam = withValidation([
  param('id')
    .isString()
    .withMessage('ID is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('ID must be between 1 and 50 characters')
    .trim(),
]);

// Search query validation
export const validateOrderSearch = withValidation([
  query('orderNumber')
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage('Order number must be less than 50 characters')
    .trim(),
  query('customerId')
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage('Customer ID must be less than 50 characters')
    .trim(),
  query('status')
    .optional()
    .isString()
    .isIn(['PENDING', 'FULFILLED', 'RETURNED', 'CANCELLED'])
    .withMessage('Invalid status'),
  query('orderType')
    .optional()
    .isString()
    .isIn(['ONLINE', 'OMNICHANNEL', 'IN_STORE'])
    .withMessage('Invalid order type'),
  query('dateFrom')
    .optional()
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
  query('dateTo')
    .optional()
    .isString()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format'),
]);
