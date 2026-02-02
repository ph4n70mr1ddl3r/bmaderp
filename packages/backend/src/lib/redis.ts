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
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis', error);
    throw error;
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

export const getRedis = () => redisClient;

export default redisClient;
