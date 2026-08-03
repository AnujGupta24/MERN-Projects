import { axiosInstance } from '@/lib/utils';
import { setSuggestedUsers } from '@/redux/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetSuggestedUsers = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchSuggestedUsers = async () => {
			try {
				const res = await axiosInstance.get('/user/suggested-users');
				// console.log('useGetSuggestedUsers API RES', res);

				const users = res.data.data.users;
				if (res.data.success) {
					dispatch(setSuggestedUsers(users));
				}
			} catch (error) {
				console.log(error?.message);
			}
		};

		fetchSuggestedUsers();
	}, [dispatch]);
};

export default useGetSuggestedUsers;
