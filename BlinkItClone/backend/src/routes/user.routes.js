import { Router } from 'express';
import multer from 'multer';
import {
	forgotPassword,
	getCurrentUser,
	login,
	logout,
	refreshToken,
	register,
	resetPassword,
	updateUserDetails,
	uploadAvatar,
	verifyEmail,
	verifyForgotPasswordOtp,
} from '../controllers/user.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const userRoutes = Router();

userRoutes.post('/register', register);
userRoutes.post('/verify-email', verifyEmail);
userRoutes.post('/login', login);
userRoutes.post('/forgot-password', forgotPassword);
userRoutes.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
userRoutes.post('/reset-password', resetPassword);
userRoutes.post('/refresh-token', refreshToken);

// auth routes
userRoutes.get('/me', verifyAuth, getCurrentUser);
userRoutes.post('/logout', verifyAuth, logout);
userRoutes.patch('/upload-avatar', verifyAuth, upload.single('profileImage'), uploadAvatar);
userRoutes.patch('/edit-user-details', verifyAuth, updateUserDetails);

export default userRoutes;
