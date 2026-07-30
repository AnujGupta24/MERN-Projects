import { Product } from '../models/product.model.js';
import { Cart } from '../models/cart.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const addToCart = asyncHandler(async (req, res) => {
	const userId = req.user?._id;
	const { productId } = req.params;

	if (!productId) {
		throw new ApiError(404, 'ProductId not found');
	}

	const product = await Product.findById(productId);

	if (!product) {
		throw new ApiError(404, 'Product not found');
	}

	const existingCartItem = await Cart.findOne({
		user: userId,
		product: productId,
	});

	if (existingCartItem) {
		existingCartItem.quantity += 1;
		await existingCartItem.save();

		return res.status(200).json(new ApiResponse(200, existingCartItem, 'Product quantity updated in cart'));
	}

	const cartItem = await Cart.create({
		user: userId,
		product: productId,
		quantity: 1,
	});

	await User.findByIdAndUpdate(userId, {
		$push: {
			shoppingCart: cartItem._id,
		},
	});

	return res.status(201).json(new ApiResponse(201, cartItem, 'Product added to cart'));
});

export const getCartItems = asyncHandler(async (req, res) => {
	const userId = req.user?._id;

	const cartItems = await Cart.find({ user: userId }).populate('product');

	return res.status(200).json(new ApiResponse(200, cartItems, 'Cart items fetched successfully'));
});

export const increaseCartQuantity = asyncHandler(async (req, res) => {
	const userId = req.user?._id;
	const { productId } = req.params;

	const cartItem = await Cart.findOne({
		user: userId,
		product: productId,
	});

	if (!cartItem) {
		throw new ApiError(404, 'Cart item not found');
	}

	cartItem.quantity += 1;
	await cartItem.save();

	return res.status(200).json(new ApiResponse(200, cartItem, 'Cart quantity increased successfully'));
});

export const decreaseCartQuantity = asyncHandler(async (req, res) => {
	const userId = req.user?._id;
	const { productId } = req.params;

	const cartItem = await Cart.findOne({
		user: userId,
		product: productId,
	});

	if (!cartItem) {
		throw new ApiError(404, 'Cart item not found');
	}

	if (cartItem.quantity === 1) {
		await Cart.findByIdAndDelete(cartItem._id);
		return res.status(200).json(new ApiResponse(200, {}, 'Product removed from cart'));
	}

	cartItem.quantity -= 1;
	await cartItem.save();

	return res.status(200).json(new ApiResponse(200, cartItem, 'Cart quantity decreased successfully'));
});
