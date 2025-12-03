// packages/backend/src/index.ts
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';

import { setupMiddleware } from './middleware/index.js';
import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './lib/logger.js';

dotenv.config();

const app: Express = express();
const port = process.env.BACKEND_PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Custom middleware
setupMiddleware(app);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
setupRoutes(app);

// Error handling (must be last)
app.use(errorHandler);

// Start server
const server = createServer(app);

server.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});
