import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';
import { config } from './config.js';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: config.databaseUrl,
        pool: {
          min: 2, // Minimum number of connections in the pool
          max: 10, // Maximum number of connections in the pool
          acquireTimeoutMillis: 30000, // How long to wait before throwing an error when getting a connection
          createTimeoutMillis: 30000, // How long to wait before throwing an error when creating a new connection
          destroyTimeoutMillis: 5000, // How long to wait before destroying a connection that's been idle too long
          idleTimeoutMillis: 30000, // How long a connection can be idle before being released
          reapIntervalMillis: 1000, // How often to check for and close idle connections
          maxLifetimeMillis: 1800000, // Maximum lifetime a connection can have before being recreated
        },
      },
    },
  });

if (config.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from database', error);
    throw error;
  }
};

export default prisma;
