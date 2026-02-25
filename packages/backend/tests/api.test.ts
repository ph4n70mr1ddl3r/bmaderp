import { describe, it, expect, beforeEach } from 'vitest';
import request from 'superset';
import { app } from '../src/index.js';
import { prisma } from '../src/lib/prisma.js';

describe('API Routes', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('version');
    });
  });

  describe('Public Status', () => {
    it('should return system status', async () => {
      const response = await request(app).get('/api/status').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('memory');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Not Found');
    });

    it('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting Integration', () => {
    it('should respect rate limiting across different endpoints', async () => {
      // Test general rate limiting
      const promises = Array.from({ length: 20 }, () => request(app).get('/api/status'));

      const responses = await Promise.all(promises);
      const rateLimited = responses.filter((r) => r.status === 429);

      // Some requests should be rate limited
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app).get('/api/health').expect(200);

      // Check for common security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe('Response Compression', () => {
    it('should compress large responses', async () => {
      const largeData = { message: 'x'.repeat(10000) };

      const response = await request(app).post('/api/test-large').send(largeData).expect(200);

      // Check if response is compressed (content-encoding header)
      expect(response.headers).toHaveProperty('content-encoding');
      expect(response.headers['content-encoding']).toBe('gzip');
    });
  });

  // Note: You may need to create a test route for /api/test-large in your actual routes
});
