import { SquareService } from '../services/square.service.js';
import { SellerService } from '../services/seller.service.js';

export class CustomerController {
  constructor(squareService, sellerService) {
    this.squareService = squareService;
    this.sellerService = sellerService;
  }

  async createCustomer(req, res) {
    try {
      const seller = this.getSellerFromRequest(req, res);
      if (!seller) return;

      const { givenName, familyName, emailAddress, phoneNumber } = req.body;
      
      const customerData = {
        givenName,
        familyName,
        emailAddress,
        phoneNumber
      };

      const result = await this.squareService.createCustomer(
        seller.accessToken, 
        customerData
      );

      res.json(result);
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({ error: error.message || 'Customer creation failed' });
    }
  }

  async listCustomers(req, res) {
    try {
      const seller = this.getSellerFromRequest(req, res);
      if (!seller) return;

      const result = await this.squareService.listCustomers(seller.accessToken);
      res.json(result);
    } catch (error) {
      console.error('List customers error:', error);
      res.status(500).json({ error: error.message || 'Failed to list customers' });
    }
  }

  getSellerFromRequest(req, res) {
    const merchantId = req.headers['x-merchant-id'] || req.query.merchant_id;
    
    if (!merchantId) {
      res.status(400).json({ error: 'Merchant ID is required' });
      return null;
    }

    const seller = this.sellerService.getSeller(merchantId);
    
    if (!seller) {
      res.status(401).json({ error: 'Seller not authenticated. Please visit /connect' });
      return null;
    }

    return seller;
  }
}
