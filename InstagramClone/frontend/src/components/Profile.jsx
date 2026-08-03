import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/utils';
import { logout, toggleFollowOrUnfollowUser } from '@/redux/authSlice';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';

function Profile() {
	const params = useParams();
	const userId = params.id;
	useGetUserProfile(userId);

	const { userProfile, user } = useSelector((state) => state.auth);
	const [activeTab, setActiveTab] = useState('posts');
	// console.log(userProfile);

	const isLoggedInUserProfile = user?._id === userProfile?._id;
	const isFollowing = userProfile?.followers?.includes(user?._id);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	// local variable for display different tab posts
	const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

	const deleteAccountHandler = async () => {
		try {
			const res = await axiosInstance.delete('/user/profile/delete-account');
			// console.log('delete account res', res);

			if (res.data.success) {
				dispatch(logout());
				navigate('/');
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log('error', error);
			toast.error(error.response.data.message);
		}
	};

	const followOrUnfollowHandler = async () => {
		try {
			const res = await axiosInstance.post(`/user/followorunfollow/${userProfile?._id}`);
			// console.log('follow or unfollow res', res);

			if (res.data.success) {
				dispatch(toggleFollowOrUnfollowUser(userProfile._id));
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	return (
		<div className="flex justify-center max-w-5xl mx-auto pl-10">
			<div className="flex flex-col gap-20 p-8">
				<div className="grid grid-cols-2">
					{/* profile picture */}
					<section className="flex items-center justify-center">
						<Avatar className="h-32 w-32">
							<AvatarImage
								className="object-cover"
								src={userProfile?.profilePicture}
								alt="profile_pic"
							/>
							<AvatarFallback className="bg-gray-200">👤</AvatarFallback>
						</Avatar>
					</section>

					{/* profile info */}
					<section>
						<div className="flex flex-col gap-5">
							{/* edit profile btns etc */}
							<div className="flex items-center gap-3">
								<span>{userProfile?.username}</span>
								{isLoggedInUserProfile ? (
									<>
										<Link to="/account/edit">
											<Button
												variant="secondary"
												className="bg-gray-100 hover:bg-gray-200 h-8"
											>
												Edit Profile
											</Button>
										</Link>

										{/* delete account */}
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="secondary"
													className="bg-red-500 hover:bg-red-600 text-white h-8"
												>
													Delete Account
												</Button>
											</AlertDialogTrigger>

											<AlertDialogContent className={'p-7'}>
												<AlertDialogHeader>
													<AlertDialogTitle className="font-bold text-xl">
														Are you sure you want to delete your account?
													</AlertDialogTitle>

													<AlertDialogDescription className="text-sm">
														This action cannot be undone. All your posts, comments and
														profile data will be permanently deleted.
													</AlertDialogDescription>
												</AlertDialogHeader>

												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>

													<AlertDialogAction
														className="bg-red-500 hover:bg-red-600"
														onClick={deleteAccountHandler}
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</>
								) : isFollowing ? (
									<>
										<Button
											onClick={followOrUnfollowHandler}
											variant="secondary"
											className="bg-gray-100 hover:bg-gray-200 h-8"
										>
											Unfollow
										</Button>
										<Link to="/chat">
											<Button
												variant="secondary"
												className="bg-gray-100 hover:bg-gray-200 h-8"
											>
												Message
											</Button>
										</Link>
									</>
								) : (
									<>
										<Button
											onClick={followOrUnfollowHandler}
											className="bg-[#0095f6] hover:bg-[#3192d2] h-8"
										>
											Follow
										</Button>
									</>
								)}
							</div>

							{/*following followers  */}
							<div className="flex items-center space-x-6">
								<p>
									<span className="font-semibold">{userProfile?.posts.length} </span>posts
								</p>
								<p>
									<span className="font-semibold">{userProfile?.followers.length} </span>
									followers
								</p>
								<p>
									<span className="font-semibold">{userProfile?.following.length} </span>
									following
								</p>
							</div>

							{/* bio */}
							<div className="flex flex-col gap-1">
								<Badge className="w-fit bg-gray-100" variant="secondary">
									<AtSign />
									<span className="pl-1">{userProfile?.username}</span>
								</Badge>
								<span className="font-extralight">{userProfile?.bio || 'bio here...'}</span>
							</div>
						</div>
					</section>
				</div>

				<div className="border-t ml-3 border-t-gray-200">
					{/* tabs */}
					<div className="flex items-center justify-center gap-10 text-sm">
						<span
							className={`cursor-pointer py-3 ${activeTab === 'posts' ? 'font-semibold' : ''}`}
							onClick={() => handleTabChange('posts')}
						>
							POSTS
						</span>
						<span
							className={`cursor-pointer py-3 ${activeTab === 'saved' ? 'font-semibold' : ''}`}
							onClick={() => handleTabChange('saved')}
						>
							SAVED
						</span>
						<span>REELS</span>
						<span>TAGS</span>
					</div>

					{/* posts */}
					<div className="grid grid-cols-3 gap-1 ml-3">
						{displayedPost && displayedPost.length > 0 ? (
							displayedPost.map((post) => (
								<div key={post?._id} className="relative group cursor-pointer">
									<img
										src={post?.image}
										alt="post_img"
										className="rounded-sm w-full aspect-square object-cover"
									/>

									{/* like comment hover */}
									<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group group-hover:opacity-100 transition-opacity">
										<div className="flex items-center text-white space-x-4">
											<button className="flex items-center gap-1 hover:text-gray-300">
												<Heart /> <span>{post?.likes.length}</span>
											</button>
											<button className="flex items-center gap-1 hover:text-gray-300">
												<MessageCircle /> <span>{post?.comments.length}</span>
											</button>
										</div>
									</div>
								</div>
							))
						) : (
							<p className="col-span-3 text-center text-gray-500 py-14">No posts to show</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
export default Profile;
