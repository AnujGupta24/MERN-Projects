import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

export const verifyAuth = asyncHandler(async (req, res, next) => {
	const token = req.cookies?.accessToken || req?.headers?.Authorization?.split(' ')[1];

	if (!token) {
		throw new ApiError(401, 'unauthorized');
	}

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
		const user = await User.findById(decoded._id).select('-password');

		if (!user) {
			throw new ApiError(401, 'user not found');
		}

		req.user = user;
		next();
	} catch (error) {
		throw new ApiError(401, 'Invalid or expired token');
	}
});

export const isAdmin = asyncHandler(async (req, res, next) => {
	if (req.user.role !== 'ADMIN') {
		throw new ApiError(403, 'Access denied. Admin only');
	}

	next();
});
