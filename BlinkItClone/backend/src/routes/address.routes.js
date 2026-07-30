import { Router } from 'express';

import { isAdmin, verifyAuth } from '../middlewares/auth.middleware.js';
import { addAddress, deleteAddress, editAddress, getUserAllAddress } from '../controllers/address.controller.js';

const addressRoutes = Router();

addressRoutes.post('/add-address', verifyAuth, addAddress);
addressRoutes.get('/get-user-addresses', verifyAuth, getUserAllAddress);
addressRoutes.delete('/delete-address/:addressId', verifyAuth, deleteAddress);
addressRoutes.patch('/edit-address/:addressId', verifyAuth, editAddress);

export default addressRoutes;
