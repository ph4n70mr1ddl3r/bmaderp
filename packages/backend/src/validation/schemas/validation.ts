import { z } from 'zod';
import { OrderStatus, OrderType } from '@bmaderp/shared';

// Inventory validation schemas
export const CreateInventoryItemSchema = z
  .object({
    sku: z
      .string()
      .min(1, 'SKU is required')
      .max(50, 'SKU too long')
      .regex(
        /^[A-Z0-9\-_]+$/,
        'SKU can only contain uppercase letters, numbers, hyphens, and underscores'
      ),
    productName: z.string().min(1, 'Product name is required').max(255, 'Product name too long'),
    category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
    quantity: z
      .number()
      .int('Quantity must be an integer')
      .min(0, 'Quantity cannot be negative')
      .max(999999, 'Quantity too large'),
    reorderLevel: z
      .number()
      .int('Reorder level must be an integer')
      .min(0, 'Reorder level cannot be negative')
      .max(999999, 'Reorder level too large'),
    reorderQuantity: z
      .number()
      .int('Reorder quantity must be an integer')
      .min(1, 'Reorder quantity must be at least 1')
      .max(999999, 'Reorder quantity too large'),
    price: z
      .number()
      .min(0, 'Price cannot be negative')
      .max(999999.99, 'Price too large')
      .refine((val) => val >= 0.01, 'Price must be greater than 0'),
    cost: z
      .number()
      .min(0, 'Cost cannot be negative')
      .max(999999.99, 'Cost too large')
      .refine((val) => val >= 0.01, 'Cost must be greater than 0'),
  })
  .refine((data) => data.quantity >= data.reorderLevel, {
    message: 'Quantity must be greater than or equal to reorder level',
    path: ['quantity'],
  })
  .refine((data) => data.price >= data.cost, {
    message: 'Price must be greater than or equal to cost',
    path: ['price'],
  });

export const UpdateInventoryItemSchema = CreateInventoryItemSchema.partial().extend({
  id: z.string().min(1, 'ID is required').max(50, 'ID too long'),
});

export const UpdateInventoryQuantitySchema = z.object({
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative')
    .max(999999, 'Quantity too large'),
  reason: z.string().min(1, 'Reason is required').max(255, 'Reason too long'),
});

// Order validation schemas
export const CreateOrderSchema = z
  .object({
    orderNumber: z.string().min(1, 'Order number is required').max(50, 'Order number too long'),
    orderType: z.nativeEnum(OrderType, {
      errorMap: () => ({ message: 'Invalid order type' }),
    }),
    items: z
      .array(
        z.object({
          sku: z.string().min(1, 'SKU is required').max(50, 'SKU too long'),
          quantity: z
            .number()
            .int('Quantity must be an integer')
            .min(1, 'Quantity must be at least 1')
            .max(999999, 'Quantity too large'),
          price: z
            .number()
            .min(0, 'Price cannot be negative')
            .max(999999.99, 'Price too large')
            .refine((val) => val >= 0.01, 'Price must be greater than 0'),
        })
      )
      .min(1, 'Order must have at least one item')
      .max(1000, 'Order too large'),
    customerId: z.string().min(1, 'Customer ID is required').max(50, 'Customer ID too long'),
    discount: z
      .number()
      .min(0, 'Discount cannot be negative')
      .max(100, 'Discount percentage cannot exceed 100%')
      .optional()
      .default(0),
    taxRate: z
      .number()
      .min(0, 'Tax rate cannot be negative')
      .max(100, 'Tax percentage cannot exceed 100%')
      .optional()
      .default(0),
  })
  .refine(
    (data) => {
      const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discountAmount = (totalAmount * data.discount) / 100;
      const finalAmount = totalAmount - discountAmount;
      return finalAmount >= 0;
    },
    {
      message: 'Final amount cannot be negative after discount',
      path: ['discount'],
    }
  );

export const UpdateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    errorMap: () => ({ message: 'Invalid order status' }),
  }),
  items: z
    .array(
      z.object({
        id: z.string().min(1, 'Item ID is required').max(50, 'Item ID too long'),
        sku: z.string().min(1, 'SKU is required').max(50, 'SKU too long'),
        quantity: z
          .number()
          .int('Quantity must be an integer')
          .min(1, 'Quantity must be at least 1')
          .max(999999, 'Quantity too large'),
        price: z
          .number()
          .min(0, 'Price cannot be negative')
          .max(999999.99, 'Price too large')
          .refine((val) => val >= 0.01, 'Price must be greater than 0'),
      })
    )
    .optional(),
  discount: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount percentage cannot exceed 100%')
    .optional(),
  taxRate: z
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax percentage cannot exceed 100%')
    .optional(),
});

export const OrderSearchSchema = z.object({
  orderNumber: z.string().max(50, 'Order number too long').optional(),
  customerId: z.string().max(50, 'Customer ID too long').optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  orderType: z.nativeEnum(OrderType).optional(),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  page: z
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page number too large')
    .optional()
    .default(1),
  limit: z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'orderNumber', 'totalAmount'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Schedule validation schemas
export const CreateScheduleSchema = z
  .object({
    shiftDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    shiftStart: z
      .string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
    shiftEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
    userId: z.string().min(1, 'User ID is required').max(50, 'User ID too long'),
    storeId: z.string().min(1, 'Store ID is required').max(50, 'Store ID too long'),
  })
  .refine(
    (data) => {
      const startTime = new Date(`2000-01-01T${data.shiftStart}:00`);
      const endTime = new Date(`2000-01-01T${data.shiftEnd}:00`);
      return endTime > startTime;
    },
    {
      message: 'Shift end time must be after start time',
      path: ['shiftEnd'],
    }
  )
  .refine(
    (data) => {
      const shiftDate = new Date(data.shiftDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return shiftDate >= today;
    },
    {
      message: 'Shift date cannot be in the past',
      path: ['shiftDate'],
    }
  );

export const UpdateScheduleSchema = CreateScheduleSchema.partial()
  .extend({
    id: z.string().min(1, 'ID is required').max(50, 'ID too long'),
  })
  .refine(
    (data) => {
      if (data.shiftStart && data.shiftEnd) {
        const startTime = new Date(`2000-01-01T${data.shiftStart}:00`);
        const endTime = new Date(`2000-01-01T${data.shiftEnd}:00`);
        return endTime > startTime;
      }
      return true;
    },
    {
      message: 'Shift end time must be after start time',
      path: ['shiftEnd'],
    }
  );

// Pagination validation
export const PaginationSchema = z.object({
  page: z
    .number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page number too large')
    .optional()
    .default(1),
  limit: z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),
  sortBy: z.string().max(50, 'Sort field too long').optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
