import cloudinary from '../config/cloudinary.js';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
import { ApiError } from '../utils/apiErrror.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import jwt from 'jsonwebtoken';
import { Comment } from '../models/comment.model.js';

export const register = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		throw new ApiError(400, 'All fields are required');
	}

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		throw new ApiError(409, 'user already exists with this email');
	}

	const user = await User.create({
		username,
		email,
		password,
	});

	return res.status(201).json(new ApiResponse(201, user, 'Account created successfully'));
});

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new ApiError(400, 'email and password are required');
	}

	let user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(401, 'incorrect email or password');
	}

	const isCorrectPassword = await user.isPasswordCorrect(password);

	if (!isCorrectPassword) {
		throw new ApiError(401, 'incorrect email or password');
	}

	const fetchedposts = await Post.find({ author: user._id }).sort({ createdAt: -1 });

	user = {
		_id: user._id,
		username: user.username,
		email: user.email,
		profilePicture: user.profilePicture,
		bio: user.bio,
		followers: user.followers,
		following: user.following,
		posts: fetchedposts,
	};

	const token = jwt.sign(
		{
			userId: user._id,
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN },
	);

	res.cookie('token', token, {
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 1 * 24 * 60 * 60 * 1000,
	});

	return res.status(200).json(new ApiResponse(200, user, `welcome back ${user.username}`));
});

export const logout = asyncHandler(async (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		sameSite: 'strict',
	});

	return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getProfile = asyncHandler(async (req, res) => {
	const userId = req.params.id;

	const user = await User.findById(userId)
		.select('-password')
		.populate({ path: 'posts', createdAt: -1 })
		.populate('bookmarks');

	if (!user) {
		throw new ApiError(404, 'user not found');
	}

	return res.status(200).json(new ApiResponse(200, user, 'user profile fetch successfully'));
});

export const editProfile = asyncHandler(async (req, res) => {
	const userId = req.id;
	const user = await User.findById(userId).select('-password');

	if (!user) {
		throw new ApiError(404, 'user not found');
	}

	const { bio, gender, email } = req.body;
	const profilePicture = req.file;

	let cloudResponse;

	if (profilePicture) {
		// delete old image if exists
		if (user.profilePicturePublicId) {
			await cloudinary.uploader.destroy(user.profilePicturePublicId);
		}

		// upload new image
		cloudResponse = await uploadToCloudinary(profilePicture.path);

		if (!cloudResponse) {
			throw new ApiError(500, 'Image upload failed');
		}

		// setting the path of secure url and public id in user
		user.profilePicture = cloudResponse.secure_url;
		user.profilePicturePublicId = cloudResponse.public_id;
	}

	// console.log('editProfile controller cloudResponse', cloudResponse);

	if (bio) user.bio = bio;
	if (gender) user.gender = gender;
	if (email) user.email = email;

	await user.save();
	// console.log('updated user', user);

	return res.status(200).json(new ApiResponse(200, user, 'profile updated successfully'));
});

export const getSuggestedUsers = asyncHandler(async (req, res) => {
	const currentUserId = req.id; // loggedin User

	const currentUser = await User.findById(currentUserId);

	if (!currentUser) {
		throw new ApiError(400, 'user not found');
	}

	const suggestedUsers = await User.find({
		_id: { $ne: currentUserId, $nin: currentUser.following },
	})
		.select('-password')
		.limit(5);

	return res
		.status(200)
		.json(new ApiResponse(200, { users: suggestedUsers }, 'suggested users fetched successfully'));
});

export const followOrUnfollow = asyncHandler(async (req, res) => {
	const myId = req.id; // loggedin user
	const userId = req.params.id; // user to follow/unfollow

	if (myId.toString() === userId) {
		throw new ApiError(400, 'You cannot follow yourself');
	}

	// on basis of id find both the users
	const me = await User.findById(myId);
	const user = await User.findById(userId);

	if (!me || !user) {
		throw new ApiError(400, 'user not found');
	}

	// check if already following
	const isFollowing = me.following.includes(userId);

	if (isFollowing) {
		// unfollow
		await Promise.all([
			User.updateOne({ _id: myId }, { $pull: { following: userId } }),
			User.updateOne({ _id: userId }, { $pull: { followers: myId } }),
		]);
		return res.status(200).json(new ApiResponse(200, null, 'user unfollowed successfully'));
	} else {
		// follow
		await Promise.all([
			User.updateOne({ _id: myId }, { $addToSet: { following: userId } }),
			User.updateOne({ _id: userId }, { $addToSet: { followers: myId } }),
		]);
		return res.status(200).json(new ApiResponse(200, null, 'user followed successfully'));
	}
});

export const deleteAccount = asyncHandler(async (req, res) => {
	const userId = req.id;
	console.log('user', userId);

	const user = await User.findById(userId);

	if (!user) {
		throw new ApiError(404, 'user not found');
	}

	// delete user profile image from cloudinary
	if (user.profilePicturePublicId) {
		await cloudinary.uploader.destroy(user.profilePicturePublicId);
	}

	// get all posts of this user
	const posts = await Post.find({ author: userId });
	const postIds = posts.map((post) => post._id);

	// delete each post image from cloudinary
	await Promise.all(
		posts.filter((post) => post.imagePublicId).map((post) => cloudinary.uploader.destroy(post.imagePublicId)),
	);

	// delete everything from db
	await Promise.all([
		// remove user from followers/following
		User.updateMany({ followers: userId }, { $pull: { followers: userId } }),
		User.updateMany({ following: userId }, { $pull: { following: userId } }),

		// remove deleted posts from the bookmarks of others
		User.updateMany({ bookmarks: { $in: postIds } }, { $pull: { bookmarks: { $in: postIds } } }),

		// delete comments
		Comment.deleteMany({ author: userId }),
		Comment.deleteMany({ post: { $in: postIds } }),

		// Delete posts
		Post.deleteMany({ author: userId }),

		// finally delete the user Account
		User.findByIdAndDelete(userId),
	]);

	res.clearCookie('token', {
		httpOnly: true,
		sameSite: 'strict',
	});

	return res.status(200).json(new ApiResponse(200, null, 'Account delete successfully'));
});
