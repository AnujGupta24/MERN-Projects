import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		image: [
			{
				type: String,
				required: true,
			},
		],
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		subCategory: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'SubCategory',
			},
		],
		unit: {
			type: String,
			default: '',
		},
		stock: {
			type: Number,
			default: null,
		},
		price: {
			type: Number,
			default: null,
		},
		discount: {
			type: Number,
			default: null,
		},
		description: {
			type: String,
		},
		moreDetails: [
			{
				key: String,
				value: String,
			},
		],
		publish: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

productSchema.index({ name: 'text' });

productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });

export const Product = mongoose.model('Product', productSchema);
