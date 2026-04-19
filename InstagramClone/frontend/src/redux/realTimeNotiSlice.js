import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	likeNotification: [],
};

const realTimeNotiSlice = createSlice({
	name: 'realTimeNotification',
	initialState,
	reducers: {
		setLikeNotification: (state, action) => {
			if (action.payload.type === 'like') {
				state.likeNotification.push(action.payload);
			} else if (action.payload.type === 'dislike') {
				state.likeNotification = state.likeNotification.filter(
					(item) => item.userId !== action.payload.userId,
				);
			}
		},
		clearLikeNotification: (state) => {
			state.likeNotification = [];
		},
	},
});

export const { setLikeNotification, clearLikeNotification } = realTimeNotiSlice.actions;

export default realTimeNotiSlice.reducer;
