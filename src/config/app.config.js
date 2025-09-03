export const appConfig = {
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  square: {
    environment: process.env.SQUARE_ENV || 'production',
    appId: process.env.SQUARE_APP_ID || 'sq0idp-jXJquQQ4uPG0_NwR7DL86Q',
    appSecret: process.env.SQUARE_APP_SECRET,
    redirectUrl: process.env.SQUARE_REDIRECT_URL || 'https://yourdomain.com/oauth/callback'
  },
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'production-secret-key',
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  }
};
