import { Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setSelectedPost } from '@/redux/postSlice';

function Comment({ comment }) {
	const { user } = useSelector((state) => state.auth);
	const { selectedPost, posts } = useSelector((state) => state.post);
	const dispatch = useDispatch();

	const canDelete = user?._id === selectedPost.author?._id;

	const deleteCommentHandler = async () => {
		try {
			const res = await axiosInstance.delete(`/post/delete-comment/${comment?._id}`);
			// console.log('delete comment res', res);

			if (res.data.success) {
				// update posts array
				const updatedPosts = posts.map((p) => {
					if (p._id === selectedPost._id) {
						return {
							...p,
							comments: p.comments.filter((c) => c._id !== comment?._id),
						};
					}
					return p;
				});
				dispatch(setPosts(updatedPosts));

				// update selectedPost
				dispatch(
					setSelectedPost({
						...selectedPost,
						comments: selectedPost.comments.filter((c) => c._id !== comment?._id),
					}),
				);
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	return (
		<div className="my-2 ">
			<div className="flex items-center justify-between">
				<div className="flex gap-2 items-center">
					<Avatar>
						<AvatarImage src={comment?.author?.profilePicture} className="object-cover"></AvatarImage>
						<AvatarFallback className="bg-gray-200">CN</AvatarFallback>
					</Avatar>
					<h1 className="font-bold text-sm">
						{comment?.author.username} <span className="font-normal pl-1">{comment?.text}</span>
					</h1>
				</div>
				{canDelete && (
					<Trash2
						onClick={deleteCommentHandler}
						className="h-4 w-4 cursor-pointer text-red-500 hover:text-red-700 rounded-full"
					/>
				)}
			</div>
		</div>
	);
}
export default Comment;
