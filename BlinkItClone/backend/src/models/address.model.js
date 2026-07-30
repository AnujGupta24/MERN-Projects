import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		addressLine: {
			type: String,
			default: '',
			required: true,
		},
		city: {
			type: String,
		},
		state: {
			type: String,
			default: '',
		},
		pincode: {
			type: String,
		},
		country: {
			type: String,
		},
		mobile: {
			type: Number,
			default: null,
		},
		status: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

export const Address = mongoose.model('Address', addressSchema);
