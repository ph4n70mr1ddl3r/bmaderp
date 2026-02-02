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
}

const validateConfig = (): Config => {
  const requiredEnvVars = ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  const databaseUrl = process.env.DATABASE_URL;
  const redisUrl = process.env.REDIS_URL;
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!databaseUrl || !redisUrl || !jwtSecret || !jwtRefreshSecret) {
    throw new Error('Required environment variables are missing after validation');
  }

  const config: Config = {
    backendPort: parseInt(process.env.BACKEND_PORT || '3000', 10),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    databaseUrl,
    redisUrl,
    jwtSecret,
    jwtRefreshSecret,
  };

  if (isNaN(config.backendPort) || config.backendPort < 1 || config.backendPort > 65535) {
    throw new Error('BACKEND_PORT must be a valid port number (1-65535)');
  }

  if (isNaN(config.rateLimitWindowMs) || config.rateLimitWindowMs < 0) {
    throw new Error('RATE_LIMIT_WINDOW_MS must be a positive number');
  }

  if (isNaN(config.rateLimitMaxRequests) || config.rateLimitMaxRequests < 1) {
    throw new Error('RATE_LIMIT_MAX_REQUESTS must be a positive number');
  }

  if (config.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }

  if (config.jwtRefreshSecret.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters');
  }

  return config;
};

export const config = validateConfig();
