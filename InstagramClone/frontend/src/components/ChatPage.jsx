import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setMessages, setSelectedUser } from '@/redux/chatSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import { useState } from 'react';
import { axiosInstance } from '@/lib/utils';
import { toast } from 'sonner';

function ChatPage() {
	const { user, suggestedUsers } = useSelector((state) => state.auth);
	console.log('USER: ', user, 'SUGGESTEDUSERS: ', suggestedUsers);

	const { selectedUser, onlineUsers, messages } = useSelector((state) => state.chat);
	const { socket } = useSelector((state) => state.socketio);

	const dispatch = useDispatch();
	const [textMessage, setTextMessage] = useState('');

	const sendMessageHandler = async (recieverId) => {
		try {
			const res = await axiosInstance.post(`/message/send-message/${recieverId}`, {
				message: textMessage,
			});
			// console.log('sendMessageHandler res:', res);

			if (res.data.success) {
				const message = res.data.data;
				dispatch(setMessages([...messages, message]));

				socket?.emit('sendMessage', message);
				setTextMessage('');
			}
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	return (
		<div className="flex ml-[16%] h-screen">
			<section className="w-full md:w-1/4 my-6">
				<h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
				<hr className="border-gray-300" />
				{/* suggested user to chat with */}
				<div className="overflow-y-auto h-[80vh]">
					{suggestedUsers.map((suggestedUser) => {
						const isOnline = onlineUsers.includes(suggestedUser?._id);

						return (
							<div
								key={suggestedUser?._id}
								onClick={() => dispatch(setSelectedUser(suggestedUser))}
								className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer"
							>
								<Avatar className="h-10 w-10">
									<AvatarImage
										className="object-cover"
										src={suggestedUser?.profilePicture}
										alt="profile_pic"
									/>
									<AvatarFallback className="bg-gray-200">👤</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="font-medium">{suggestedUser?.username}</span>
									<span
										className={`text-sm font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}
									>
										{isOnline ? 'online' : 'offline'}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* selecteduser to chat with */}
			{selectedUser ? (
				<section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
					<div className="flex gap-2 items-center mt-6 px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
						<Avatar className="h-10 w-10">
							<AvatarImage
								className="object-cover"
								src={selectedUser?.profilePicture}
								alt="profile_pic"
							/>
							<AvatarFallback className="bg-gray-200">👤</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span>{selectedUser?.username}</span>
						</div>
					</div>

					<Messages selectedUser={selectedUser} />

					<div className="flex items-center p-3 border-t border-t-gray-300">
						<Input
							value={textMessage}
							onChange={(e) => setTextMessage(e.target.value)}
							type="text"
							className="flex-1 mr-2 focus-visible:ring-transparent"
							placeholder="Messages..."
						/>
						<Button
							onClick={() => sendMessageHandler(selectedUser?._id)}
							className="bg-purple-600 text-white h-8"
							variant="secondary"
						>
							Send
						</Button>
					</div>
				</section>
			) : (
				<div className="flex items-center justify-center flex-col mx-auto">
					<MessageCircleCode className="w-32 h-32 my-4" />
					<h1 className="font-medium text-xl">Your messages</h1>
					<span>send a message to start a chat</span>
				</div>
			)}
		</div>
	);
}
export default ChatPage;
