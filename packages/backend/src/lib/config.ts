import dotenv from 'dotenv';

dotenv.config();

interface Config {
  backendPort: number;
  corsOrigin: string;
  nodeEnv: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  databaseUrl: string;
  redisUrl: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiry: string;
  jwtRefreshExpiry: string;
}

const validateConfig = (): Config => {
  const requiredEnvVars = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  const databaseUrl = process.env.DATABASE_URL!;
  const redisUrl = process.env.REDIS_URL!;
  const jwtSecret = process.env.JWT_SECRET!;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;

  // Validate port number
  const backendPort = parseInt(process.env.BACKEND_PORT || '3000', 10);
  if (isNaN(backendPort) || backendPort < 1 || backendPort > 65535) {
    throw new Error('BACKEND_PORT must be a valid port number (1-65535)');
  }

  // Validate rate limiting configuration
  const rateLimitWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
  if (isNaN(rateLimitWindowMs) || rateLimitWindowMs < 0) {
    throw new Error('RATE_LIMIT_WINDOW_MS must be a positive number');
  }

  const rateLimitMaxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
  if (isNaN(rateLimitMaxRequests) || rateLimitMaxRequests < 1) {
    throw new Error('RATE_LIMIT_MAX_REQUESTS must be a positive number');
  }

  const validNodeEnvs = ['development', 'test', 'production'];
  const nodeEnv = process.env.NODE_ENV || 'development';
  if (!validNodeEnvs.includes(nodeEnv)) {
    throw new Error(`NODE_ENV must be one of: ${validNodeEnvs.join(', ')}`);
  }

  // Validate JWT secrets
  if (!isStrongSecret(jwtSecret)) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters and contain uppercase, lowercase, numbers, and special characters'
    );
  }

  if (!isStrongSecret(jwtRefreshSecret)) {
    throw new Error(
      'JWT_REFRESH_SECRET must be at least 32 characters and contain uppercase, lowercase, numbers, and special characters'
    );
  }

  const config: Config = {
    backendPort,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    nodeEnv,
    rateLimitWindowMs,
    rateLimitMaxRequests,
    databaseUrl,
    redisUrl,
    jwtSecret,
    jwtRefreshSecret,
    jwtExpiry: process.env.JWT_EXPIRY || '15m',
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  };

  return config;
};

// Helper function to validate secret strength
const isStrongSecret = (secret: string): boolean => {
  // Check length
  if (secret.length < 32) return false;

  // Check complexity: must contain uppercase, lowercase, numbers, and special characters
  const hasUpperCase = /[A-Z]/.test(secret);
  const hasLowerCase = /[a-z]/.test(secret);
  const hasNumbers = /\d/.test(secret);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(secret);

  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

export const config = validateConfig();
