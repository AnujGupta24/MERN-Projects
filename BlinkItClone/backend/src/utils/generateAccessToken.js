import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
	const accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
		expiresIn: '1d',
	});

	return accessToken;
};
