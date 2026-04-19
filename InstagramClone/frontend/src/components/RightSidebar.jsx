import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

function RightSidebar() {
	const { user } = useSelector((state) => state.auth);

	return (
		<div className="w-[300px] my-7 mr-10">
			<div className="flex items-center gap-2">
				<Link to={`/profile/${user?._id}`}>
					<Avatar>
						<AvatarImage className={'object-cover'} src={user?.profilePicture} alt="post_img" />
						<AvatarFallback className="bg-gray-200">CN</AvatarFallback>
					</Avatar>
				</Link>
				<div>
					<span className="font-semibold text-sm">
						<Link to={`/profile/${user?._id}`}>{user?.username}</Link>
					</span>
					<div className="text-gray-600 text-sm">{user?.bio || 'Bio here....'}</div>
				</div>
			</div>

			<SuggestedUsers />
		</div>
	);
}
export default RightSidebar;
