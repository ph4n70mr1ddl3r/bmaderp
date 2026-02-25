import { describe, it, expect, beforeEach } from 'vitest';
import request from 'superset';
import { app } from '../src/index.js';

describe('Middleware Tests', () => {
  describe('Rate Limiting', () => {
    it('should apply rate limiting to auth endpoints', async () => {
      // Simulate multiple requests to login endpoint
      const promises = Array.from({ length: 10 }, () =>
        request(app).post('/api/auth/login').send({
          email: 'test@example.com',
          password: 'testpassword',
        })
      );

      const responses = await Promise.all(promises);

      // First few requests should succeed (429 is rate limit exceeded)
      let rateLimited = 0;
      responses.forEach((response, index) => {
        if (response.status === 429) {
          rateLimited++;
          expect(response.body.success).toBe(false);
          expect(response.body.error).toContain('Too many login attempts');
        }
      });

      // At least some requests should be rate limited
      expect(rateLimited).toBeGreaterThan(0);
    });
  });

  describe('CSRF Protection', () => {
    it('should generate CSRF token', async () => {
      const response = await request(app).get('/api/csrf-token').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.data).toHaveProperty('csrfToken');
    });

    it('should allow GET requests without CSRF', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should require CSRF for POST requests', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword',
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid CSRF token');
    });
  });

  describe('CORS', () => {
    it('should allow requests from allowed origins', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should block requests from disallowed origins in production', async () => {
      // Mock production environment
      process.env.NODE_ENV = 'production';
      process.env.CORS_ORIGIN = 'http://allowed.com';

      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://disallowed.com')
        .expect(403);

      expect(response.body.error).toContain('Not allowed by CORS');

      // Reset environment
      process.env.NODE_ENV = 'test';
    });
  });

  describe('Request ID', () => {
    it('should include request ID in response headers', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.headers).toHaveProperty('x-request-id');
      expect(response.headers['x-request-id']).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });
  });

  describe('Request Logging', () => {
    it('should log requests', async () => {
      // This test mainly verifies the middleware doesn't throw errors
      const response = await request(app).get('/api/health').expect(200);
      expect(response.body.success).toBe(true);
    });
  });
});
