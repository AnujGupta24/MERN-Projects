import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '@/redux/authSlice';

function Editprofile() {
	const imageRef = useRef();
	const { user } = useSelector((state) => state.auth);
	const [loading, setLoading] = useState(false);
	const [input, setInput] = useState({
		profilePicture: user?.profilePicture,
		bio: user?.bio,
		gender: user?.gender,
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const fileChangeHandler = (e) => {
		const file = e.target.files?.[0];
		if (file) setInput({ ...input, profilePicture: file });
	};

	const selectChangeHandler = (value) => {
		setInput((prev) => ({
			...prev,
			gender: value,
		}));
	};

	const editProfileHandler = async () => {
		const formdata = new FormData();

		formdata.append('bio', input.bio);
		formdata.append('gender', input.gender);
		if (input.profilePicture) {
			formdata.append('profilePicture', input.profilePicture);
		}

		try {
			setLoading(true);
			const res = await axiosInstance.patch(`/user/profile/edit`, formdata, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (res.data.success) {
				const profile = res.data.data;
				const updatedUserData = {
					...user,
					bio: profile?.bio,
					profilePicture: profile?.profilePicture,
					gender: profile?.gender,
				};
				dispatch(setAuthUser(updatedUserData));
				navigate(`/profile/${user?._id}`);
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error?.response?.data?.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex max-w-2xl mx-auto">
			<section className="flex flex-col gap-3 w-full my-6">
				<h1 className="font-bold text-xl">Edit Profile</h1>
				<div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage className="object-cover" src={user?.profilePicture} alt="profile_ing" />
							<AvatarFallback className="bg-gray-200">CN</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="font-bold text-sm">{user?.username}</h1>
							<span className="text-gray-600">{user?.bio || 'Bio here...'}</span>
						</div>
					</div>

					<input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
					<Button
						onClick={() => imageRef?.current.click()}
						className="bg-[#0095f6] h-8 hover:bg-[#318bc7]"
					>
						Change photo
					</Button>
				</div>

				<div>
					<h1 className="font-bold text-xl mb-2">Bio</h1>
					<Textarea
						value={input.bio}
						onChange={(e) => setInput({ ...input, bio: e.target.value })}
						name="bio"
						className="focus-visible:ring-transparent"
					/>
				</div>

				<div>
					<h1 className="font-bold text-xl mb-2">Gender</h1>
					<Select defaultValue={input.gender || 'select'} onValueChange={selectChangeHandler}>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Male">Male</SelectItem>
								<SelectItem value="Female">Female</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div className="flex justify-end">
					{loading ? (
						<Button className="w-fit bg-[#0095f6] hover:bg-[#2a8ccd]">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Please wait...
						</Button>
					) : (
						<Button className="w-fit h-8 bg-[#0095f6] hover:bg-[#318bc7]" onClick={editProfileHandler}>
							Submit
						</Button>
					)}
				</div>
			</section>
		</div>
	);
}
export default Editprofile;
