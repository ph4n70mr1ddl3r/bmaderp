/**
 * Main application entry point for bmaderp backend API server
 */
// packages/backend/src/index.ts
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';

import { setupMiddleware } from './middleware/index';
import { setupRoutes } from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './lib/logger';
import { config } from './lib/config';

const app: Express = express();
const port = config.backendPort;

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Custom middleware
setupMiddleware(app);

// API routes
setupRoutes(app);

// Error handling (must be last)
app.use(errorHandler);

// Start server
const server = createServer(app);

server.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
