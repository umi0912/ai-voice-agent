#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with your production credentials"
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$SQUARE_APP_ID" ] || [ -z "$SQUARE_APP_SECRET" ]; then
    echo "❌ Error: Missing required environment variables!"
    echo "Please check SQUARE_APP_ID and SQUARE_APP_SECRET in .env file"
    exit 1
fi

# Create logs directory
mkdir -p logs/nginx

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check health status
echo "🏥 Checking service health..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "❌ Application health check failed!"
    echo "Checking logs..."
    docker-compose -f docker-compose.prod.yml logs app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is running at: http://localhost"
echo "📊 Health check: http://localhost/health"
echo "📝 View logs: docker-compose -f docker-compose.prod.yml logs -f"
