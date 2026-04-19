import { axiosInstance } from '@/lib/utils';
import { setUserProfile } from '@/redux/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetUserProfile = (userId) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const res = await axiosInstance.get(`/user/profile/${userId}`, { withCredentials: true });
				// console.log("getUserProfile.js", res);

				if (res.data.success) {
					const user = res.data.data;
					dispatch(setUserProfile(user));
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchUserProfile();
	}, [dispatch, userId]);
};
export default useGetUserProfile;
