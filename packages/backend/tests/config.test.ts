import { describe, it, expect } from 'vitest';

describe('Config Validation', () => {
  it('should validate required environment variables', () => {
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

  it('should throw error for missing required environment variables', () => {
    delete process.env.DATABASE_URL;
    expect(() => {
      require('../lib/config.js');
    }).toThrow('Missing required environment variables');
  });
});
