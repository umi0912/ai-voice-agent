import { v4 as uuidv4 } from 'uuid';
import { SquareService } from '../services/square.service.js';
import { SellerService } from '../services/seller.service.js';

export class OAuthController {
  constructor(squareService, sellerService) {
    this.squareService = squareService;
    this.sellerService = sellerService;
  }

  initiateOAuth(req, res) {
    const state = uuidv4();
    const oauthUrl = this.squareService.getOAuthUrl(state);
    res.redirect(oauthUrl);
  }

  async handleCallback(req, res) {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).send('Missing authorization code');
      }

      const tokenResult = await this.squareService.exchangeCodeForToken(code);
      const { accessToken, merchantId } = tokenResult;

      const locations = await this.squareService.getLocations(accessToken);
      
      const sellerData = { 
        accessToken, 
        merchantId, 
        locations 
      };

      this.sellerService.addSeller(merchantId, sellerData);
      res.redirect(`/?merchant_id=${merchantId}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).send('OAuth authentication failed');
    }
  }
}
