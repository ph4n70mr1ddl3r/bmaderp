import { LOG_LEVELS } from '@bmaderp/shared';

const getTimestamp = () => new Date().toISOString();

const logMessage = (level: string, message: string, data?: unknown, error?: unknown) => {
  const logData = {
    level,
    timestamp: getTimestamp(),
    message,
    ...(data !== undefined && { data }),
    ...(error !== undefined && {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    }),
  };
  const output = JSON.stringify(logData);

  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(output);
      break;
    case LOG_LEVELS.WARN:
      console.warn(output);
      break;
    default:
      console.log(output);
  }
};

/**
 * Application logger with structured JSON output
 */
export const logger = {
  debug: (message: string, data?: unknown) => {
    logMessage(LOG_LEVELS.DEBUG, message, data);
  },

  info: (message: string, data?: unknown) => {
    logMessage(LOG_LEVELS.INFO, message, data);
  },

  warn: (message: string, data?: unknown) => {
    logMessage(LOG_LEVELS.WARN, message, data);
  },

  error: (message: string, error?: unknown) => {
    logMessage(LOG_LEVELS.ERROR, message, undefined, error);
  },
};
