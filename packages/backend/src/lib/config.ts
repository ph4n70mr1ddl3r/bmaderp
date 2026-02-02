import dotenv from 'dotenv';

dotenv.config();

interface Config {
  backendPort: number;
  corsOrigin: string;
  nodeEnv: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

const validateConfig = (): Config => {
  const requiredEnvVars = ['BACKEND_PORT', 'CORS_ORIGIN'];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  const config: Config = {
    backendPort: parseInt(process.env.BACKEND_PORT || '3000', 10),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
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

  return config;
};

export const config = validateConfig();
