import { createClient, RedisClientType } from 'redis';
import { logger } from './logger.js';
import { config } from './config.js';

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_RECONNECT_DELAY_MS = 100;

const redisClient: RedisClientType = createClient({
  url: config.redisUrl,
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > MAX_RECONNECT_ATTEMPTS) {
        logger.error('Redis max reconnection attempts reached', { retries });
        return new Error('Max reconnection attempts reached');
      }
      const delay = Math.min(retries * BASE_RECONNECT_DELAY_MS, 3000);
      logger.warn('Redis reconnecting', { attempt: retries, delayMs: delay });
      return delay;
    },
  },
});

redisClient.on('error', (error) => {
  logger.error('Redis Client Error', error);
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
  reconnectAttempts = 0;
});

redisClient.on('disconnect', () => {
  logger.warn('Redis client disconnected');
});

redisClient.on('reconnecting', () => {
  reconnectAttempts++;
  logger.info('Redis client reconnecting', { attempt: reconnectAttempts });
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
    throw new Error('Redis connection failed');
  }
};

export const disconnectRedis = async () => {
  try {
    await redisClient.quit();
    logger.info('Redis client disconnected');
  } catch (error) {
    logger.error('Failed to disconnect Redis', error);
  }
};

export const getRedis = () => {
  if (!redisClient.isOpen) {
    logger.error('Attempted to get Redis client but connection is not open');
    throw new Error('Redis client is not connected');
  }
  return redisClient;
};

export default redisClient;
