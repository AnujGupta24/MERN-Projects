import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		orderId: {
			type: String,
			required: true,
			unique: true,
		},
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
		productDetails: {
			name: String,
			image: [],
		},
		paymentId: {
			type: String,
			default: '',
		},
		paymentStatus: {
			type: String,
		},
		deliveryAddress: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Address',
		},
		deliveryStatus: {
			type: String,
		},
		totalAmount: {
			type: Number,
			default: 0,
		},
		subTotalAmount: {
			type: Number,
			default: 0,
		},
		invoiceReceipt: {
			type: String,
			default: '',
		},
	},
	{ timestamps: true },
);

export const Order = mongoose.model('Order', orderSchema);
