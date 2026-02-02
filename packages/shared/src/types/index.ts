// API Response Types - Standardized format for all endpoints
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode: number;
    retryable: boolean;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ValidatedPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Authentication & Authorization
export enum UserRole {
  ASSOCIATE = 'ASSOCIATE',
  STORE_MANAGER = 'STORE_MANAGER',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  ADMIN = 'ADMIN',
}

export interface JwtPayload {
  userId: string;
  email: string;
  storeId: string;
  role: string;
  iat: number;
  exp: number;
}

export interface User {
  id: string;
  storeId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  storeId: string;
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  reorderQuantity: number;
  price: number;
  cost: number;
  lastSyncAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventorySyncRecord {
  id: string;
  inventoryItemId: string;
  storeId: string;
  clientQuantity: number;
  serverQuantity: number;
  conflictDetected: boolean;
  resolution: 'server-wins' | 'client-wins' | 'merged';
  createdAt: Date;
}

// Order Types
export enum OrderStatus {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  ONLINE = 'ONLINE',
  OMNICHANNEL = 'OMNICHANNEL',
  IN_STORE = 'IN_STORE',
}

export interface OrderItem {
  id: string;
  orderId: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  status: OrderStatus;
  orderType: OrderType;
  totalAmount: number;
  items: OrderItem[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  fulfilledAt?: Date;
}

// Schedule Types
export enum SwapStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Schedule {
  id: string;
  storeId: string;
  userId: string;
  shiftDate: Date;
  shiftStart: string; // "09:00"
  shiftEnd: string; // "17:00"
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SwapRequest {
  id: string;
  scheduleId: string;
  requestedFromUserId: string;
  status: SwapStatus;
  reason?: string;
  createdAt: Date;
  reviewedAt?: Date;
}

export interface Attendance {
  id: string;
  scheduleId: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Sales Record Types
export interface SalesRecord {
  id: string;
  storeId: string;
  userId: string;
  amount: number;
  category: string;
  recordDate: Date;
  createdAt: Date;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  storeId: string;
  action: string;
  resource: string;
  resourceId: string;
  userId?: string;
  changes?: Record<string, unknown>;
  createdAt: Date;
}

// Sync Queue Types
export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
  CONFLICT = 'CONFLICT',
  ERROR = 'ERROR',
}

export interface SyncQueue {
  id: string;
  storeId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: string;
  resourceId: string;
  payload: Record<string, unknown>;
  clientTimestamp: Date;
  status: SyncStatus;
  retryCount: number;
  createdAt: Date;
  syncedAt?: Date;
}

// Error Types
export class ApiError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super('CONFLICT_DETECTED', 409, message, true);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super('VALIDATION_ERROR', 400, message, false);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', 404, `${resource} with id ${id} not found`, false);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', 401, message, false);
    this.name = 'UnauthorizedError';
  }
}
