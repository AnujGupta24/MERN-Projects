import { axiosInstance } from '@/lib/utils';
import { setMessages } from '@/redux/chatSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllMessages = () => {
	const dispatch = useDispatch();
	const { selectedUser } = useSelector((state) => state.chat);
	// console.log(selectedUser);

	useEffect(() => {
		const fetchAllMessage = async () => {
			try {
				const res = await axiosInstance.get(`/message/all/${selectedUser?._id}`);
				// console.log('useGetAllMessages hook res', res);

				const message = res.data.data;
				if (res.data.success) {
					dispatch(setMessages(message));
				}
			} catch (error) {
				console.log(error?.message);
			}
		};

		fetchAllMessage();
	}, [selectedUser, dispatch]);
};

export default useGetAllMessages;
