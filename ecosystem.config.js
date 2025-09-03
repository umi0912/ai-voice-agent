module.exports = {
  apps: [{
    name: 'square-app',
    script: 'server.production.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      SQUARE_ENV: 'sandbox'
    },
    env_production: {
      NODE_ENV: 'production',
      SQUARE_ENV: 'production'
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Process management
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    
    // Monitoring
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Health check
    health_check_grace_period: 3000,
    
    // Environment variables
    env_file: '.env'
  }]
};
