import { Conversation } from '../models/conversation.model.js';
import { Message } from '../models/message.model.js';
import { getRecieverSocketId, io } from '../socket/socket.js';
import { ApiError } from '../utils/apiErrror.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const sendMessage = asyncHandler(async (req, res) => {
	const senderId = req.id;
	const receiverId = req.params.id;
	const { message } = req.body;

	if (!message) {
		throw new ApiError(400, 'message cannot be empty');
	}

	// find conversation
	let conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	});

	// create if not exists
	if (!conversation) {
		conversation = await Conversation.create({
			participants: [senderId, receiverId],
		});
	}

	// create new message
	const newMessage = await Message.create({
		senderId,
		receiverId,
		message,
	});

	// push message into conversation
	if (newMessage) conversation.messages.push(newMessage._id);
	await conversation.save();

	//implement socketio
	const recieverSocketId = getRecieverSocketId(receiverId);
	if (recieverSocketId) {
		io.to(recieverSocketId).emit('newMessage', newMessage);
	}

	return res.status(201).json(new ApiResponse(201, newMessage, 'message sent successfully'));
});

export const getMessage = asyncHandler(async (req, res) => {
	const senderId = req.id;
	const receiverId = req.params.id;

	const conversation = await Conversation.findOne({
		participants: { $all: [senderId, receiverId] },
	}).populate({
		path: 'messages',
		options: { sort: { createdAt: 1 } },
	});

	if (!conversation) {
		return res.status(200).json(new ApiResponse(200, [], 'no messages found'));
	}

	return res.status(200).json(new ApiResponse(200, conversation?.messages, 'message fetched successfully'));
});
