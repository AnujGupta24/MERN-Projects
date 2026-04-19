import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetRTM from '@/hooks/useGetRTM';

function Messages({ selectedUser }) {
	useGetRTM();
	useGetAllMessages();
	const { messages } = useSelector((state) => state.chat);
	const { user } = useSelector((state) => state.auth);

	return (
		<div className="overflow-y-auto flex-1 p-3">
			<div className="flex justify-center">
				<div className="flex flex-col items-center justify-center">
					<Avatar className="h-20 w-20">
						<AvatarImage className="object-cover" src={selectedUser?.profilePicture} alt="profile" />
						<AvatarFallback className="bg-gray-200">👤</AvatarFallback>
					</Avatar>
					<span className="font-semibold">{selectedUser?.username}</span>
					<Link to={`/profile/${selectedUser?._id}`}>
						<Button className="bg-gray-100 hover:bg-gray-200 h-8" variant="secondary">
							View Profile
						</Button>
					</Link>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{messages &&
					messages.map((msg) => (
						<div
							key={msg._id}
							className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}
							>
								{msg?.message}
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
export default Messages;
