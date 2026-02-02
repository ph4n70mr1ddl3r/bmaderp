// User Roles - exported from types/index.ts
export { UserRole } from '../types/index.js';

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
} as const;

// Order Type
export const ORDER_TYPE = {
  ONLINE: 'ONLINE',
  OMNICHANNEL: 'OMNICHANNEL',
  IN_STORE: 'IN_STORE',
} as const;

// Swap Status
export const SWAP_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

// Sync Status
export const SYNC_STATUS = {
  PENDING: 'PENDING',
  SYNCED: 'SYNCED',
  CONFLICT: 'CONFLICT',
  ERROR: 'ERROR',
} as const;

// API Version
export const API_VERSION = 'v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // Inventory
  INVENTORY_LIST: '/inventory',
  INVENTORY_GET: '/inventory/:sku',
  INVENTORY_UPDATE: '/inventory/:sku',
  INVENTORY_SYNC: '/inventory/sync',

  // Orders
  ORDERS_LIST: '/orders',
  ORDERS_CREATE: '/orders',
  ORDERS_GET: '/orders/:id',
  ORDERS_FULFILL: '/orders/:id/fulfill',
  ORDERS_RETURN: '/orders/:id/return',

  // Dashboard
  DASHBOARD_KPIS: '/dashboard/kpis',
  DASHBOARD_SALES: '/dashboard/sales',
  DASHBOARD_LEADERBOARD: '/dashboard/leaderboard',

  // Scheduling
  SCHEDULES_LIST: '/schedules',
  SCHEDULES_CREATE: '/schedules',
  SCHEDULES_SWAP_REQUEST: '/schedules/:id/swap',
  SCHEDULES_SWAP_APPROVE: '/schedules/swap/:id/approve',
  SCHEDULES_ATTENDANCE: '/schedules/:id/attendance',

  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_STORES: '/admin/stores',
  ADMIN_AUDIT_LOG: '/admin/audit-log',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Sync Defaults
export const SYNC_CONFIG = {
  POLL_INTERVAL_MS: 60000, // 60 seconds
  RETRY_MAX_ATTEMPTS: 5,
  RETRY_BASE_DELAY_MS: 1000,
  CONFLICT_CHECK_INTERVAL_MS: 5000,
} as const;

// JWT Defaults (in seconds)
export const JWT_CONFIG = {
  EXPIRY_SECONDS: 15 * 60, // 15 minutes
  REFRESH_EXPIRY_SECONDS: 7 * 24 * 60 * 60, // 7 days
} as const;

// Error Codes
export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT_DETECTED: 'CONFLICT_DETECTED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// Log Levels
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  API_REQUEST: 30000,
  DATABASE_QUERY: 10000,
  CACHE_OPERATION: 5000,
  GRACEFUL_SHUTDOWN: 10000,
} as const;
