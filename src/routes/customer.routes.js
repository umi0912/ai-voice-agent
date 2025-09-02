import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller.js';
import { SquareService } from '../services/square.service.js';
import { SellerService } from '../services/seller.service.js';

const router = Router();
const squareService = new SquareService();
const sellerService = new SellerService();
const customerController = new CustomerController(squareService, sellerService);

router.post('/', (req, res) => customerController.createCustomer(req, res));
router.get('/', (req, res) => customerController.listCustomers(req, res));

export default router;
