import { Client, Environment } from 'square';
import { appConfig } from '../config/app.config.js';

export class SquareService {
  constructor() {
    this.environment = appConfig.square.environment === 'production' 
      ? Environment.Production 
      : Environment.Sandbox;
  }

  createClient(accessToken) {
    return new Client({ 
      accessToken, 
      environment: this.environment 
    });
  }

  createOAuthClient() {
    return new Client({ environment: this.environment });
  }

  getOAuthUrl(state) {
    const base = this.environment === Environment.Production
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';

    const url = new URL(base + '/oauth2/authorize');
    url.searchParams.set('client_id', appConfig.square.appId);
    url.searchParams.set('scope', 'CUSTOMERS_READ CUSTOMERS_WRITE PAYMENTS_WRITE PAYMENTS_READ');
    url.searchParams.set('session', 'false');
    url.searchParams.set('state', state);
    url.searchParams.set('redirect_uri', appConfig.square.redirectUrl);

    return url.toString();
  }

  async exchangeCodeForToken(code) {
    const oauthClient = this.createOAuthClient();
    const { result } = await oauthClient.oAuthApi.obtainToken({
      clientId: appConfig.square.appId,
      clientSecret: appConfig.square.appSecret,
      code,
      grantType: 'authorization_code'
    });

    return result;
  }

  async getLocations(accessToken) {
    const client = this.createClient(accessToken);
    const { result } = await client.locationsApi.listLocations();
    return (result.locations || []).filter(location => location.status === 'ACTIVE');
  }

  async createCustomer(accessToken, customerData) {
    const client = this.createClient(accessToken);
    const { result } = await client.customersApi.createCustomer(customerData);
    return result;
  }

  async listCustomers(accessToken) {
    const client = this.createClient(accessToken);
    const { result } = await client.customersApi.listCustomers();
    return result;
  }
}
