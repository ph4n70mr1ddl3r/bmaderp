import { beforeAll, afterAll } from 'vitest';
import { connectDatabase, disconnectDatabase } from '../src/lib/prisma.js';

// Test database setup and teardown
beforeAll(async () => {
  // Connect to test database
  await connectDatabase();
});

afterAll(async () => {
  // Disconnect from test database
  await disconnectDatabase();
});

// Mock environment for tests
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.REDIS_URL = process.env.TEST_REDIS_URL || 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-that-is-at-least-32-characters-long';
process.env.BACKEND_PORT = '3001'; // Use different port for tests
