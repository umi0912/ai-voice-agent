import express from 'express';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { Client, Environment } from 'square';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';

const app = express();

// Security middleware
app.use(helmet({
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
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Trust proxy for production
app.set('trust proxy', 1);

// Body parsing middleware
app.use(express.json({
  limit: '10mb',
  reviver: (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }
}));

// Static files
app.use(express.static('public', {
  maxAge: '1y',
  etag: true
}));

// Environment variables
const {
  SQUARE_ENV = 'sandbox',
  SQUARE_APP_ID,
  SQUARE_APP_SECRET,
  SQUARE_REDIRECT_URL,
  PORT = 3000,
  NODE_ENV = 'development'
} = process.env;

const env = SQUARE_ENV === 'production' ? Environment.Production : Environment.Sandbox;

// In-memory storage (use Redis or database in production)
const sellers = new Map();

// Remove test seller in production
if (NODE_ENV === 'development') {
  const testSeller = {
    accessToken: 'EAAAl_0Zn4agUEWHI1JQI3aj8a5-tgF2gtCXlYtbWtAVZ_wlK3fA2zJ6zdzrHqh8',
    merchantId: 'MLY8189GETHQB',
    locations: [{ id: 'L5V9MFPBRCSMN', name: 'Default Test Account', status: 'ACTIVE' }]
  };
  sellers.set('MLY8189GETHQB', testSeller);
}

function getClient(accessToken) {
  return new Client({ accessToken, environment: env });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    squareEnv: SQUARE_ENV
  });
});

app.get('/connect', (req, res) => {
  const state = uuidv4();
  const scopes = [
    'CUSTOMERS_READ',
    'CUSTOMERS_WRITE',
    'PAYMENTS_WRITE',
    'PAYMENTS_READ'
  ].join(' ');

  const base = SQUARE_ENV === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

  const url = new URL(base + '/oauth2/authorize');
  url.searchParams.set('client_id', SQUARE_APP_ID);
  url.searchParams.set('scope', scopes);
  url.searchParams.set('session', 'false');
  url.searchParams.set('state', state);
  url.searchParams.set('redirect_uri', SQUARE_REDIRECT_URL);

  res.redirect(url.toString());
});

app.get('/oauth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send('Missing code');

    const oauthClient = new Client({ environment: env });
    const { result } = await oauthClient.oAuthApi.obtainToken({
      clientId: SQUARE_APP_ID,
      clientSecret: SQUARE_APP_SECRET,
      code,
      grantType: 'authorization_code'
    });

    const accessToken = result.accessToken;
    const merchantId = result.merchantId;

    const authed = getClient(accessToken);
    const locsResp = await authed.locationsApi.listLocations();
    const locations = (locsResp.result.locations || []).filter(l => l.status === 'ACTIVE');

    sellers.set(merchantId, { accessToken, merchantId, locations });

    res.redirect('/?merchant_id=' + merchantId);
  } catch (e) {
    console.error('OAuth error:', e);
    res.status(500).send('OAuth error: ' + (e.message || 'unknown'));
  }
});

function requireSeller(req, res) {
  const merchantId = req.headers['x-merchant-id'] || req.query.merchant_id;
  if (!merchantId) {
    res.status(400).json({ error: 'Missing merchant_id' });
    return null;
  }
  const seller = sellers.get(merchantId);
  if (!seller) {
    res.status(401).json({ error: 'Seller not connected. Visit /connect' });
    return null;
  }
  return seller;
}

// API endpoints
app.post('/api/customers', async (req, res) => {
  try {
    const seller = requireSeller(req, res);
    if (!seller) return;

    const { givenName, familyName, emailAddress, phoneNumber } = req.body;
    
    const client = getClient(seller.accessToken);
    const { result } = await client.customersApi.createCustomer({
      givenName,
      familyName,
      emailAddress,
      phoneNumber
    });

    res.json(result);
  } catch (e) {
    console.error('Create customer error:', e);
    res.status(500).json({ error: e.message || 'Unknown error' });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const seller = requireSeller(req, res);
    if (!seller) return;

    const client = getClient(seller.accessToken);
    const { result } = await client.customersApi.listCustomers();

    res.json(result);
  } catch (e) {
    console.error('List customers error:', e);
    res.status(500).json({ error: e.message || 'Unknown error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`Square environment: ${SQUARE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;
