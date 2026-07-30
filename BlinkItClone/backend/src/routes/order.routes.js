import { Router } from 'express';

import { verifyAuth } from '../middlewares/auth.middleware.js';
import { cashOnDelivery, getMyOrders, PayOnline, verifyPayment } from '../controllers/order.controller.js';

const orderRoutes = Router();

orderRoutes.post('/cash-on-delivery', verifyAuth, cashOnDelivery);
orderRoutes.post('/pay-online', verifyAuth, PayOnline);
orderRoutes.post('/verify-payment', verifyAuth, verifyPayment);
orderRoutes.get('/my-orders', verifyAuth, getMyOrders);

export default orderRoutes;
