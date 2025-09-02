import 'dotenv/config';
import { Client, Environment } from 'square';

console.log('=== Testing Existing Access Token ===');

// Use the access token you already have from Square Developer Console
const existingAccessToken = 'EAAAl_0Zn4agUEWHI1JQI3aj8a5-tgF2gtCXlYtbWtAVZ_wlK3fA2zJ6zdzrHqh8';

const client = new Client({ 
  accessToken: existingAccessToken,
  environment: Environment.Sandbox
});

async function testExistingToken() {
  try {
    console.log('Testing access token:', existingAccessToken.substring(0, 10) + '...');
    
    // Test 1: Get merchant info
    console.log('\n1. Testing merchant info...');
    const merchantResponse = await client.merchantsApi.retrieveMerchant('me');
    console.log('✅ Merchant info retrieved:');
    console.log('   ID:', merchantResponse.result.merchant.id);
    console.log('   Business Name:', merchantResponse.result.merchant.businessName);
    
    // Test 2: Get locations
    console.log('\n2. Testing locations...');
    const locationsResponse = await client.locationsApi.listLocations();
    console.log('✅ Locations retrieved:', locationsResponse.result.locations?.length || 0);
    if (locationsResponse.result.locations) {
      locationsResponse.result.locations.forEach(loc => {
        console.log(`   - ${loc.name} (${loc.id}) - Status: ${loc.status}`);
      });
    }
    
    // Test 3: Test customer search
    console.log('\n3. Testing customer search...');
    const customersResponse = await client.customersApi.searchCustomers({
      query: { filter: { emailAddress: { exact: 'test@example.com' } } }
    });
    console.log('✅ Customer search working');
    console.log('   Customers found:', customersResponse.result.customers?.length || 0);
    
    console.log('\n🎉 All tests passed! Your access token is working.');
    console.log('\nYou can now test the full application with this token.');
    
  } catch (error) {
    console.log('❌ Test failed:');
    console.log('   Status:', error.statusCode);
    console.log('   Message:', error.message);
    if (error.errors) {
      console.log('   Details:', JSON.stringify(error.errors, null, 2));
    }
  }
}

testExistingToken();
