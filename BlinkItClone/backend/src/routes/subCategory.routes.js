import { Router } from 'express';
import multer from 'multer';
import { isAdmin, verifyAuth } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import {
	addSubCategory,
	deleteSubCategory,
	getAllSubCategory,
	updateSubCategory,
} from '../controllers/subCategory.controller.js';

const subCategoryRoutes = Router();

subCategoryRoutes.post('/add-subcategory', verifyAuth, isAdmin, upload.single('image'), addSubCategory);
subCategoryRoutes.get('/all-subcategories', verifyAuth, getAllSubCategory);
subCategoryRoutes.patch(
	'/update-subcategory/:subcategoryId',
	verifyAuth,
	isAdmin,
	upload.single('image'),
	updateSubCategory,
);
subCategoryRoutes.delete('/delete-subcategory/:subcategoryId', verifyAuth, isAdmin, deleteSubCategory);

export default subCategoryRoutes;
