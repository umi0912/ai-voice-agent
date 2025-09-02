import 'dotenv/config';
import { Client, Environment } from 'square';

const env = Environment.Sandbox;
const client = new Client({ environment: env });

console.log('Testing Square OAuth configuration...');
console.log('Environment:', env);
console.log('App ID:', process.env.SQUARE_APP_ID);
console.log('App Secret:', process.env.SQUARE_APP_SECRET ? '***SET***' : '***MISSING***');
console.log('Redirect URL:', process.env.SQUARE_REDIRECT_URL);

// Test basic API connectivity
async function testConnection() {
  try {
    console.log('\nTesting basic Square API connectivity...');
    const response = await client.oAuthApi.obtainToken({
      clientId: process.env.SQUARE_APP_ID,
      clientSecret: process.env.SQUARE_APP_SECRET,
      code: 'test_code',
      grantType: 'authorization_code'
    });
    console.log('✅ OAuth API connection successful');
  } catch (error) {
    console.log('❌ OAuth API connection failed:');
    console.log('Status:', error.statusCode);
    console.log('Message:', error.message);
    if (error.errors) {
      console.log('Details:', JSON.stringify(error.errors, null, 2));
    }
  }
}

testConnection();
