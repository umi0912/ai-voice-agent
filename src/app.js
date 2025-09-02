import express from 'express';
import 'dotenv/config';
import { appConfig } from './config/app.config.js';
import { securityMiddleware } from './middleware/security.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import oauthRoutes from './routes/oauth.routes.js';
import customerRoutes from './routes/customer.routes.js';

export class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(securityMiddleware.helmet);
    this.app.use(securityMiddleware.rateLimit);
    this.app.use(securityMiddleware.compression);
    this.app.use(securityMiddleware.logging);
    this.app.use(securityMiddleware.trustProxy);
    this.app.use(errorMiddleware.bigIntHandler);
    
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.static('public', {
      maxAge: '1y',
      etag: true
    }));
  }

  setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: appConfig.server.environment,
        squareEnv: appConfig.square.environment
      });
    });

    this.app.use('/oauth', oauthRoutes);
    this.app.use('/api/customers', customerRoutes);
  }

  setupErrorHandling() {
    this.app.use(errorMiddleware.notFound);
    this.app.use(errorMiddleware.globalError);
  }

  start() {
    const server = this.app.listen(appConfig.server.port, () => {
      console.log(`Server running on port ${appConfig.server.port} in ${appConfig.server.environment} mode`);
      console.log(`Square environment: ${appConfig.square.environment}`);
    });

    this.setupGracefulShutdown(server);
    return server;
  }

  setupGracefulShutdown(server) {
    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down gracefully`);
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}
