import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: null, // loggedinUser
	userProfile: null, // normal user
	suggestedUsers: [],
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthUser: (state, action) => {
			state.user = action.payload;
		},
		setSuggestedUsers: (state, action) => {
			state.suggestedUsers = action.payload;
		},
		setUserProfile: (state, action) => {
			state.userProfile = action.payload;
		},
		logout: () => initialState,
		toggleFollowOrUnfollowUser: (state, action) => {
			const targetUserId = action.payload;
			const isFollowing = state.user.following.includes(targetUserId);

			if (isFollowing) {
				// unfollow
				state.user.following = state.user.following.filter((id) => id !== targetUserId);
				state.userProfile.followers = state.userProfile.followers.filter((id) => id !== state.user._id);
			} else {
				// follow
				state.user.following.push(targetUserId);
				state.userProfile.followers.push(state.user._id);
			}
		},
		toggleFollowFromPost: (state, action) => {
			const authorId = action.payload;
			const isFollowing = state.user.following.includes(authorId);

			if (isFollowing) {
				// unfollow
				state.user.following = state.user.following.filter((id) => id !== authorId);
			} else {
				// follow
				state.user.following.push(authorId);
			}
		},
	},
});

export const {
	setAuthUser,
	setSuggestedUsers,
	setUserProfile,
	logout,
	toggleFollowOrUnfollowUser,
	toggleFollowFromPost,
} = authSlice.actions;

export default authSlice.reducer;
