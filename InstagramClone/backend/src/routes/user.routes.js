import { Router } from 'express';
import {
	deleteAccount,
	editProfile,
	followOrUnfollow,
	getProfile,
	getSuggestedUsers,
	login,
	logout,
	register,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile/:id', verifyJWT, getProfile);
router.patch('/profile/edit', verifyJWT, upload.single('profilePicture'), editProfile);
router.get('/suggested-users', verifyJWT, getSuggestedUsers);
router.post('/followorunfollow/:id', verifyJWT, followOrUnfollow);
router.delete('/profile/delete-account', verifyJWT, deleteAccount);

export default router;
