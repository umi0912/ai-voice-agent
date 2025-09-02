import 'dotenv/config';
import { Client, Environment } from 'square';

console.log('=== OAuth Debug Information ===');
console.log('Environment:', process.env.SQUARE_ENV);
console.log('App ID:', process.env.SQUARE_APP_ID);
console.log('App Secret:', process.env.SQUARE_APP_SECRET ? '***SET***' : '***MISSING***');
console.log('Redirect URL:', process.env.SQUARE_REDIRECT_URL);

// Test the OAuth URL construction
const base = 'https://connect.squareupsandbox.com';
const scopes = ['CUSTOMERS_READ', 'CUSTOMERS_WRITE', 'PAYMENTS_WRITE', 'PAYMENTS_READ'].join(' ');
const state = 'test-state-' + Date.now();

const url = new URL(base + '/oauth2/authorize');
url.searchParams.set('client_id', process.env.SQUARE_APP_ID);
url.searchParams.set('scope', scopes);
url.searchParams.set('session', 'false');
url.searchParams.set('state', state);
url.searchParams.set('redirect_uri', process.env.SQUARE_REDIRECT_URL);

console.log('\n=== Generated OAuth URL ===');
console.log(url.toString());

console.log('\n=== Test Steps ===');
console.log('1. Visit the OAuth URL above');
console.log('2. Complete the OAuth consent');
console.log('3. You should be redirected to:', process.env.SQUARE_REDIRECT_URL + '?code=...&state=' + state);
console.log('4. If you get "Missing code", the redirect isn\'t working properly');
