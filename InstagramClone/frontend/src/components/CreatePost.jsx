import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { axiosInstance, readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

function CreatePost({ open, setOpen }) {
	const imageRef = useRef();
	const [file, setFile] = useState('');
	const [caption, setCaption] = useState('');
	const [imagePreview, setImagePreview] = useState('');
	const [loading, setLoading] = useState(false);

	const { user } = useSelector((state) => state.auth);
	const { posts } = useSelector((state) => state.post);
	const dispatch = useDispatch();

	const fileChangeHandler = async (e) => {
		const file = e.target.files?.[0];

		if (file) {
			setFile(file);
			const dataUrl = await readFileAsDataURL(file);
			setImagePreview(dataUrl);
		}
	};

	const createPostHandler = async () => {
		const formData = new FormData();
		formData.append('caption', caption);
		if (imagePreview) formData.append('image', file);

		try {
			setLoading(true);

			const res = await axiosInstance.post('/post/create', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			// console.log('createposthandler response', res);

			if (res.data.success) {
				dispatch(setPosts([res.data.data, ...posts]));
				toast.success(res.data.message);

				setCaption('');
				setFile('');
				setImagePreview('');
				setOpen(false);
			}
		} catch (error) {
			toast.error(error?.response?.data?.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open}>
			<DialogContent onInteractOutside={() => setOpen(false)}>
				<DialogHeader className="text-center font-semibold">Create new post</DialogHeader>
				<div className="flex gap-2 items-center">
					<Avatar>
						<AvatarImage className={'object-cover'} src={user?.profilePicture} alt="profile_img" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>

					{/* username bio of the create post */}
					<div>
						<h1 className="font-semibold text-xs">{user?.username}</h1>
						<span className="text-gray-600 text-xs">{user?.bio}</span>
					</div>
				</div>

				{/* new post caption */}
				<Textarea
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
					className="focus-visible:ring-transparent border-none"
					placeholder="write a caption..."
				></Textarea>

				{/* image preview while creating post */}
				{imagePreview && (
					<div className="w-full h-64 flex items-center justify-center">
						<img
							src={imagePreview}
							alt="preview_img"
							className="object-contain h-full w-full rounded-md"
						/>
					</div>
				)}

				<input ref={imageRef} type="file" onChange={fileChangeHandler} className="hidden" />

				{/* button to select pic from computer */}
				<Button
					onClick={() => imageRef.current.click()}
					className="w-fit mx-auto bg-[#0095f6] hover:bg-[#258bcf]"
				>
					Select from computer
				</Button>

				{/* post btn conditional rendering on imagePreview */}
				{imagePreview &&
					(loading ? (
						<Button>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Please wait
						</Button>
					) : (
						<Button onClick={createPostHandler} type="submit" className="w-full">
							Post
						</Button>
					))}
			</DialogContent>
		</Dialog>
	);
}
export default CreatePost;
