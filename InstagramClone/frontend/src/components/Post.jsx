import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import CommentDialog from './CommentDialog';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/utils';
import { setSelectedPost, setPosts } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { toggleFollowFromPost } from '@/redux/authSlice';

function Post({ post }) {
	const [text, setText] = useState('');
	const [open, setOpen] = useState(false);
	const { user } = useSelector((state) => state.auth);
	const { posts } = useSelector((state) => state.post);
	const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
	const [likeCount, setLikeCount] = useState(post?.likes?.length);

	const dispatch = useDispatch();
	const isFollowing = user?.following?.includes(post.author?._id);

	const changeInputHandler = (e) => {
		const inputText = e.target.value;
		inputText.trim() ? setText(inputText) : setText('');
	};

	const toggleLikeHandler = async (postId) => {
		try {
			const action = liked ? 'dislike' : 'like';
			const res = await axiosInstance.post(`post/${action}/${postId}`);
			// console.log("toggleLikeHandler res", res);

			if (res.data.success) {
				const updatedLikes = liked ? likeCount - 1 : likeCount + 1;
				setLiked(!liked);
				setLikeCount(updatedLikes);

				// update redux posts
				// Find that post, Update its likes, Keep the other posts unchanged, Send the new array to Redux
				const updatedPostData = posts.map((p) =>
					p._id === postId
						? {
								...p,
								likes: liked ? p.likes.filter((id) => id !== user?._id) : [...p.likes, user?._id],
							}
						: p,
				);
				dispatch(setPosts(updatedPostData));
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	const sendCommentHandler = async () => {
		try {
			const res = await axiosInstance.post(`/post/comment/${post._id}`, {
				text,
			});
			// console.log('sendCommentHandler res', res);

			if (res.data.success) {
				const newComment = res.data.data;

				const updatedPostData = posts.map((p) => {
					if (p._id === post._id) {
						return {
							...p,
							comments: [newComment, ...p.comments],
						};
					}
					return p;
				});

				dispatch(setPosts(updatedPostData));
				toast.success(res.data.message);
				setText('');
			}
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	};

	const deletePostHandler = async () => {
		try {
			const res = await axiosInstance.delete(`post/${post?._id}`);

			if (res.data.success) {
				const updatedPostsData = posts.filter((postItem) => postItem._id !== post?._id);
				dispatch(setPosts(updatedPostsData));
				toast.success(res.data.message);
				setOpen(false);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	const bookmarkHandler = async (postid) => {
		try {
			const res = await axiosInstance.get(`post/bookmark/${postid}`);
			// console.log('bookmarkhandler res', res);

			if (res.data.success) {
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	const followOrUnfollowHandler = async () => {
		try {
			const res = await axiosInstance.post(`/user/followorunfollow/${post.author._id}`);

			if (res.data.success) {
				dispatch(toggleFollowFromPost(post.author._id));
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response.data.message);
		}
	};

	return (
		<div className="my-4 w-full max-w-96 mx-auto border-b pb-1">
			<div className="flex items-center justify-between">
				<Link className="flex items-center gap-2" to={`/profile/${post.author?._id}`}>
					<Avatar>
						<AvatarImage className={'object-cover'} src={post.author?.profilePicture} alt="post_img" />
						<AvatarFallback className="bg-gray-200">CN</AvatarFallback>
					</Avatar>
					<div className="flex items-center gap-3">
						<h1>{post.author?.username}</h1>
						{user?._id === post.author._id && (
							<Badge className="bg-gray-100" variant="secondary">
								Author
							</Badge>
						)}
					</div>
				</Link>

				{/* nufollow addtoFav delete btns */}
				<Dialog>
					<DialogTrigger asChild>
						<MoreHorizontal className="cursor-pointer" />
					</DialogTrigger>

					<DialogContent className="flex flex-col items-center text-sm text-center">
						{post?.author?._id !== user?._id && (
							<Button
								onClick={followOrUnfollowHandler}
								variant="ghost"
								className={`cursor-pointer w-fit p-5 font-bold ${
									isFollowing
										? 'text-[#ed4956] hover:text-[#f41d2f]'
										: 'text-[#3badf8] hover:text-[#2f8bd1]'
								}`}
							>
								{isFollowing ? 'Unfollow' : 'Follow'}
							</Button>
						)}
						<Button variant="outline" className="cursor-pointer  w-fit">
							Add to favourite
						</Button>

						{/* only login user can delete their posts */}
						{user && user?._id === post?.author._id && (
							<Button
								onClick={deletePostHandler}
								variant="secondary"
								className="cursor-pointer w-fit text-red-500 hover:text-red-700 rounded-md"
							>
								Delete
							</Button>
						)}
					</DialogContent>
				</Dialog>
			</div>

			<img className="rounded-sm my-2 w-full aspect-square object-cover" src={post?.image} alt="post_img" />
			<div className="flex items-center justify-between my-2">
				{/* like message send btns */}
				<div className="flex items-center gap-3">
					<Heart
						className={`cursor-pointer ${liked ? 'text-red-500 fill-red-500' : ''}`}
						onClick={() => toggleLikeHandler(post?._id)}
					/>
					<MessageCircle
						size={'20px'}
						onClick={() => {
							dispatch(setSelectedPost(post));
							setOpen(true);
						}}
						className="cursor-pointer hover:text-gray-600"
					/>
					<Send size={'20px'} className="cursor-pointer hover:text-gray-600" />
				</div>
				<Bookmark
					size={'22px'}
					onClick={() => bookmarkHandler(post?._id)}
					className="cursor-pointer hover:text-gray-600"
				/>
			</div>

			{post.likes.length > 0 && <span className="font-medium text-sm block">{likeCount} likes</span>}
			<p>
				<span className="font-medium text-sm mr-2">{post.author?.username}</span>
				{post.caption}
			</p>

			{/* comment section */}
			<span
				onClick={() => {
					dispatch(setSelectedPost(post));
					setOpen(true);
				}}
				className="text-sm cursor-pointer text-gray-400"
			>
				{post.comments?.length > 0 ? `view all ${post.comments.length} comments` : 'there are no comments'}
			</span>

			<CommentDialog open={open} setOpen={setOpen} />

			{/* comment input */}
			<div className="flex items-center justify-center">
				<input
					type="text"
					value={text}
					onChange={changeInputHandler}
					placeholder="what do you think of this?"
					className="outline-none text-sm w-full"
				/>
				{text && (
					<span onClick={sendCommentHandler} className="text-blue-600 text-sm cursor-pointer">
						Post
					</span>
				)}
			</div>
		</div>
	);
}

export default Post;
