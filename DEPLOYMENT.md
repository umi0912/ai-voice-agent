# Production Deployment Guide

## 🚀 Quick Start

### 1. Prepare Environment
```bash
# Copy production environment template
cp env.production.example .env

# Edit .env with your production credentials
nano .env
```

### 2. Deploy with One Command
```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## 📋 Pre-Deployment Checklist

- [ ] **Square API**: Production app credentials configured
- [ ] **Environment**: `SQUARE_ENV=production` set
- [ ] **Domain**: HTTPS redirect URL configured
- [ ] **SSL**: Certificates ready (for nginx)
- [ ] **Firewall**: Ports 80, 443, 3000 open
- [ ] **Database**: Redis configured (optional)

## 🔧 Manual Deployment Steps

### Option 1: Docker Compose (Recommended)

```bash
# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Option 2: PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Start with production config
pm2 start ecosystem.config.js --env production

# Monitor processes
pm2 monit

# View logs
pm2 logs
```

### Option 3: Traditional Node.js

```bash
# Install production dependencies
npm run install:prod

# Start production server
npm run start:prod
```

## 🐳 Docker Commands

```bash
# Build image
docker build -t square-app .

# Run container
docker run -d \
  --name square-app \
  -p 3000:3000 \
  --env-file .env \
  square-app

# View logs
docker logs -f square-app

# Stop container
docker stop square-app
```

## 📊 Monitoring & Health Checks

### Health Endpoint
```bash
# Check application health
curl http://localhost:3000/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "squareEnv": "production"
}
```

### Logs
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f app

# Nginx logs
docker-compose -f docker-compose.prod.yml logs -f nginx

# All logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Process Status
```bash
# Docker containers
docker ps

# PM2 processes
pm2 status

# System resources
docker stats
```

## 🔒 Security Configuration

### SSL Certificates
```bash
# Create SSL directory
mkdir -p ssl

# Copy your certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Set permissions
chmod 600 ssl/*
```

### Environment Variables
```bash
# Required variables
SQUARE_ENV=production
SQUARE_APP_ID=your_production_app_id
SQUARE_APP_SECRET=your_production_app_secret
SQUARE_REDIRECT_URL=https://yourdomain.com/oauth/callback

# Security
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
```

## 🚨 Troubleshooting

### Common Issues

#### 1. OAuth Callback Fails
```bash
# Check redirect URL in Square Console
# Ensure it matches SQUARE_REDIRECT_URL in .env
# Must be HTTPS in production
```

#### 2. Rate Limiting
```bash
# Check nginx logs for rate limit violations
docker-compose -f docker-compose.prod.yml logs nginx | grep "limiting"

# Adjust rate limits in nginx.conf if needed
```

#### 3. SSL Errors
```bash
# Verify certificate paths in nginx.conf
# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Test nginx configuration
docker exec square-nginx nginx -t
```

#### 4. Application Won't Start
```bash
# Check environment variables
docker-compose -f docker-compose.prod.yml config

# View application logs
docker-compose -f docker-compose.prod.yml logs app

# Check health endpoint
curl -v http://localhost:3000/health
```

### Debug Commands

```bash
# Enter container for debugging
docker exec -it square-app sh

# Check environment variables
docker exec square-app env

# Test Square API connection
docker exec square-app node -e "
import { Client, Environment } from 'square';
const client = new Client({ 
  accessToken: process.env.SQUARE_APP_SECRET, 
  environment: Environment.Production 
});
console.log('Square client created successfully');
"
```

## 📈 Scaling & Performance

### Horizontal Scaling
```bash
# Scale application instances
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Load balancer configuration
# Update nginx.conf upstream block
```

### Performance Monitoring
```bash
# Monitor resource usage
docker stats

# Check response times
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/health"

# Monitor nginx performance
docker exec square-nginx nginx -V
```

## 🔄 Updates & Maintenance

### Rolling Updates
```bash
# Build new image
docker build -t square-app:latest .

# Update services one by one
docker-compose -f docker-compose.prod.yml up -d --no-deps app

# Verify health
curl http://localhost:3000/health
```

### Backup & Restore
```bash
# Backup environment
cp .env .env.backup.$(date +%Y%m%d)

# Backup logs
tar -czf logs-backup-$(date +%Y%m%d).tar.gz logs/

# Restore from backup
cp .env.backup.20240101 .env
```

## 📞 Support

### Useful Commands
```bash
# Show help
make help

# Quick health check
make health

# View logs
make logs

# Production deployment
make prod-deploy
```

### Emergency Stop
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Stop PM2 processes
pm2 stop all

# Kill Node processes
pkill -f "node server.production.js"
```

## 📚 Additional Resources

- [Square API Documentation](https://developer.squareup.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
