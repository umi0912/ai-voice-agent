import { Router } from 'express';
import { OAuthController } from '../controllers/oauth.controller.js';
import { SquareService } from '../services/square.service.js';
import { SellerService } from '../services/seller.service.js';

const router = Router();
const squareService = new SquareService();
const sellerService = new SellerService();
const oauthController = new OAuthController(squareService, sellerService);

router.get('/connect', (req, res) => oauthController.initiateOAuth(req, res));
router.get('/callback', (req, res) => oauthController.handleCallback(req, res));

export default router;
