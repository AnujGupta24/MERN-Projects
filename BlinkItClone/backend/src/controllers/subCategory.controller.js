import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { subCategory } from '../models/subCategory.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const addSubCategory = asyncHandler(async (req, res) => {
	const { name, category } = req.body;
	console.log(name, category);

	if (!name?.trim()) {
		throw new ApiError(400, 'Subcategory name is required');
	}

	if (!category) {
		throw new ApiError(400, 'Category is required');
	}

	const categoryExists = await Category.findById(category);
	console.log('category', categoryExists);

	if (!categoryExists) {
		throw new ApiError(404, 'Category not found');
	}

	const existingSubCategory = await subCategory.findOne({
		name: name,
		category,
	});

	if (existingSubCategory) {
		throw new ApiError(409, 'Subcategory already exists in this category');
	}

	const imageLocalPath = req.file?.path;

	if (!imageLocalPath) {
		throw new ApiError(400, 'Subcategory image is required');
	}

	const uploadedImage = await uploadToCloudinary(imageLocalPath);

	if (!uploadedImage) {
		throw new ApiError(500, 'Image upload failed');
	}

	const createdSubCategory = await subCategory.create({
		name,
		category,
		image: uploadedImage.secure_url,
	});

	return res.status(201).json(new ApiResponse(201, {}, 'Sub Category added successfully'));
});

export const getAllSubCategory = asyncHandler(async (req, res) => {
	const subCategories = await subCategory.find().populate('category', 'name image').sort({ name: 1 });

	return res.status(200).json(new ApiResponse(200, subCategories, 'Subcategories fetched successfully'));
});

export const updateSubCategory = asyncHandler(async (req, res) => {
	const { subcategoryId } = req.params;
	const { name, category } = req.body;
	console.log(subcategoryId);

	if (!subcategoryId) {
		throw new ApiError(400, 'Invalid subcategory id');
	}

	const existingSubCategory = await subCategory.findById(subcategoryId);

	if (!existingSubCategory) {
		throw new ApiError(404, 'Subcategory not found');
	}

	if (!category) {
		throw new ApiError(400, 'invalid category id');
	}

	const categoryExists = await Category.findById(category);

	if (!categoryExists) {
		throw new ApiError(404, 'Category not found');
	}

	existingSubCategory.category = category;

	if (name) {
		existingSubCategory.name = name.trim();
	}

	const imageLocalPath = req.file?.path;

	if (imageLocalPath) {
		const uploadedImage = await uploadToCloudinary(imageLocalPath);

		if (!uploadedImage) {
			throw new ApiError(500, 'Image upload failed');
		}

		existingSubCategory.image = uploadedImage.secure_url;
	}

	await existingSubCategory.save();

	return res.status(200).json(new ApiResponse(200, existingSubCategory, 'Subcategory updated successfully'));
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
	const { subcategoryId } = req.params;

	if (!subcategoryId) {
		throw new ApiError(400, 'Invalid subcategory id');
	}

	const existingSubCategory = await subCategory.findById(subcategoryId);

	if (!existingSubCategory) {
		throw new ApiError(404, 'Subcategory not found');
	}

	const productExists = await Product.findOne({
		subCategory: subcategoryId,
	});

	if (productExists) {
		throw new ApiError(400, 'Subcategory is used in products');
	}

	await existingSubCategory.deleteOne();

	return res.status(200).json(new ApiResponse(200, {}, 'Subcategory deleted successfully'));
});
