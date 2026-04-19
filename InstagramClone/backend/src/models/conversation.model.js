import { Schema, model } from 'mongoose';

const conversationModel = new Schema({
	participants: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	],
});

export const Conversation = model('Conversation', conversationModel);
