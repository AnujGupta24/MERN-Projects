import { Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

const userSchema = new Schema(
	{
		username: {
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
		profilePicture: {
			type: String,
			default: '',
		},
		// delete images from cloudinary too
		profilePicturePublicId: {
			type: String,
			default: '',
		},
		bio: {
			type: String,
			default: '',
		},
		gender: {
			type: String,
			enum: ['Male', 'Female'],
		},
		followers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		following: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		bookmarks: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
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

export const User = model('User', userSchema);
