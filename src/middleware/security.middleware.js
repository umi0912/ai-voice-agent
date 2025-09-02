import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import { appConfig } from '../config/app.config.js';

export const securityMiddleware = {
  helmet: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  rateLimit: rateLimit({
    windowMs: appConfig.security.rateLimit.windowMs,
    max: appConfig.security.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  compression: compression(),

  logging: morgan('combined'),

  trustProxy: (req, res, next) => {
    req.app.set('trust proxy', 1);
    next();
  }
};
