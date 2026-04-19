import { Schema, model } from 'mongoose';

const messageModel = new Schema({
	senderId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	receiverId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	message: {
		type: String,
		required: true,
	},
});

export const Message = model('Message', messageModel);
