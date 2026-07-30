import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Cart } from '../models/cart.model.js';
import { instance } from '../config/razorpay.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import { paymentSuccessEmail } from '../templates/paymentSuccessEmail.js';
import { generateInvoice } from '../utils/generateInvoice.js';

export const cashOnDelivery = asyncHandler(async (req, res) => {
	try {
		const userId = req.user._id;
		const { productItems, totalAmount, deliveryAddress, subTotalAmount } = req.body;

		const payload = productItems.map((item) => {
			return {
				user: userId,
				orderId: `ORD-${new mongoose.Types.ObjectId()}`,
				productId: item.product?._id,
				productDetails: {
					name: item.product?.name,
					image: item.product?.image?.[0],
				},
				paymentStatus: 'CASH ON DELIVERY',
				deliveryAddress,
				totalAmount,
				subTotalAmount,
			};
		});

		const generatedOrder = await Order.insertMany(payload);

		// remove from cart
		const user = await User.findById(userId);

		await Promise.all([
			Cart.deleteMany({ user: userId }),
			User.findByIdAndUpdate(userId, {
				$set: {
					shoppingCart: [],
				},
			}),
		]);

		return res.status(201).json(new ApiResponse(201, generatedOrder, 'Order successfully'));
	} catch (error) {
		console.log('CASH ON DELIVERY ERROR:', error);
		throw error;
	}
});

export const PayOnline = asyncHandler(async (req, res) => {
	try {
		const { totalAmount } = req.body;

		const options = {
			amount: totalAmount * 100, // paise
			currency: 'INR',
			receipt: `receipt_${Date.now()}`,
		};

		const razorpayOrder = await instance.orders.create(options);

		return res.status(200).json(new ApiResponse(200, razorpayOrder, 'Razorpay order created successfully'));
	} catch (error) {
		console.log('PAY ONLINE ERROR:', error);
		throw error;
	}
});

export const verifyPayment = asyncHandler(async (req, res) => {
	try {
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,

			productItems,
			totalAmount,
			subTotalAmount,
			deliveryAddress,
		} = req.body;

		const generatedSignature = crypto
			.createHmac('sha256', process.env.RAZORPAY_SECRET)
			.update(razorpay_order_id + '|' + razorpay_payment_id)
			.digest('hex');

		if (generatedSignature !== razorpay_signature) {
			throw new ApiError(400, 'Payment verification failed');
		}

		let userId = req.user._id;
		let user = await User.findById(userId);

		const payload = productItems.map((item) => ({
			user: userId,
			orderId: `ORD-${new mongoose.Types.ObjectId()}`,
			products: item.product._id,
			productDetails: {
				name: item.product.name,
				image: item.product.image[0],
			},
			paymentStatus: 'PAID',
			paymentId: razorpay_payment_id,
			deliveryAddress,
			totalAmount,
			subTotalAmount,
			invoiceReceipt: '',
		}));

		const generatedOrder = await Order.insertMany(payload);

		let invoicePath = null;

		try {
			invoicePath = await generateInvoice(generatedOrder[0], user, razorpay_payment_id);

			if (invoicePath) {
				await Order.updateMany(
					{
						orderId: generatedOrder[0].orderId,
					},
					{
						$set: {
							invoiceReceipt: invoicePath,
						},
					},
				);
			}
		} catch (err) {
			console.error('Invoice generation failed:', err);
		}

		try {
			await sendEmail({
				to: user.email,
				subject: 'Payment done Successfully',
				html: paymentSuccessEmail(user.name, totalAmount, generatedOrder[0].orderId, razorpay_payment_id),
				attachments: invoicePath
					? [
							{
								filename: 'invoice.pdf',
								path: invoicePath,
							},
						]
					: [],
			});
		} catch (err) {
			console.error('Email sending failed:', err);
		}

		await Promise.all([
			Cart.deleteMany({ user: userId }),
			User.findByIdAndUpdate(userId, {
				$set: {
					shoppingCart: [],
				},
			}),
		]);

		const updatedOrders = await Order.find({
			orderId: generatedOrder[0].orderId,
		});

		return res.status(200).json(new ApiResponse(200, updatedOrders, 'Payment verified successfully'));
	} catch (error) {
		console.log('VERIFY PAYMENT ERROR:', error);
		throw error;
	}
});

export const getMyOrders = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const orders = await Order.find({
		user: userId,
	})
		.populate('products')
		.populate('deliveryAddress')
		.sort({ createdAt: -1 });

	return res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
});
