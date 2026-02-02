import { describe, it, expect, beforeEach } from 'vitest';

describe('Config Validation', () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.REDIS_URL;
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
  });

  it('should validate required environment variables', async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-that-is-at-least-32-characters-long';

    const { config } = await import('../lib/config.js');
    expect(config.databaseUrl).toBeDefined();
    expect(config.redisUrl).toBeDefined();
    expect(config.jwtSecret).toBeDefined();
    expect(config.jwtRefreshSecret).toBeDefined();
  });

  it('should throw error for missing required environment variables', async () => {
    await expect(async () => {
      const { config } = await import('../lib/config.js');
    }).rejects.toThrow('Missing required environment variables');
  });

  it('should validate port number', async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-that-is-at-least-32-characters-long';
    process.env.BACKEND_PORT = '99999';

    await expect(async () => {
      const { config } = await import('../lib/config.js');
    }).rejects.toThrow('BACKEND_PORT must be a valid port number (1-65535)');
  });

  it('should validate JWT secret length', async () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.JWT_SECRET = 'short';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-that-is-at-least-32-characters-long';

    await expect(async () => {
      const { config } = await import('../lib/config.js');
    }).rejects.toThrow('JWT_SECRET must be at least 32 characters');
  });
});
