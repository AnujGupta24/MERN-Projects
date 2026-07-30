import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { subCategory } from '../models/subCategory.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const addCategory = asyncHandler(async (req, res) => {
	const { name } = req.body;

	if (!name) {
		throw new ApiError(400, 'Category name is required');
	}

	const existingCategory = await Category.findOne({ name: name.trim() });

	if (existingCategory) {
		throw new ApiError(409, 'Category already exists');
	}

	const imageLocalPath = req.file?.path;

	if (!imageLocalPath) {
		throw new ApiError(400, 'Category image is required');
	}

	const uploadedImage = await uploadToCloudinary(imageLocalPath);

	if (!uploadedImage) {
		throw new ApiError(500, 'Failed to upload image');
	}

	const category = await Category.create({
		name: name.trim(),
		image: uploadedImage.secure_url,
	});

	return res.status(201).json(new ApiResponse(201, category, 'Category added successfully'));
});

export const getAllCategories = asyncHandler(async (req, res) => {
	const categories = await Category.find().sort({ name: 1 });

	return res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

export const updateCategory = asyncHandler(async (req, res) => {
	const { categoryId } = req.params;
	const { name } = req.body;

	const category = await Category.findById(categoryId);

	if (!category) {
		throw new ApiError(404, 'category not found');
	}

	if (name) category.name = name;

	const imageLocalPath = req.file?.path;

	if (imageLocalPath) {
		const uploadedImage = await uploadToCloudinary(imageLocalPath);

		if (!uploadedImage) {
			throw new ApiError(500, 'Image upload failed');
		}

		category.image = uploadedImage.secure_url;
	}
	await category.save();

	return res.status(201).json(new ApiResponse(201, category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
	const { categoryId } = req.params;

	const category = await Category.findById(categoryId);

	if (!category) {
		throw new ApiError(404, 'Category not found');
	}

	const subCategoryExists = await subCategory.findOne({
		category: categoryId,
	});

	if (subCategoryExists) {
		throw new ApiError(400, 'Category is used in subcategories');
	}

	const productExists = await Product.findOne({
		category: categoryId,
	});

	if (productExists) {
		throw new ApiError(400, 'Category is used in products');
	}

	await category.deleteOne();

	return res.status(201).json(new ApiResponse(201, {}, 'Category deleted successfully'));
});
