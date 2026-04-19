import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

const corsOptions = {
	origin: 'http://localhost:5173',
	credentials: true,
};

app.use(cors(corsOptions));

// normal middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/message', messageRoutes);

app.get('/', (req, res) => {
	res.send(`<h1>WELCOME TO INSTAGRAM CLONE</h1>`);
});

// errror handler middleware
app.use(errorHandler);

export default app;
