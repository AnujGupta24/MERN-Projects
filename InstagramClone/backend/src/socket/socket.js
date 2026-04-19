import { Server } from 'socket.io';

let io;
const userSocketMap = {}; // this map store socketid corresponding to userId [userId->socketId]
export const getRecieverSocketId = (receiverId) => userSocketMap[receiverId];

const initSocket = (server) => {
	io = new Server(server, {
		cors: {
			origin: 'http://localhost:5173',
			credentials: true,
		},
	});

	io.on('connection', (socket) => {
		const userId = socket.handshake.query.userId;
		if (userId) {
			userSocketMap[userId] = socket.id;
			console.log(`user connected: UserId: ${userId}, SocketId= ${socket.id}`);
		}

		io.emit('getOnlineUsers', Object.keys(userSocketMap));

		socket.on('disconnect', () => {
			if (userId) {
				console.log(`user disconnected: UserId: ${userId}, SocketId= ${socket.id}`);
				delete userSocketMap[userId];
			}

			io.emit('getOnlineUsers', Object.keys(userSocketMap));
		});
	});
};

export { io, initSocket };
