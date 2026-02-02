import { describe, it, expect, vi } from 'vitest';
import { config } from '../src/lib/config.js';

describe('Config Validation', () => {
  it('should have all required config properties', () => {
    expect(config).toBeDefined();
    expect(config.databaseUrl).toBeDefined();
    expect(config.redisUrl).toBeDefined();
    expect(config.jwtSecret).toBeDefined();
    expect(config.jwtRefreshSecret).toBeDefined();
    expect(config.backendPort).toBeDefined();
    expect(config.nodeEnv).toBeDefined();
  });

  it('should validate backendPort is within valid range', () => {
    expect(config.backendPort).toBeGreaterThanOrEqual(1);
    expect(config.backendPort).toBeLessThanOrEqual(65535);
  });

  it('should validate JWT secret and refresh secret lengths', () => {
    expect(config.jwtSecret.length).toBeGreaterThanOrEqual(32);
    expect(config.jwtRefreshSecret.length).toBeGreaterThanOrEqual(32);
  });

  it('should validate rate limiting config', () => {
    expect(config.rateLimitWindowMs).toBeGreaterThan(0);
    expect(config.rateLimitMaxRequests).toBeGreaterThan(0);
  });

  it('should have valid JWT expiry values', () => {
    expect(config.jwtExpiry).toBeDefined();
    expect(config.jwtRefreshExpiry).toBeDefined();
  });
});
