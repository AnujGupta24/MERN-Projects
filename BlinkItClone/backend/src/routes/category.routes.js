import { Router } from 'express';
import multer from 'multer';
import { isAdmin, verifyAuth } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import {
	addCategory,
	deleteCategory,
	getAllCategories,
	updateCategory,
} from '../controllers/category.controller.js';

const categoryRoutes = Router();

categoryRoutes.post('/add-category', verifyAuth, isAdmin, upload.single('image'), addCategory);
categoryRoutes.get('/all-categories', getAllCategories);
categoryRoutes.patch('/update-category/:categoryId', verifyAuth, isAdmin, upload.single('image'), updateCategory);
categoryRoutes.delete('/delete-category/:categoryId', verifyAuth, isAdmin, deleteCategory);

export default categoryRoutes;
