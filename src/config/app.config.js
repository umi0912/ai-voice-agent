export const appConfig = {
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  square: {
    environment: process.env.SQUARE_ENV || 'sandbox',
    appId: process.env.SQUARE_APP_ID,
    appSecret: process.env.SQUARE_APP_SECRET,
    redirectUrl: process.env.SQUARE_REDIRECT_URL
  },
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'default-secret',
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  }
};
