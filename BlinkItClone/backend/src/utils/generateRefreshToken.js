import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const generateRefreshToken = async (userId) => {
	const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
		expiresIn: '7d',
	});

	await User.updateOne(
		{
			_id: userId,
		},
		{
			refreshToken: refreshToken,
		},
	);

	return refreshToken;
};
