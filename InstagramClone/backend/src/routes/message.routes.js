import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getMessage, sendMessage } from '../controllers/message.controller.js';

const router = Router();

router.post('/send-message/:id', verifyJWT, sendMessage);
router.get('/all/:id', verifyJWT, getMessage);

export default router;
