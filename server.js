import express from 'express';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { Client, Environment } from 'square';

const app = express();
app.use(express.json({
  reviver: (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }
}));
app.use(express.static('public'));

const {
  SQUARE_ENV = 'sandbox',
  SQUARE_APP_ID,
  SQUARE_APP_SECRET,
  SQUARE_REDIRECT_URL,
  PORT = 3000
} = process.env;

const env = SQUARE_ENV === 'production' ? Environment.Production : Environment.Sandbox;

const sellers = new Map();

// Add test seller for development (remove in production)
const testSeller = {
  accessToken: 'EAAAl_0Zn4agUEWHI1JQI3aj8a5-tgF2gtCXlYtbWtAVZ_wlK3fA2zJ6zdzrHqh8',
  merchantId: 'MLY8189GETHQB',
  locations: [{ id: 'L5V9MFPBRCSMN', name: 'Default Test Account', status: 'ACTIVE' }]
};
sellers.set('MLY8189GETHQB', testSeller);

function getClient(accessToken) {
  return new Client({ accessToken, environment: env });
}

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

app.get('/api/locations', async (req, res) => {
  const seller = requireSeller(req, res); if (!seller) return;
  try {
    if (!seller.locations || !seller.locations.length) {
      const authed = getClient(seller.accessToken);
      const { result } = await authed.locationsApi.listLocations();
      seller.locations = (result.locations || []).filter(l => l.status === 'ACTIVE');
    }
    res.json({ locations: seller.locations.map(l => ({ id: l.id, name: l.name })) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/customers/search', async (req, res) => {
  const seller = requireSeller(req, res); if (!seller) return;
  try {
    const { email, phone } = req.body || {};
    const query = { filter: {} };
    if (email) query.filter.emailAddress = { exact: email };
    if (phone) query.filter.phoneNumber  = { exact: phone };
    if (!query.filter.emailAddress && !query.filter.phoneNumber) {
      return res.status(400).json({ error: 'Provide email or phone' });
    }
    const authed = getClient(seller.accessToken);
    const { result } = await authed.customersApi.searchCustomers({ query });
    res.json({ customers: result.customers || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/customers', async (req, res) => {
  const seller = requireSeller(req, res); if (!seller) return;
  try {
    const { given_name, family_name, email, phone } = req.body || {};
    const authed = getClient(seller.accessToken);
    const { result } = await authed.customersApi.createCustomer({
      givenName: given_name,
      familyName: family_name,
      emailAddress: email,
      phoneNumber: phone
    });
    
    // Convert BigInt values to strings
    const customer = JSON.parse(JSON.stringify(result.customer, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    
    res.json({ customer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/cards', async (req, res) => {
  const seller = requireSeller(req, res); if (!seller) return;
  try {
    const { sourceId, customerId, cardholderName, billingAddress } = req.body || {};
    if (!sourceId || !customerId) return res.status(400).json({ error: 'sourceId and customerId are required' });

    const authed = getClient(seller.accessToken);
    const { result } = await authed.cardsApi.createCard({
      idempotencyKey: uuidv4(),
      sourceId,
      card: {
        customerId,
        cardholderName,
        billingAddress: billingAddress ? {
          postalCode: billingAddress.postal_code,
          locality: billingAddress.locality
        } : undefined
      }
    });
    
    // Convert BigInt values to strings
    const card = JSON.parse(JSON.stringify(result.card, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    
    res.json({ card });
  } catch (e) {
    res.status(500).json({ error: e.message, details: e.errors });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
