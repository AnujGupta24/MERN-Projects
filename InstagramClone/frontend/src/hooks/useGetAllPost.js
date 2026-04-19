import { axiosInstance } from '@/lib/utils';
import { setPosts } from '@/redux/postSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllPost = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchAllPost = async () => {
			try {
				const res = await axiosInstance.get('/post/all');
				// console.log('userGetAllPost hook res', res);

				const posts = res.data.data;
				if (res.data.success) {
					dispatch(setPosts(posts));
				}
			} catch (error) {
				console.log(error?.message);
			}
		};

		fetchAllPost();
	}, [dispatch]);
};

export default useGetAllPost;
