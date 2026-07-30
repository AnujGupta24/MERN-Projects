import { Category } from '../models/category.model.js';
import { Product } from '../models/product.model.js';
import { subCategory as SubCategory } from '../models/subCategory.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const createProduct = asyncHandler(async (req, res) => {
	const { name, category, subCategory, unit, stock, price, discount, description, moreDetails } = req.body;

	if (!name.trim()) {
		throw new ApiError(400, 'Product name is required');
	}

	if (!category) {
		throw new ApiError(400, 'Category is required');
	}

	if (!subCategory) {
		throw new ApiError(400, 'subCategory is required');
	}

	const parsedSubCategory = JSON.parse(subCategory);

	const parsedMoreDetails = moreDetails ? JSON.parse(moreDetails) : [];

	const categoryExists = await Category.findById(category);

	if (!categoryExists) {
		throw new ApiError(404, 'Category not found');
	}

	const subCategoryDocs = await SubCategory.find({
		_id: {
			$in: parsedSubCategory,
		},
	});

	if (subCategoryDocs.length !== parsedSubCategory.length) {
		throw new ApiError(404, 'Some subcategories not found');
	}

	const invalidSubCategory = subCategoryDocs.find((sub) => sub.category.toString() !== category);
	console.log('Invalidsubcategory', invalidSubCategory);

	if (invalidSubCategory) {
		throw new ApiError(400, 'Selected subcategory does not belong to category');
	}

	const imageUrls = [];

	for (const file of req.files) {
		const uploadedImage = await uploadToCloudinary(file.path);

		if (!uploadedImage?.secure_url) {
			throw new ApiError(500, 'Failed to upload product image');
		}

		imageUrls.push(uploadedImage.secure_url);
	}

	const product = await Product.create({
		name,
		image: imageUrls,
		category,
		subCategory: parsedSubCategory,
		unit,
		stock: Number(stock),
		price: Number(price),
		discount: Number(discount),
		description,
		moreDetails: parsedMoreDetails,
	});

	return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

export const getAllProducts = asyncHandler(async (req, res) => {
	let { page, search, limit } = req.query;

	page = Number(page) || 1;
	limit = Number(limit) || 5;

	const skip = (page - 1) * limit;

	const query = {};

	if (search) {
		query.name = {
			$regex: search,
			$options: 'i',
		};
	}

	const products = await Product.find(query)
		.populate('category', 'name')
		.populate('subCategory', 'name')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

	const totalProducts = await Product.countDocuments(query);

	const totalPages = Math.ceil(totalProducts / limit);

	return res
		.status(200)
		.json(
			new ApiResponse(200, { products, page, limit, totalPages, totalProducts }, 'Products fetched successfully'),
		);
});

export const updateProduct = asyncHandler(async (req, res) => {
	const { productId } = req.params;

	const {
		name,
		category,
		subCategory,
		unit,
		stock,
		price,
		discount,
		description,
		moreDetails,
		publish,
		existingImages,
	} = req.body;

	const product = await Product.findById(productId);

	if (!product) {
		throw new ApiError(404, 'Product not found');
	}

	// old images
	let oldImages = [];
	if (existingImages) {
		oldImages = JSON.parse(existingImages);
	}

	//new images
	// const newImages = req.files?.map((file) => file.path) || [];
	const newImages = [];

	for (const file of req.files || []) {
		const uploadedImage = await uploadToCloudinary(file.path);

		if (!uploadedImage?.secure_url) {
			throw new ApiError(500, 'Failed to upload image');
		}

		newImages.push(uploadedImage.secure_url);
	}

	// merge both
	const finalImages = [...oldImages, ...newImages];

	const updateData = {
		name: name || product.name,
		image: finalImages,
		category: category || product.category,
		unit: unit || product.unit,
		description: description || product.description,
	};

	if (stock !== undefined) {
		updateData.stock = stock;
	}
	if (price !== undefined) {
		updateData.price = price;
	}
	if (discount !== undefined) {
		updateData.discount = discount;
	}
	if (subCategory) {
		updateData.subCategory = JSON.parse(subCategory);
	}
	if (moreDetails) {
		updateData.moreDetails = JSON.parse(moreDetails);
	}

	const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
		new: true,
	});

	return res.status(200).json(new ApiResponse(200, updatedProduct, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
	const { productId } = req.params;

	const product = await Product.findById(productId);

	if (!product) {
		throw new ApiError(404, 'Product not found');
	}

	await Product.findByIdAndDelete(productId);

	return res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully'));
});

export const getProductByCategory = asyncHandler(async (req, res) => {
	const { id } = req.body;

	if (!id) {
		throw new ApiError(400, 'category id is required');
	}

	const products = await Product.find({
		category: id,
	})
		.populate('category', 'name')
		.populate('subCategory', 'name')
		.limit(10);

	return res.status(200).json(new ApiResponse(200, products, 'Products by Category fetched successfully'));
});

export const getProductByCategoryAndSubCategory = asyncHandler(async (req, res) => {
	const { categoryId, subCategoryId, page = 1, limit = 3 } = req.body;
	// console.log('categoryId', categoryId);
	// console.log('subCategoryId', subCategoryId);

	if (!categoryId || !subCategoryId) {
		throw new ApiError(400, 'Category id and SubCategory id is required');
	}

	const currentPage = Number(page) || 1;
	const currentLimit = Number(limit) || 10;

	const skip = (currentPage - 1) * currentLimit;

	const products = await Product.find({
		category: categoryId,
		subCategory: { $in: [subCategoryId] },
	})
		.populate('category', 'name')
		.populate('subCategory', 'name')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(currentLimit);
	// console.log('products', products);

	const totalProducts = await Product.countDocuments({
		category: categoryId,
		subCategory: { $in: [subCategoryId] },
	});

	const totalPages = Math.ceil(totalProducts / currentLimit);

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				products,
				totalProducts,
				totalPages,
				currentPage: Number(page),
			},
			'Products fetched successfully',
		),
	);
});

export const getProductDetails = asyncHandler(async (req, res) => {
	const { productId } = req.params;

	const product = await Product.findById(productId).populate('subCategory', 'name');

	if (!product) {
		throw new ApiError(404, 'Product not found');
	}

	return res.status(200).json(new ApiResponse(200, product, 'product details fetch successfully'));
});

export const searchProducts = asyncHandler(async (req, res) => {
	const { q, page = 1, limit = 10 } = req.query;

	if (!q?.trim()) {
		throw new ApiError(400, 'search query is required');
	}

	const currentPage = Number(page);
	const currentLimit = Number(limit);

	const skip = (currentPage - 1) * currentLimit;

	const products = await Product.find({
		name: {
			$regex: q,
			$options: 'i',
		},
	})
		.populate('category', 'name')
		.populate('subCategory', 'name')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(currentLimit);

	const totalProducts = await Product.countDocuments({
		name: {
			$regex: q,
			$options: 'i',
		},
	});

	const totalPages = Math.ceil(totalProducts / currentLimit);

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				products,
				totalProducts,
				totalPages,
				currentPage,
			},
			'Products searched/fetched successfully',
		),
	);
});
