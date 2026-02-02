import { createClient, RedisClientType } from 'redis';
import { logger } from './logger.js';
import { config } from './config.js';

const redisClient: RedisClientType = createClient({
  url: config.redisUrl,
});

redisClient.on('error', (error) => {
  logger.error('Redis Client Error', error);
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('disconnect', () => {
  logger.warn('Redis client disconnected');
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
    throw new Error('Redis client is not connected');
  }
  return redisClient;
};

export default redisClient;
