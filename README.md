# Zorina Payment Setup

Production-ready Square OAuth integration for payment processing and customer management.

## Square Production Configuration

- **Application ID**: `sq0idp-jXJquQQ4uPG0_NwR7DL86Q`
- **Environment**: Production
- **OAuth Scopes**: CUSTOMERS_READ, CUSTOMERS_WRITE, PAYMENTS_WRITE, PAYMENTS_READ

## Architecture

The application follows SOLID principles and clean code practices:

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Services can be easily replaced
- **Interface Segregation**: Controllers depend only on what they need
- **Dependency Inversion**: High-level modules don't depend on low-level modules

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── app.js          # Main application class
└── index.js        # Entry point
```

## Features

- OAuth 2.0 integration with Square Production
- Customer management (create, list)
- Payment processing capabilities
- Security middleware (helmet, rate limiting, compression)
- Error handling and logging
- Health check endpoint
- Docker containerization with nginx
- Production-ready configuration

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Square Production Application
- SSL certificates for HTTPS
- Domain name configured

## Quick Start

1. Clone the repository:
```bash
git clone <your-repo-url>
cd zorina-payment-setup
```

2. Install dependencies:
```bash
npm install
```

3. Configure production environment:
```bash
# Create .env.production file with your credentials
SQUARE_ENV=production
SQUARE_APP_ID=sq0idp-jXJquQQ4uPG0_NwR7DL86Q
SQUARE_APP_SECRET=your_production_app_secret
SQUARE_REDIRECT_URL=https://yourdomain.com/oauth/callback
PORT=3000
NODE_ENV=production
SESSION_SECRET=your_secure_production_session_secret
```

4. Add SSL certificates:
```bash
mkdir -p ssl
# Add ssl/cert.pem and ssl/key.pem
```

5. Deploy to production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Production Deployment

### Docker Compose Production

```bash
# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Manual Docker

```bash
# Build production image
docker build -t zorina-payment .

# Run production container
docker run -d \
  --name zorina-payment \
  -p 3000:3000 \
  --env-file .env.production \
  zorina-payment
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SQUARE_ENV` | Square environment | Yes | production |
| `SQUARE_APP_ID` | Square application ID | Yes | sq0idp-jXJquQQ4uPG0_NwR7DL86Q |
| `SQUARE_APP_SECRET` | Square application secret | Yes | - |
| `SQUARE_REDIRECT_URL` | OAuth redirect URL | Yes | https://yourdomain.com/oauth/callback |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Node environment | No | production |

## API Endpoints

- `GET /health` - Health check
- `GET /oauth/connect` - Initiate OAuth flow
- `GET /oauth/callback` - OAuth callback
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- HTTPS enforcement
- CORS protection
- Input validation
- Secure session handling

## Monitoring

- Health check endpoint: `/health`
- Application logs: `docker-compose logs -f app`
- Nginx logs: `docker-compose logs -f nginx`

## Development

```bash
# Start development server
npm run dev

# Start production server
npm start

# Build Docker image
docker build -t zorina-payment .
```

## Production Checklist

### Square Console Setup
- [ ] Application ID: `sq0idp-jXJquQQ4uPG0_NwR7DL86Q`
- [ ] Environment: Production
- [ ] Redirect URL: `https://yourdomain.com/oauth/callback`
- [ ] Required scopes enabled

### Server Configuration
- [ ] SSL certificates in `ssl/` directory
- [ ] Domain configured in DNS
- [ ] Firewall allows ports 80, 443, 3000
- [ ] Environment variables set

### Deployment
- [ ] Docker images built
- [ ] Production containers running
- [ ] Health checks passing
- [ ] HTTPS working

## Troubleshooting

### Common Issues

1. **OAuth Callback Fails**
   - Verify redirect URL in Square Console
   - Check SSL certificate validity
   - Ensure domain resolution

2. **SSL Errors**
   - Verify certificate paths in nginx.conf
   - Check certificate validity
   - Test nginx configuration

3. **Application Errors**
   - Check environment variables
   - Verify Square API access
   - Review application logs

### Debug Commands

```bash
# Test nginx config
docker exec zorina-nginx nginx -t

# Check environment variables
docker exec zorina-payment-app env

# Health check
curl https://yourdomain.com/health
```

## License

MIT License
