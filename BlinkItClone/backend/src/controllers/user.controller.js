import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { verifyEmailTemplate } from '../templates/verifyEmailTemplate.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessToken } from '../utils/generateAccessToken.js';
import { generateRefreshToken } from '../utils/generateRefreshToken.js';
import sendEmail from '../utils/sendEmail.js';
import cloudinary from '../config/cloudinary.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { generateOtp } from '../utils/generateOtp.js';
import { forgotPasswordTemplate } from '../templates/forgotPasswordTemplate.js';

export const register = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		throw new ApiError(400, 'All fields are required');
	}

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		throw new ApiError(409, 'user already exists');
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${user?._id}`;

	await sendEmail({
		to: user?.email,
		subject: 'welcome to blinkit',
		html: verifyEmailTemplate({
			name: user?.name,
			url: verifyEmailUrl,
		}),
	});

	return res.status(201).json(new ApiResponse(201, user, 'user register successfully'));
});

export const verifyEmail = asyncHandler(async (req, res) => {
	const { code } = req.body;

	const user = await User.findById(code).select('-password');

	if (!user) {
		throw new ApiError(400, 'Invalid code');
	}

	user.verifyEmail = true;
	await user.save();

	return res.status(201).json(new ApiResponse(201, user, 'user verified successfully'));
});

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new ApiError(409, 'All fields are required');
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(400, 'user not found');
	}

	if (!user.verifyEmail) {
		throw new ApiError(403, 'please verify your email first');
	}

	if (user.status === 'SUSPENDED') {
		throw new ApiError(403, 'Your account has been suspended');
	}

	if (user.status === 'INACTIVE') {
		throw new ApiError(403, 'Your account is inactive please contact ADMIN');
	}

	const isPasswordMatch = await user.isPasswordCorrect(password);

	if (!isPasswordMatch) {
		throw new ApiError(400, 'Incorrect Password');
	}

	const accessToken = await generateAccessToken(user._id);
	const refreshToken = await generateRefreshToken(user._id);

	await User.findByIdAndUpdate(user?._id, {
		lastLoginDate: new Date(),
	});

	const accessTokenMaxAge = 1 * 24 * 60 * 60 * 1000; //1days
	const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; //7days

	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: false, // true in production with HTTPS
		sameSite: 'Lax', // use None only with secure:true
		maxAge: accessTokenMaxAge,
	});
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: 'Lax',
		maxAge: refreshTokenMaxAge,
	});

	const loggedInUser = await User.findById(user._id).select('-password -forgotPasswordOtp');

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				user: loggedInUser,
				accessToken,
				refreshToken,
			},
			'Login successfully',
		),
	);
});

export const logout = asyncHandler(async (req, res) => {
	const userId = req.user?._id;

	if (!userId) {
		throw new ApiError(401, 'unauthorized request');
	}

	const user = await User.findByIdAndUpdate(userId, {
		refreshToken: '',
	});

	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	const accessTokenOptions = {
		httpOnly: true,
		secure: false, // true in production with HTTPS
		sameSite: 'Lax',
	};

	const refreshTokenOptions = {
		httpOnly: true,
		secure: false,
		sameSite: 'Lax',
	};

	return res
		.status(200)
		.clearCookie('accessToken', accessTokenOptions)
		.clearCookie('refreshToken', refreshTokenOptions)
		.json(new ApiResponse(200, {}, 'Logout successfully'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
	// forgotPassword(controller)->send otp(send email)->verify otp(controller)->reset pwd(controller)
	const { email } = req.body;

	if (!email) {
		throw new ApiError(400, 'email is required');
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, 'user not found');
	}

	const otp = generateOtp();
	const expiry = new Date(Date.now() + 10 * 60 * 1000);

	await User.updateOne(
		{ _id: user._id },
		{
			forgotPasswordOtp: otp,
			forgotPasswordExpiry: expiry,
		},
	);

	try {
		await sendEmail({
			to: user.email,
			subject: 'Reset Password - OTP from Blinkit-Clone',
			html: forgotPasswordTemplate({
				name: user?.name,
				otp,
			}),
		});
	} catch (error) {
		// rollback
		user.forgotPasswordOtp = null;
		user.forgotPasswordExpiry = null;

		await user.save({ validateBeforeSave: false });

		throw new ApiError(500, 'Failed to send reset email');
	}

	return res.status(201).json(new ApiResponse(201, {}, 'Forgot password mail sent successfully'));
});

export const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
	const { email, otp } = req.body;

	if (!email || !otp) {
		throw new ApiError(400, 'Email and otp is required');
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, 'user not found');
	}

	if (!user.forgotPasswordOtp || !user.forgotPasswordExpiry) {
		throw new ApiError(400, 'No otp request found');
	}

	if (user.forgotPasswordExpiry < new Date()) {
		throw new ApiError(400, 'OTP expired');
	}

	if (user.forgotPasswordOtp !== otp) {
		throw new ApiError(400, 'Invalid otp');
	}

	return res.status(201).json(new ApiResponse(201, {}, 'OTP verified successfully'));
});

export const resetPassword = asyncHandler(async (req, res) => {
	const { email, otp, newPassword, confirmPassword } = req.body;

	if (!email || !otp || !newPassword || !confirmPassword) {
		throw new ApiError(400, 'All fields are required');
	}

	if (newPassword !== confirmPassword) {
		throw new ApiError(400, 'Password do not match');
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, 'user not found');
	}

	if (user.forgotPasswordExpiry < new Date()) {
		throw new ApiError(400, 'OTP expired');
	}

	if (user.forgotPasswordOtp !== otp) {
		throw new ApiError(400, 'Invalid otp');
	}

	user.password = newPassword;
	user.forgotPasswordOtp = null;
	user.forgotPasswordExpiry = null;

	user.refreshToken = undefined;
	await user.save();

	return res.status(201).json(new ApiResponse(201, {}, 'Password reset successfully'));
});

export const uploadAvatar = asyncHandler(async (req, res) => {
	const userId = req.user?._id;
	const user = await User.findById(userId);

	if (!user) {
		throw new ApiError(404, 'user not found');
	}

	const image = req.file;

	if (!image) {
		throw new ApiError(409, 'image not found');
	}

	let cloudResponse;

	if (image) {
		if (user.avatarPublicId) {
			await cloudinary.uploader.destroy(user.avatarPublicId);
		}

		cloudResponse = await uploadToCloudinary(image.path);

		if (!cloudResponse) {
			throw new ApiError(500, 'Image upload failed');
		}

		user.avatar = cloudResponse.secure_url;
		user.avatarPublicId = cloudResponse.public_id;

		await user.save();
	}

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				userId: user._id,
				avatar: user.avatar,
			},
			'Profile image uploaded successfully',
		),
	);
});

export const updateUserDetails = asyncHandler(async (req, res) => {
	const userId = req.user?._id;

	const { name, password, email, addressDetails, mobile } = req.body;

	const user = await User.findById(userId);

	if (!user) {
		throw new ApiError(403, 'user not found');
	}

	if (email && email !== user.email) {
		const existinguser = await User.findOne({ email });

		if (existinguser) {
			throw new ApiError(409, 'Email already in use');
		}

		user.email = email;
	}

	if (name) user.name = name;
	if (password) user.password = password;
	if (mobile) user.mobile = mobile;
	if (addressDetails) user.addressDetails = addressDetails;

	await user.save();

	const updatedUser = await User.findById(userId).select(
		'-password -refreshToken -forgotPasswordOtp -forgotPasswordExpiry',
	);

	return res.status(200).json(new ApiResponse(200, updatedUser, 'Updated successfully'));
});

export const refreshToken = asyncHandler(async (req, res) => {
	const incomingRefreshToken = req.cookies.refreshToken || req?.headers?.Authorization?.split(' ')[1];

	if (!incomingRefreshToken) {
		throw new ApiError(401, 'refresh token not found');
	}

	let decoded;
	try {
		decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
	} catch (error) {
		throw new ApiError(401, 'Invalid or expired refresh token');
	}

	const user = await User.findById(decoded._id);

	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	// db match
	if (user.refreshToken !== incomingRefreshToken) {
		throw new ApiError(401, 'Refresh token mismatch');
	}

	// Generate new tokens
	const newAccessToken = generateAccessToken(user._id);
	const newRefreshToken = await generateRefreshToken(user._id);

	const cookeiOptions = {
		httpOnly: true,
		secure: false,
		sameSite: 'Lax',
	};

	res.cookie('accessToken', newAccessToken, cookeiOptions);
	res.cookie('refreshToken', newRefreshToken, cookeiOptions);

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			},
			'New Access/Refresh Token generated successfully',
		),
	);
});

export const getCurrentUser = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const user = await User.findById(userId).select(
		'-password -refreshToken -forgotPasswordExpiry -forgotPasswordOtp',
	);

	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	return res.status(201).json(new ApiResponse(201, user, 'Current User fetched successfully'));
});
