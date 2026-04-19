import { axiosInstance } from '@/lib/utils';
import { setAuthUser } from '@/redux/authSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

export function useAuthCheck() {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	useEffect(() => {
		const checkUser = async () => {
			if (!user?._id) return;

			try {
				const res = await axiosInstance.get(`/user/profile/${user._id}`);

				if (res.data.success) {
					dispatch(setAuthUser(res.data.data));
				}
			} catch (error) {
				toast.error(error.message);
				dispatch(setAuthUser(null));
			}
		};

		checkUser();
	}, [dispatch, user?._id]);
}
