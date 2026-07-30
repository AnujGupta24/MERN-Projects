import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default: '',
		},
		avatarPublicId: {
			type: String,
			default: '',
		},
		mobile: {
			type: Number,
			default: null,
		},
		refreshToken: {
			type: String,
		},
		verifyEmail: {
			type: Boolean,
			default: false,
		},
		lastLoginDate: {
			type: Date,
			default: null,
		},
		status: {
			type: String,
			enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
			default: 'ACTIVE',
		},
		addressDetails: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Address',
				required: true,
			},
		],
		shoppingCart: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Cart',
				required: true,
			},
		],
		orderHistory: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Order',
			},
		],
		forgotPasswordOtp: {
			type: String,
			default: null,
		},
		forgotPasswordExpiry: {
			type: Date,
		},
		role: {
			type: String,
			enum: ['ADMIN', 'USER'],
			default: 'USER',
		},
	},
	{ timestamps: true },
);

userSchema.pre('save', async function () {
	if (!this.isModified('password')) return;

	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
