// packages/backend/src/lib/logger.ts
import { LOG_LEVELS } from '@bmaderp/shared';

const getTimestamp = () => new Date().toISOString();

export const logger = {
    debug: (message: string, data?: unknown) => {
        console.log(
            JSON.stringify({
                level: LOG_LEVELS.DEBUG,
                timestamp: getTimestamp(),
                message,
                data,
            })
        );
    },

    info: (message: string, data?: unknown) => {
        console.log(
            JSON.stringify({
                level: LOG_LEVELS.INFO,
                timestamp: getTimestamp(),
                message,
                data,
            })
        );
    },

    warn: (message: string, data?: unknown) => {
        console.warn(
            JSON.stringify({
                level: LOG_LEVELS.WARN,
                timestamp: getTimestamp(),
                message,
                data,
            })
        );
    },

    error: (message: string, error?: unknown) => {
        console.error(
            JSON.stringify({
                level: LOG_LEVELS.ERROR,
                timestamp: getTimestamp(),
                message,
                error: error instanceof Error ? error.message : error,
                stack: error instanceof Error ? error.stack : undefined,
            })
        );
    },
};
