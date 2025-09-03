// Production configuration file
// Copy this file and rename to config.js for production use

export const productionConfig = {
  // Square API settings
  square: {
    environment: 'production',
    appId: process.env.SQUARE_APP_ID,
    appSecret: process.env.SQUARE_APP_SECRET,
    redirectUrl: process.env.SQUARE_REDIRECT_URL || 'https://yourdomain.com/oauth/callback'
  },
  
  // Server settings
  server: {
    port: process.env.PORT || 3000,
    environment: 'production',
    trustProxy: true
  },
  
  // Security settings
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'your_secure_session_secret_here',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json'
  }
};

export default productionConfig;
