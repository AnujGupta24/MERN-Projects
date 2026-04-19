import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './socket/socket.js'; // use this server to listen istead of app.listen

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

connectDB();

initSocket(server);

server.listen(PORT, () => {
	console.log(`server is running on http://localhost:${PORT}`);
});
