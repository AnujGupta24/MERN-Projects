import { useSelector } from 'react-redux';
import Post from './Post';

function Posts() {
	const { posts } = useSelector((state) => state.post);

	return (
		<div>
			{posts?.map((post) => (
				<Post key={post._id} post={post} />
			))}
		</div>
	);
}
export default Posts;
