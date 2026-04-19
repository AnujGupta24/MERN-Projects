import cloudinary from '../config/cloudinary.js';
import { Comment } from '../models/comment.model.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { getRecieverSocketId, io } from '../socket/socket.js';
import { ApiError } from '../utils/apiErrror.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const addNewPost = asyncHandler(async (req, res) => {
	const userId = req.id;
	const image = req.file;
	const { caption } = req.body;

	if (!image) {
		throw new ApiError(400, 'image not found');
	}

	const cloudResponse = await uploadToCloudinary(image.path);
	// console.log('image....', image);
	// console.log('cloudResponse....', cloudResponse);

	if (!cloudResponse) {
		throw new ApiError(500, 'failed to upload post');
	}

	const post = await Post.create({
		caption,
		image: cloudResponse.secure_url,
		imagePublicId: cloudResponse.public_id,
		author: userId,
	});

	const user = await User.findById(userId);

	if (user) {
		user.posts.push(post._id);
		await user.save();
	}

	await post.populate({ path: 'author', select: '-password' });

	return res.status(201).json(new ApiResponse(201, post, 'new post added'));
});

export const getAllPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find()
		.sort({ createdAt: -1 })
		.populate({ path: 'author', select: 'username profilePicture' })
		.populate({
			path: 'comments',
			options: { sort: { createdAt: -1 } },
			populate: { path: 'author', select: 'username profilePicture' },
		});

	return res.status(200).json(new ApiResponse(200, posts, 'posts fetched successfully'));
});

export const getUserPosts = asyncHandler(async (req, res) => {
	const userId = req.id;

	const posts = await Post.find({ author: userId })
		.sort({ createdAt: -1 })
		.populate({ path: 'author', select: 'username profilePicture' })
		.populate({
			path: 'comments',
			options: { sort: { createdAt: -1 }, limit: 5 },
			populate: { path: 'author', select: 'username profilePicture' },
		});

	return res.status(200).json(new ApiResponse(200, posts, 'profile posts fetch successfully'));
});

export const likePost = asyncHandler(async (req, res) => {
	const userId = req.id;
	const postId = req.params.id;

	const post = await Post.findById(postId);

	if (!post) {
		throw new ApiError(404, 'post not found');
	}

	await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });

	// implement socketIo for real time notification
	const user = await User.findById(userId).select('username profilePicture');
	const postOwnerId = post.author.toString();

	if (postOwnerId !== userId) {
		// emit a notification event
		const notification = {
			type: 'like',
			userId: userId,
			userDetails: user,
			postId,
			message: 'Your post was liked',
		};

		const postOwnerSocketId = getRecieverSocketId(postOwnerId);
		io.to(postOwnerSocketId).emit('notification', notification);
	}

	return res.status(200).json(new ApiResponse(200, null, 'post liked successfully'));
});

export const dislikePost = asyncHandler(async (req, res) => {
	const userId = req.id;
	const postId = req.params.id;

	const post = await Post.findById(postId);

	if (!post) {
		throw new ApiError(404, 'post not found');
	}

	await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });

	// implement socketIo for real time notification
	const user = await User.findById(userId).select('username profilePicture');
	const postOwnerId = post.author.toString();

	if (postOwnerId !== userId) {
		// emit a notification event
		const notification = {
			type: 'dislike',
			userId: userId,
			userDetails: user,
			postId,
			message: 'Your post was disliked',
		};

		const postOwnerSocketId = getRecieverSocketId(postOwnerId);
		io.to(postOwnerSocketId).emit('notification', notification);
	}

	return res.status(200).json(new ApiResponse(200, null, 'post disliked successfully'));
});

export const addComment = asyncHandler(async (req, res) => {
	const userId = req.id;
	const postId = req.params.id;
	const { text } = req.body;

	if (!text) {
		throw new ApiError(400, 'text is required');
	}

	const post = await Post.findById(postId);

	if (!post) {
		throw new ApiError(404, 'post not found');
	}

	const comment = await Comment.create({
		text,
		author: userId,
		post: postId,
	});

	await comment.populate({
		path: 'author',
		select: 'username profilePicture',
	});

	post.comments.push(comment._id);
	await post.save();

	return res.status(201).json(new ApiResponse(201, comment, 'comment added successfully'));
});

export const deleteComment = asyncHandler(async (req, res) => {
	const userId = req.id;
	const commentId = req.params.id;

	const comment = await Comment.findById(commentId);

	if (!comment) {
		throw new ApiError(404, 'comment not found');
	}

	const post = await Post.findById(comment.post);

	const isCommentAuthor = comment.author.toString() === userId.toString();
	const isPostOwner = post.author.toString() === userId.toString();

	if (!isCommentAuthor && !isPostOwner) {
		throw new ApiError(403, 'not allowed');
	}

	await Post.findByIdAndUpdate(comment.post, {
		$pull: { comments: commentId },
	});

	await comment.deleteOne();

	return res.status(200).json(new ApiResponse(200, null, 'comment deleted successfully'));
});

export const getCommentsOfPost = asyncHandler(async (req, res) => {
	const postId = req.params.id;

	const post = await Post.findById(postId);

	if (!post) {
		throw new ApiError(400, 'post not found');
	}

	const comments = await Comment.find({ post: postId })
		.sort({ createdAt: -1 })
		.populate('author', 'username profilePicture');

	if (!comments) {
		throw new ApiError(400, 'no comments found for this post');
	}
	return res.status(201).json(new ApiResponse(201, comments, 'All comments fetched successfully'));
});

export const toggleBookmark = asyncHandler(async (req, res) => {
	const userId = req.id;
	const postId = req.params.id;

	const post = await Post.findById(postId);
	if (!post) {
		throw new ApiError(400, 'post not found');
	}

	const user = await User.findById(userId);
	if (!user) {
		throw new ApiError(404, 'user not found');
	}

	// Safe ObjectId comparison
	const isBookmarked = user.bookmarks.some((id) => id.toString() === postId);

	if (isBookmarked) {
		// remove from the bookmark
		await User.findByIdAndUpdate(userId, { $pull: { bookmarks: postId } });
		return res.status(200).json(new ApiResponse(200, { type: 'unsaved' }, 'post remove from bookmark'));
	} else {
		// add to bookmark
		await User.findByIdAndUpdate(userId, { $addToSet: { bookmarks: postId } });
		return res.status(200).json(new ApiResponse(200, { type: 'saved' }, 'post bookmarked successfully'));
	}
});

export const deletePost = asyncHandler(async (req, res) => {
	const userId = req.id;
	const postId = req.params.id;

	const post = await Post.findById(postId);

	if (!post) {
		throw new ApiError(400, 'post not found');
	}

	// only loggedin user delete the post
	if (post.author.toString() !== userId.toString()) {
		throw new ApiError(400, 'not authorized to delete this post');
	}

	if (post.imagePublicId) {
		await cloudinary.uploader.destroy(post.imagePublicId);
	}

	await Comment.deleteMany({ post: postId });

	// remove post ref from the users posts array
	await User.updateOne({ _id: userId }, { $pull: { posts: postId } });

	await Post.findByIdAndDelete(postId);

	return res.status(200).json(new ApiResponse(200, null, 'post deleted successfully'));
});
