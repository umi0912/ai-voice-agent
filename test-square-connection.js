import 'dotenv/config';
import { Client, Environment } from 'square';

console.log('=== Testing Square App Connection ===');

const client = new Client({ 
  environment: Environment.Sandbox,
  accessToken: 'test-token' // We'll test basic connectivity
});

console.log('Environment:', Environment.Sandbox);
console.log('App ID:', process.env.SQUARE_APP_ID);
console.log('App Secret:', process.env.SQUARE_APP_SECRET ? '***SET***' : '***MISSING***');

// Test basic API connectivity
async function testConnection() {
  try {
    console.log('\nTesting Square API connectivity...');
    
    // Test if we can reach Square's API
    const response = await fetch('https://connect.squareupsandbox.com/oauth2/authorize', {
      method: 'GET',
      headers: {
        'User-Agent': 'Square-Test/1.0'
      }
    });
    
    console.log('✅ Square OAuth endpoint accessible');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
  } catch (error) {
    console.log('❌ Square OAuth endpoint not accessible:');
    console.log('Error:', error.message);
  }
}

testConnection();
