import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import { axiosInstance } from '@/lib/utils';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';

function CommentDialog({ open, setOpen }) {
	const { selectedPost, posts } = useSelector((state) => state.post);
	const [comment, setComment] = useState('');
	const dispatch = useDispatch();

	if (!selectedPost) return null;

	const changeInputHandler = (e) => {
		const inputText = e.target.value;
		inputText.trim() ? setComment(inputText) : setComment('');
	};

	const sendCommentHandler = async () => {
		try {
			const res = await axiosInstance.post(`/post/comment/${selectedPost._id}`, {
				text: comment,
			});
			// console.log('send comment handler res', res);

			if (res.data.success) {
				const newComment = res.data.data;

				// update posts arrray
				const updatedPostData = posts.map((p) => {
					if (p._id === selectedPost._id) {
						return {
							...p,
							comments: [...p.comments, newComment],
						};
					}
					return p;
				});

				dispatch(setPosts(updatedPostData));

				// update selectedPost data
				dispatch(
					setSelectedPost({
						...selectedPost,
						comments: [newComment, ...selectedPost.comments],
					}),
				);

				toast.success(res.data.message);
				setComment('');
			}
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	return (
		<Dialog open={open}>
			<DialogContent onInteractOutside={() => setOpen(false)} className="w-full h-[450px] p-0 flex">
				{/* LEFT SIDE IMAGE */}
				<div className="w-1/2">
					<img
						src={selectedPost?.image}
						alt="post_img"
						className="w-full h-full object-cover rounded-l-lg"
					/>
				</div>

				{/* RIGHT SIDE COMMENT SECTION */}
				<div className="w-1/2 flex flex-col">
					{/* HEADER */}
					<div className="flex items-center justify-between p-3">
						<div className="flex gap-3 items-center">
							<Link to={''}>
								<Avatar>
									<AvatarImage
										className="object-cover"
										src={selectedPost?.author?.profilePicture}
									/>
									<AvatarFallback className="bg-gray-200">CN</AvatarFallback>
								</Avatar>
							</Link>

							<Link className="font-semibold text-sm">{selectedPost?.author?.username}</Link>
						</div>

						{/* three dots */}
						<Dialog>
							<DialogTrigger asChild>
								<MoreHorizontal className="cursor-pointer" />
							</DialogTrigger>

							<DialogContent className="flex flex-col w-1/4 items-center text-sm text-center">
								<div className="cursor-pointer w-full text-[#ed4956] font-semibold">Unfollow</div>
								<div className="cursor-pointer w-full">Add to favourites</div>
							</DialogContent>
						</Dialog>
					</div>

					<hr />

					{/* COMMENTS LIST */}
					<div className="flex-1 overflow-y-auto p-2 space-y-2">
						{selectedPost.comments?.map((comment) => (
							<Comment key={comment._id} comment={comment} />
						))}
					</div>

					{/* COMMENT INPUT */}
					<div className="border-t p-3">
						<div className="flex items-center gap-2">
							<input
								value={comment}
								onChange={changeInputHandler}
								type="text"
								placeholder="Add a comment..."
								className="w-full text-sm outline-none border border-gray-300 p-2 rounded"
							/>

							<Button
								disabled={!comment.trim()}
								onClick={sendCommentHandler}
								variant="outline"
								className=" hover:bg-black hover:text-white"
							>
								Send
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
export default CommentDialog;
