import { Router } from 'express';
import multer from 'multer';
import { isAdmin, verifyAuth } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductByCategory,
	getProductByCategoryAndSubCategory,
	getProductDetails,
	searchProducts,
	updateProduct,
} from '../controllers/product.controller.js';

const productRoutes = Router();

productRoutes.post('/create-product', verifyAuth, isAdmin, upload.array('image'), createProduct);
productRoutes.patch('/update-product/:productId', verifyAuth, isAdmin, upload.array('image'), updateProduct);
productRoutes.delete('/delete-product/:productId', verifyAuth, isAdmin, deleteProduct);

productRoutes.get('/all-products', verifyAuth, getAllProducts);
productRoutes.post('/get-product-by-category', verifyAuth, getProductByCategory);
productRoutes.post('/get-product-by-category-and-subcategory', verifyAuth, getProductByCategoryAndSubCategory);
productRoutes.post('/get-product-details/:productId', verifyAuth, getProductDetails);
productRoutes.get('/search-products', searchProducts);

export default productRoutes;
