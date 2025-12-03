// packages/backend/src/routes/index.ts
import { Express } from 'express';
import { logger } from '../lib/logger.js';

export const setupRoutes = (app: Express) => {
    // API version prefix
    const apiV1 = '/api/v1';

    // Mount routes here (to be implemented in next steps)
    // app.use(`${apiV1}/auth`, authRoutes);
    // app.use(`${apiV1}/inventory`, inventoryRoutes);
    // app.use(`${apiV1}/orders`, orderRoutes);
    // app.use(`${apiV1}/dashboard`, dashboardRoutes);
    // app.use(`${apiV1}/schedules`, scheduleRoutes);
    // app.use(`${apiV1}/admin`, adminRoutes);

    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            error: {
                code: 'NOT_FOUND',
                message: 'Endpoint not found',
                statusCode: 404,
                retryable: false,
            },
        });
    });

    logger.info('Routes initialized');
};
