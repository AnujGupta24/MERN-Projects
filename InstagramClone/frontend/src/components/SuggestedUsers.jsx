import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';

function SuggestedUsers() {
	const { suggestedUsers } = useSelector((state) => state.auth);
	// console.log('suggestedUsers', suggestedUsers);

	return (
		<div className="my-5 pr-2">
			<div className="flex items-center justify-between text-sm">
				<h1 className="font-semibold text-gray-600">Suggested for you</h1>
				<span className="font-medium cursor-pointer">See all</span>
			</div>

			{suggestedUsers?.length > 0 &&
				suggestedUsers.map((user) => (
					<div key={user._id} className="flex items-center justify-between my-3">
						<div className="flex items-center gap-2">
							<Link to={`/profile/${user?._id}`}>
								<Avatar>
									<AvatarImage
										className={'object-cover'}
										src={user?.profilePicture}
										alt="post_img"
									/>
									<AvatarFallback className="bg-gray-200">CN</AvatarFallback>
								</Avatar>
							</Link>
							<div>
								<span className="font-semibold text-sm">
									<Link to={`/profile/${user?._id}`}>{user?.username}</Link>
								</span>
								<div className="text-gray-600 text-xs">{user?.bio || 'Bio here....'}</div>
							</div>
						</div>
						<span className="text-[#3badf8] text-sm font-bold cursor-pointer hover:text-[#3badf8]">
							Follow
						</span>
					</div>
				))}
		</div>
	);
}
export default SuggestedUsers;
