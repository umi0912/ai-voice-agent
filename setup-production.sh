оючч#!/bin/bash

set -e

echo "Setting up Zorina Payment production environment..."

mkdir -p ssl logs/nginx

echo "Please add your SSL certificates to ssl/ directory:"
echo "- ssl/cert.pem (SSL certificate)"
echo "- ssl/key.pem (SSL private key)"

echo "Please create .env.production file with your credentials:"
echo "SQUARE_ENV=production"
echo "SQUARE_APP_ID=sq0idp-jXJquQQ4uPG0_NwR7DL86Q"
echo "SQUARE_APP_SECRET=your_production_app_secret"
echo "SQUARE_REDIRECT_URL=https://yourdomain.com/oauth/callback"
echo "PORT=3000"
echo "NODE_ENV=production"
echo "SESSION_SECRET=your_secure_production_session_secret"

echo "Production setup complete!"
echo "Deploy with: docker-compose -f docker-compose.prod.yml up -d"
