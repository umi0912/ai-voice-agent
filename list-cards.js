import 'dotenv/config';
import { Client, Environment } from 'square';

console.log('=== Listing Saved Cards ===');

const accessToken = 'EAAAl_0Zn4agUEWHI1JQI3aj8a5-tgF2gtCXlYtbWtAVZ_wlK3fA2zJ6zdzrHqh8';
const client = new Client({ 
  accessToken: accessToken,
  environment: Environment.Sandbox
});

async function listCards() {
  try {
    // First, let's list all customers
    console.log('\n1. Listing all customers...');
    const customersResponse = await client.customersApi.searchCustomers({
      query: {}
    });
    
    console.log('Customers found:', customersResponse.result.customers?.length || 0);
    
    if (customersResponse.result.customers) {
      for (const customer of customersResponse.result.customers) {
        console.log(`\nCustomer: ${customer.givenName || ''} ${customer.familyName || ''}`);
        console.log(`  ID: ${customer.id}`);
        console.log(`  Email: ${customer.emailAddress || 'N/A'}`);
        
        // List cards for this customer
        console.log('  Cards:');
        try {
          const cardsResponse = await client.cardsApi.listCards();
          
          if (cardsResponse.result.cards && cardsResponse.result.cards.length > 0) {
            cardsResponse.result.cards.forEach(card => {
              console.log(`    - Card ID: ${card.id}`);
              console.log(`      Last 4: ${card.last4}`);
              console.log(`      Brand: ${card.cardBrand}`);
              console.log(`      Exp Month: ${card.expMonth}`);
              console.log(`      Exp Year: ${card.expYear}`);
              console.log(`      Created: ${card.createdAt}`);
            });
          } else {
            console.log('    No cards found');
          }
        } catch (cardError) {
          console.log(`    Error listing cards: ${cardError.message}`);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.errors) {
      console.log('Details:', JSON.stringify(error.errors, null, 2));
    }
  }
}

listCards();
