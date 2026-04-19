import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
	addComment,
	addNewPost,
	deleteComment,
	deletePost,
	dislikePost,
	getAllPosts,
	getCommentsOfPost,
	getUserPosts,
	likePost,
	toggleBookmark,
} from '../controllers/post.controller.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/create', verifyJWT, upload.single('image'), addNewPost);
router.get('/all', verifyJWT, getAllPosts);
router.get('/me', verifyJWT, getUserPosts);
router.post('/like/:id', verifyJWT, likePost);
router.post('/dislike/:id', verifyJWT, dislikePost);
router.post('/comment/:id', verifyJWT, addComment);
router.delete('/delete-comment/:id', verifyJWT, deleteComment);
router.get('/comments/:id', verifyJWT, getCommentsOfPost);
router.get('/bookmark/:id', verifyJWT, toggleBookmark);
router.delete('/:id', verifyJWT, deletePost);

export default router;
