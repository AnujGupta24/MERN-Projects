import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import { useState } from 'react';
import CreatePost from './CreatePost';
import { axiosInstance } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { clearLikeNotification } from '@/redux/realTimeNotiSlice';

function LeftSidebar() {
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	const { likeNotification } = useSelector((state) => state.realTimeNotification);
	console.log('LOGGEDIN USER', user);

	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [notificationOpen, setNotificationOpen] = useState(false);

	const sidebarItems = [
		{ icon: <Home />, text: 'Home' },
		// { icon: <Search />, text: 'Search' },
		// { icon: <TrendingUp />, text: 'Explore' },
		{ icon: <MessageCircle />, text: 'Messages' },
		{ icon: <Heart />, text: 'Notifications' },
		{ icon: <PlusSquare />, text: 'Create' },
		{
			icon: (
				<Avatar className="h-6 w-6">
					<AvatarImage className={'object-cover'} src={user?.profilePicture} />
					<AvatarFallback className="bg-gray-200">👤</AvatarFallback>
				</Avatar>
			),
			text: 'Profile',
		},
		{ icon: <LogOut />, text: 'Logout' },
	];

	const logoutHandler = async () => {
		try {
			const res = await axiosInstance.post('/user/logout');
			// console.log(res.data.data);

			if (res.data.success) {
				dispatch(logout());
				toast.success(res.data.message);
				navigate('/login');
			}
		} catch (error) {
			// axios creates this structure: error.response.data and for actualresdata: res.data & backend: res.data.data
			// backend controls what insides the data: data.message - {"success": false,"message": "user not authenticated"}
			// console.log('logout error.response:', error.response);
			toast.error(error?.response?.data?.message);

			// even if API fails, force logout on frontend
			dispatch(logout());
			navigate('/login');
		}
	};

	const sidebarHandler = (textType) => {
		if (textType === 'Logout') {
			logoutHandler();
		} else if (textType === 'Create') {
			setOpen(true);
		} else if (textType === 'Profile') {
			navigate(`/profile/${user?._id}`);
		} else if (textType === 'Home') {
			navigate('/');
		} else if (textType === 'Messages') {
			navigate('/chat');
		}
	};

	return (
		<div className="fixed top-0 z-10 left-0 px-3 border-r border-r-gray-300 w-[16%] h-screen">
			{sidebarItems.map((item, index) => (
				<div
					onClick={() => sidebarHandler(item.text)}
					key={index}
					className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
				>
					{item.icon}
					<span>{item.text}</span>

					{/* notifications */}
					{item.text === 'Notifications' && (
						<Popover
							open={notificationOpen}
							onOpenChange={(val) => {
								setNotificationOpen(val);

								// clear when opening
								if (!val) dispatch(clearLikeNotification());
							}}
						>
							<PopoverTrigger asChild>
								<div className="relative">
									{likeNotification.length > 0 && (
										<span className="absolute right-28 -top-4 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
											{likeNotification.length}
										</span>
									)}
								</div>
							</PopoverTrigger>

							<PopoverContent>
								{likeNotification.length === 0 ? (
									<p>No new notification</p>
								) : (
									likeNotification.map((notification) => (
										<div key={notification.userId} className="flex items-center gap-3 my-3">
											<Avatar className="h-6 w-6">
												<AvatarImage src={notification.userDetails?.profilePicture} className="object-cover" />
												<AvatarFallback>👤</AvatarFallback>
											</Avatar>

											<p className="text-sm">
												<span className="font-bold">{notification.userDetails?.username}</span> liked your post
											</p>
										</div>
									))
								)}
							</PopoverContent>
						</Popover>
					)}
				</div>
			))}

			<CreatePost open={open} setOpen={setOpen} />
		</div>
	);
}

export default LeftSidebar;
