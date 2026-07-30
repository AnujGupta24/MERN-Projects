import { Router } from 'express';

import { isAdmin, verifyAuth } from '../middlewares/auth.middleware.js';
import {
	addToCart,
	decreaseCartQuantity,
	getCartItems,
	increaseCartQuantity,
} from '../controllers/cart.controller.js';

const cartRoutes = Router();

cartRoutes.post('/add-to-cart/:productId', verifyAuth, addToCart);
cartRoutes.get('/get-cart-items', verifyAuth, getCartItems);
cartRoutes.patch('/increase-quantity/:productId', verifyAuth, increaseCartQuantity);
cartRoutes.patch('/decrease-quantity/:productId', verifyAuth, decreaseCartQuantity);

export default cartRoutes;
