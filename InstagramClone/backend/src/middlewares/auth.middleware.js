import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiErrror.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
	const token = req.cookies?.token;

	if (!token) {
		throw new ApiError(401, 'user not authenticated');
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	const user = await User.findById(decoded.userId);

	if (!user) {
		throw new ApiError(401, 'invalid token');
	}

	req.id = user._id; // using this only to get loggedin userId
	req.user = user;
	next();
});
